"use strict";
// The deck skeleton every presentation is built from: engine/production/template/ holds the
// unzipped OOXML parts (master, layout, theme, and one prototype slide per page kind) as plain
// files, so a change to the skeleton is an ordinary reviewable diff. It is part of the renderer --
// change it together with builder.js and the tests, never as a separately "approved" asset.
const fs = require("fs");
const path = require("path");
const { parseXml, children, all, P } = require("./xml");

const TEMPLATE_DIR = path.resolve(__dirname, "../template");

// Prototype slide order in presentation.xml (builder.js clones them by this index).
const ORIGIN = { toc: 0, prose: 1, tree: 2, code: 3, table: 4 };

// Reads the skeleton directory into the same name -> Buffer map readZip() returns for a .pptx.
function readTemplate(dir = TEMPLATE_DIR) {
  const out = new Map();
  const walk = (rel) => {
    for (const entry of fs.readdirSync(path.join(dir, rel), { withFileTypes: true })) {
      if (entry.name === ".DS_Store") continue; // Finder metadata, not a package part (_rels/.rels is)
      const name = rel ? rel + "/" + entry.name : entry.name;
      if (entry.isDirectory()) walk(name);
      else out.set(name, fs.readFileSync(path.join(dir, name)));
    }
  };
  walk("");
  return new Map([...out.entries()].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)));
}

// Slide part names in presentation order, for a template or a generated deck.
function slideParts(data) {
  const pres = parseXml(data.get("ppt/presentation.xml"));
  const rels = parseXml(data.get("ppt/_rels/presentation.xml.rels"));
  const targets = new Map();
  for (const e of children(rels.documentElement)) {
    const target = e.getAttribute("Target");
    const norm = target.startsWith("/") ? target.slice(1) : path.posix.normalize(path.posix.join("ppt", target));
    targets.set(e.getAttribute("Id"), norm);
  }
  const R = "http://schemas.openxmlformats.org/officeDocument/2006/relationships";
  return all(pres, P, "sldId").map((e) => targets.get(e.getAttributeNS(R, "id")));
}

module.exports = { TEMPLATE_DIR, ORIGIN, readTemplate, slideParts };
