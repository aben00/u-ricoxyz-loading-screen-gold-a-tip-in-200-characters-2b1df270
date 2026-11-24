// SPDX-License-Identifier: MIT
// Loading Screen Gold: A Tip in 200 Characters
// Writes one loading-screen tip (one line, <= 200 characters) to /output/entry.txt.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const ENTRY =
  "Tip: your agent has rewritten this function five times. It is not stuck — it is just also afraid of the tests.";

const OUT = "/output/entry.txt";

function gate(line: string): void {
  const chars = [...line];
  if (chars.length < 1 || chars.length > 200) {
    throw new Error(`entry is ${chars.length} characters, must be 1-200`);
  }
  if (line.trim() !== line) {
    throw new Error("entry has leading or trailing whitespace");
  }
  if (/\s/.test(line) && line.trim() === "") {
    throw new Error("entry is only whitespace");
  }
  for (const ch of line) {
    const code = ch.codePointAt(0)!;
    if (code < 0x20 || code === 0x7f) {
      throw new Error("entry contains a control character");
    }
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry must be a single line");
  }
}

gate(ENTRY);
mkdirSync("/output", { recursive: true });
writeFileSync(OUT, ENTRY, "utf8");

// Read back with strict UTF-8 decoding and verify byte-for-byte.
const back = new TextDecoder("utf-8", { fatal: true }).decode(
  readFileSync(OUT),
);
if (back !== ENTRY) {
  throw new Error("read-back mismatch: /output/entry.txt differs from the entry");
}
console.log(`Wrote ${[...ENTRY].length} characters to ${OUT}`);
