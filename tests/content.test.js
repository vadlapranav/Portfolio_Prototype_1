import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { projects } from "../src/data/projects.js";
import {
  profile,
  experience,
  education,
  destinations,
} from "../src/data/portfolio.js";
import { skillCategories } from "../src/data/skills.js";

test("the original four projects and the supplied logistics case study are available", () => {
  assert.deepEqual(
    projects.map((project) => project.id),
    ["logistics", "phishing", "url-classifier", "rc-car", "medfusion"],
  );
  for (const project of projects) {
    assert.ok(project.title?.length > 0);
    for (const field of ["description", "problem", "solution"])
      assert.ok(project[field]?.length > 10);
    assert.ok(project.techStack.length && project.impact.length);
    for (const field of ["github", "demo"])
      if (project[field])
        assert.equal(new URL(project[field]).protocol, "https:");
  }
  assert.match(projects[0].note, /synthetic/i);
  assert.match(projects[0].note, /separately/);
});

test("the résumé resource is a real local PDF, not an SPA fallback or placeholder", () => {
  const file = new URL(`../public${profile.resume}`, import.meta.url);
  assert.ok(existsSync(file));
  assert.equal(readFileSync(file).subarray(0, 5).toString(), "%PDF-");
});

test("updated experience, education and all destination targets have stable data", () => {
  assert.equal(experience.length, 2);
  assert.equal(experience[0].organization, "Mahindra Logistics Ltd");
  assert.equal(education.length, 3);
  assert.equal(new Set(destinations.map((item) => item.id)).size, 6);
  assert.ok(
    skillCategories.some((category) => category.name === "Optimization"),
  );
  assert.equal(profile.github, "https://github.com/vadlapranav");
  assert.equal(
    profile.linkedin,
    "https://linkedin.com/in/vadla-pranav-2b3a64302",
  );
  assert.equal(profile.email, "vadlapranav91@gmail.com");
});
