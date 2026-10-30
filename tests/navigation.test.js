import test from "node:test";
import assert from "node:assert/strict";
import { destinations } from "../src/data/portfolio.js";
import {
  constrainFlightPosition,
  getApproachPosition,
  getNearbyDestination,
} from "../src/components/game/navigation.js";

test("flight stays inside the playable system on every edge", () => {
  for (const [x, z] of [
    [-100, -100],
    [100, 100],
    [-100, 100],
    [100, -100],
  ]) {
    const p = constrainFlightPosition({ x, z });
    assert.ok(p.x >= -48 && p.x <= 48);
    assert.ok(p.z >= -60 && p.z <= 40);
  }
});

test("a craft at a planet center or inside its surface is pushed safely outside", () => {
  for (const destination of destinations.filter((item) =>
    ["home", "projects", "memes"].includes(item.id),
  )) {
    for (const offset of [0, 0.1, -1, 2]) {
      const p = constrainFlightPosition({
        x: destination.position[0] + offset,
        z: destination.position[2],
      });
      assert.ok(
        Math.hypot(
          p.x - destination.position[0],
          p.z - destination.position[2],
        ) >=
          destination.radius + 1.4 - 1e-9,
      );
      assert.ok(Number.isFinite(p.x) && Number.isFinite(p.z));
    }
  }
});

test("every fast-travel arrival is safe and within interaction range of its destination", () => {
  for (const destination of destinations) {
    const [x, , z] = getApproachPosition(destination.id);
    assert.equal(getNearbyDestination({ x, z }), destination.id);
    const constrained = constrainFlightPosition({ x, z });
    assert.deepEqual(constrained, { x, z });
  }
});

test("open space has no interaction target and invalid travel requests are rejected", () => {
  assert.equal(getNearbyDestination({ x: -48, z: -60 }), null);
  assert.equal(getApproachPosition("missing"), null);
});

test("the spawn location allows immediate access to home", () => {
  assert.equal(getNearbyDestination({ x: 0, z: 17 }), "home");
});
