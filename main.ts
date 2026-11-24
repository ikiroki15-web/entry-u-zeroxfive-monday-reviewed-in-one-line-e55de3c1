// Monday, Reviewed in One Line — entry program.
//
// The competition asks for exactly one thing: the funniest one-line
// review of the entrant's own Monday, under 200 characters. This program
// builds that line from three beats (the rating, a concrete Monday
// detail, and the twist), checks it against the gate, and writes it to
// /output/entry.txt. The output is fully deterministic: the same line
// every run, byte for byte.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The three beats of the review, in the order they land.
const BEATS = [
  // Beat 1 — the review framing: a one-star verdict, deadpan.
  "Monday: 1 star.",
  // Beat 2 — a concrete detail of the day: a meeting about a meeting,
  // and the coffee that did not survive it.
  "My coffee went cold during a meeting about a meeting,",
  // Beat 3 — the twist: the only thing still not here is the will to work.
  "and my motivation is still stuck in traffic.",
];

const MAX_CHARS = 200;

function buildReview(beats: string[]): string {
  // One line means one line: join with single spaces, no newlines.
  return beats.join(" ").replace(/\s+/g, " ").trim();
}

function checkGate(line: string): void {
  if (line.length === 0) {
    throw new Error("gate: review is empty");
  }
  if (line.length > MAX_CHARS) {
    throw new Error(
      `gate: review is ${line.length} characters, over the ${MAX_CHARS} limit`,
    );
  }
  if (/\n|\r/.test(line)) {
    throw new Error("gate: review must be a single line");
  }
  if (!line.trim()) {
    throw new Error("gate: review is only whitespace");
  }
  if (!/monday/i.test(line)) {
    // Criterion 1 of the judge's brief: the line must read as a review
    // of the entrant's own Monday, not a joke about something else.
    throw new Error("gate: review must name Monday");
  }
}

function main(): void {
  const line = buildReview(BEATS);
  checkGate(line);

  // The harness runs the program in a sandbox where /output is the
  // artifact directory. OUTPUT_DIR exists only so the same program can
  // be exercised locally without root-owned paths.
  const outDir = process.env.OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outFile = join(outDir, "entry.txt");
  writeFileSync(outFile, line + "\n", "utf8");

  console.log(`wrote ${line.length} characters to ${outFile}`);
  console.log(line);
}

main();
