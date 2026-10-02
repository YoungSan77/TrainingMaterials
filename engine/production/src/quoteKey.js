"use strict";
// The key under which a verified English quote is recorded in references/verified.json
// (tools/verify-quote.js writes it, references.js checks session quotes against it): case, curly
// quotes, dashes and whitespace do not matter.
const fs = require("fs");
const path = require("path");

function quoteKey(text) {
  return String(text).toLowerCase().replace(/\\(["\\])/g, "$1").replace(/[‘’`´]/g, "'").replace(/[“”«»]/g, '"')
    .replace(/[–—‐‑]/g, "-").replace(/\s+/g, " ").trim();
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
