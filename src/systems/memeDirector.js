import { memeTiming } from "../data/memeTiming.js";

// One timeline and one presentation slot, shared by both portfolio modes.
export function createMemeDirector(now = 0, timing = memeTiming) {
  let lastActivity = now,
    blocked = false,
    busy = false,
    current = null,
    idleShown = false;
  let idleCooldownUntil = 0,
    contextCooldownUntil = 0;
  const seen = new Set();
  const dismiss = (time) => {
    current = null;
    lastActivity = time;
    idleShown = false;
  };
  return {
    activity(time) {
      lastActivity = time;
      idleShown = false;
      if (current?.trigger === "idle") current = null;
    },
    block(value, time) {
      if (blocked !== value) {
        blocked = value;
        lastActivity = time;
        idleShown = false;
        if (value) current = null;
      }
    },
    moving(value, time) {
      busy = value;
      if (value) {
        lastActivity = time;
        idleShown = false;
        if (current?.trigger === "idle") current = null;
      }
    },
    show(id, trigger, time) {
      if (
        blocked ||
        current ||
        time < contextCooldownUntil ||
        seen.has(`${trigger}:${id}`)
      )
        return null;
      current = { id, trigger, expiresAt: time + timing.displayMs };
      contextCooldownUntil = time + timing.contextCooldownMs;
      seen.add(`${trigger}:${id}`);
      return current;
    },
    dismiss,
    tick(time) {
      if (current && time >= current.expiresAt) current = null;
      if (
        !blocked &&
        !busy &&
        !current &&
        !idleShown &&
        time - lastActivity >= timing.idleMs &&
        time >= idleCooldownUntil
      ) {
        current = {
          id: "waiting",
          trigger: "idle",
          expiresAt: time + timing.displayMs,
        };
        idleShown = true;
        idleCooldownUntil = time + timing.cooldownMs;
      }
      return current;
    },
    get current() {
      return current;
    },
  };
}
