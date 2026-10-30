import test from "node:test";
import assert from "node:assert/strict";
import { createAudioSystem } from "../src/systems/audioSystem.js";

function fixture() {
  let time = 0;
  const players = [],
    pending = new Set();
  const system = createAudioSystem({
    now: () => time,
    createContext: () => null,
    schedule: (fn) => {
      pending.add(fn);
      return fn;
    },
    cancel: (fn) => pending.delete(fn),
    createMedia: (file) => {
      const player = {
        file,
        plays: 0,
        pauses: 0,
        volume: 0,
        currentTime: 0,
        play() {
          this.plays++;
          return Promise.resolve();
        },
        pause() {
          this.pauses++;
        },
        removeAttribute() {},
        load() {},
      };
      players.push(player);
      return player;
    },
  });
  return {
    system,
    players,
    pending,
    advance: (next) => {
      time = next;
    },
  };
}
test("sound is opt-in and media does not load before explicit interaction", () => {
  const { system, players } = fixture();
  assert.equal(system.play("reaction"), false);
  system.unlock();
  assert.equal(system.play("reaction"), false);
  assert.equal(players.length, 0);
  system.configure({ muted: false });
  assert.equal(system.play("reaction"), true);
  assert.equal(players.length, 1);
  assert.ok(players[0].volume < 0.2);
  system.dispose();
});
test("repeated events are deduplicated and supplied clips never overlap", () => {
  const { system, players, advance } = fixture();
  system.configure({ muted: false });
  system.unlock();
  assert.equal(system.play("reaction"), true);
  assert.equal(system.play("reaction"), false);
  assert.equal(players[0].plays, 1);
  assert.equal(system.play("discovery"), true);
  assert.ok(players[0].pauses > 0);
  advance(9100);
  assert.equal(system.play("reaction"), true);
  assert.equal(players.length, 2);
  assert.ok(players[1].pauses > 0);
  system.dispose();
});
test("master mute cancels timers and stops playing media; categories can be disabled independently", () => {
  const { system, players, pending, advance } = fixture();
  system.configure({ muted: false });
  system.unlock();
  system.play("reaction");
  assert.equal(pending.size, 1);
  system.configure({ muted: true });
  assert.equal(pending.size, 0);
  assert.ok(players[0].pauses > 0);
  advance(20000);
  assert.equal(system.play("discovery"), false);
  system.configure({ muted: false, memes: false });
  assert.equal(system.play("reaction"), false);
  system.configure({ memes: true });
  assert.equal(system.play("reaction"), true);
  system.dispose();
  assert.equal(system.play("reaction"), false);
});
test("audio rejection and missing browser audio APIs cannot break navigation", async () => {
  const system = createAudioSystem({
    settings: { muted: false },
    createContext: () => null,
    createMedia: () => {
      throw new Error("Unavailable audio");
    },
  });
  system.unlock();
  assert.equal(system.play("reaction"), false);
  assert.equal(system.play("map"), false);
  system.dispose();
  const rejecting = createAudioSystem({
    settings: { muted: false },
    createContext: () => null,
    createMedia: () => ({
      pause() {},
      play() {
        return Promise.reject(new Error("Autoplay denied"));
      },
      removeAttribute() {},
      load() {},
    }),
  });
  rejecting.unlock();
  assert.equal(rejecting.play("reaction"), true);
  await Promise.resolve();
  rejecting.dispose();
});
