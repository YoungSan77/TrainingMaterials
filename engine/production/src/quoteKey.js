"use strict";
// The key under which a verified English quote is recorded in references/verified.json
// (tools/verify-quote.js writes it, references.js checks session quotes against it): case, curly
// quotes, dashes, whitespace and the sentence punctuation at either end do not matter -- the tool
// already ignores it when matching the source, so the manuscript may end a quote with the period
// the original has (or drop it) without losing the record.
const fs = require("fs");
const path = require("path");

function quoteKey(text) {
  return String(text).toLowerCase().replace(/\\(["\\])/g, "$1").replace(/[‘’`´]/g, "'").replace(/[“”«»]/g, '"')
    .replace(/[–—‐‑]/g, "-").replace(/\s+/g, " ").trim()
    .replace(/^[.,;:!?]+|[.,;:!?]+$/g, "").trim();
}

// The nearest references/verified.json above `from`, or null.
function findLedger(from) {
  let dir = path.resolve(from);
  for (;;) {
    const f = path.join(dir, "references", "verified.json");
    if (fs.existsSync(f)) return f;
    const up = path.dirname(dir);
    if (up === dir) return null;
    dir = up;
  }
}

module.exports = { quoteKey, findLedger };
