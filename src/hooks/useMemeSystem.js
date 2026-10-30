import { useCallback, useEffect, useRef, useState } from "react";
import { createMemeDirector } from "../systems/memeDirector";

const activityEvents = [
  "pointermove",
  "pointerdown",
  "touchstart",
  "wheel",
  "scroll",
];
export function useMemeSystem({ blocked, moving }) {
  const director = useRef(null);
  director.current ??= createMemeDirector(performance.now());
  const [overlay, setOverlay] = useState(null);
  const movingRef = useRef(moving);
  movingRef.current = moving;
  const emit = useCallback((id, trigger) => {
    const current = director.current.show(id, trigger, performance.now());
    if (current) setOverlay(current);
    return Boolean(current);
  }, []);
  const dismiss = useCallback(() => {
    director.current.dismiss(performance.now());
    setOverlay(null);
  }, []);
  useEffect(() => {
    director.current.block(blocked, performance.now());
    setOverlay(director.current.current);
  }, [blocked]);
  useEffect(() => {
    const keys = new Set();
    let pointerDown = false;
    const activity = () => {
      director.current.activity(performance.now());
      if (!director.current.current)
        setOverlay((old) => (old === null ? old : null));
    };
    const down = (event) => {
      if (event.type === "pointerdown") pointerDown = true;
      activity();
    };
    const up = () => {
      pointerDown = false;
      activity();
    };
    const keydown = (event) => {
      keys.add(event.code);
      activity();
    };
    const keyup = (event) => {
      keys.delete(event.code);
      activity();
    };
    const reset = () => {
      keys.clear();
      pointerDown = false;
      activity();
    };
    const change = () => {
      reset();
    };
    for (const event of activityEvents)
      window.addEventListener(
        event,
        event === "pointerdown" ? down : activity,
        { passive: true, capture: true },
      );
    window.addEventListener("keydown", keydown);
    window.addEventListener("keyup", keyup);
    window.addEventListener("pointerup", up, {capture:true});
    window.addEventListener("pointercancel", up, {capture:true});
    window.addEventListener("touchend", up, {capture:true,passive:true});
    window.addEventListener("click", up, {capture:true});
    window.addEventListener("blur", reset);
    document.addEventListener("visibilitychange", change);
    const timer = setInterval(() => {
      const input = document.activeElement?.matches(
        'input,textarea,select,[contenteditable="true"]',
      );
      if (document.hidden || input) {
        director.current.activity(performance.now());
        return;
      }
      director.current.moving(
        movingRef.current || keys.size > 0 || pointerDown,
        performance.now(),
      );
      const next = director.current.tick(performance.now());
      setOverlay((old) => (old === next ? old : next));
    }, 250);
    return () => {
      clearInterval(timer);
      for (const event of activityEvents)
        window.removeEventListener(
          event,
          event === "pointerdown" ? down : activity,
          { capture: true },
        );
      window.removeEventListener("keydown", keydown);
      window.removeEventListener("keyup", keyup);
      window.removeEventListener("pointerup", up, {capture:true});
      window.removeEventListener("pointercancel", up, {capture:true});
      window.removeEventListener("touchend", up, {capture:true});
      window.removeEventListener("click", up, {capture:true});
      window.removeEventListener("blur", reset);
      document.removeEventListener("visibilitychange", change);
    };
  }, []);
  return { overlay, emit, dismiss };
}
