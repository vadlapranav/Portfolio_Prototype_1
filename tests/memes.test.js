import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createMemeDirector } from "../src/systems/memeDirector.js";
import { memeTiming } from "../src/data/memeTiming.js";
import { memeCatalog, worldMemes } from "../src/data/memeCatalog.js";

test("idle signal waits 15 seconds, expires at 8 seconds, and never repeats in the same idle period", () => {
  const director = createMemeDirector(0);
  assert.equal(director.tick(14999), null);
  const signal = director.tick(15000);
  assert.equal(signal.id, "waiting");
  assert.equal(director.tick(16000), signal);
  assert.equal(director.tick(15000 + memeTiming.displayMs), null);
  assert.equal(director.tick(180000), null);
});
test("activity clears an idle signal and cooldown prevents it from immediately returning", () => {
  const director = createMemeDirector(0);
  director.tick(15000);
  director.activity(16000);
  assert.equal(director.current, null);
  assert.equal(director.tick(31000), null);
  assert.equal(director.tick(75000)?.id, "waiting");
});
test("modal reading and hidden tabs suspend the timeline and restart the idle clock on return", () => {
  const director = createMemeDirector(0);
  director.block(true, 10000);
  assert.equal(director.tick(120000), null);
  director.block(false, 120000);
  assert.equal(director.tick(134999), null);
  assert.equal(director.tick(135000)?.id, "waiting");
  director.block(true, 136000);
  assert.equal(director.current, null);
});
test("held movement and active touches cannot be mistaken for idle", () => {
  const director = createMemeDirector(0);
  director.moving(true, 14000);
  assert.equal(director.tick(50000), null);
  director.moving(true, 50000);
  director.moving(false, 50001);
  assert.equal(director.tick(64999), null);
  assert.equal(director.tick(65000)?.id, "waiting");
});
test("the shared slot rejects simultaneous triggers, rate limits discoveries and honours dismissal", () => {
  const director = createMemeDirector(0);
  assert.ok(director.show("shocked", "encounter", 1000));
  assert.equal(director.show("choices", "encounter", 1001), null);
  director.dismiss(2000);
  assert.equal(director.current, null);
  assert.equal(director.show("choices", "encounter", 2001), null);
  assert.ok(director.show("choices", "encounter", 26000));
  director.dismiss(27000);
  assert.equal(director.show("shocked", "encounter", 100000), null);
});
test("meme assets are local, unique, and use their measured intrinsic image ratios", () => {
  const inventory = JSON.parse(
    readFileSync(
      new URL("../docs/asset-inventory.json", import.meta.url),
      "utf8",
    ),
  );
  assert.equal(
    new Set(memeCatalog.map((asset) => asset.id)).size,
    memeCatalog.length,
  );
  for (const asset of memeCatalog) {
    const file = asset.file.startsWith("file:")
      ? new URL(asset.file)
      : new URL(`../public${asset.file}`, import.meta.url);
    assert.ok(existsSync(file), `Missing ${asset.id}`);
    const measured = inventory.images.find((item) =>
      file.pathname.replaceAll("%20", " ").endsWith(item.path),
    );
    if (measured) {
      assert.equal(asset.width, measured.width);
      assert.equal(asset.height, measured.height);
    } else {
      const svg = readFileSync(file, "utf8");
      assert.match(
        svg,
        new RegExp(`width="${asset.width}" height="${asset.height}"`),
      );
    }
    assert.equal(asset.aspectRatio, asset.width / asset.height);
    assert.ok(asset.alt.length > 15);
  }
  assert.ok(new Set(worldMemes.map((item) => item.zone)).size >= 5);
});
