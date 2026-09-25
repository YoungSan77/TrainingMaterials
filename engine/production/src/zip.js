"use strict";
// Port of LecturePpt.readZip()/writeZip(): sorted-map I/O with a fixed timestamp so that
// identical content produces an identical archive (Java forces ZipEntry.setTimeLocal(2026,1,1,0,0)).
const fs = require("fs");
const JSZip = require("jszip");

async function readZip(path) {
  const buf = fs.readFileSync(path);
  const zip = await JSZip.loadAsync(buf);
  const out = new Map();
  const names = Object.keys(zip.files).filter((n) => !zip.files[n].dir).sort();
  for (const name of names) {
    const data = await zip.files[name].async("nodebuffer");
    out.set(name, data);
  }
  return out;
}

async function writeZip(path, dataMap) {
  const zip = new JSZip();
  const names = Array.from(dataMap.keys()).sort();
  const fixedDate = new Date(2026, 0, 1, 0, 0, 0);
  for (const name of names) {
    // createFolders:false -- JSZip defaults to emitting a separate zip entry for every
    // intermediate directory ("ppt/", "ppt/slides/", ...) purely from adding nested-path files.
    // Real PowerPoint-authored OOXML packages never contain these (the OPC spec says a conforming
    // package physically holds only parts, not directory records), and at least one Office/Mac
    // OPC reader is known to be pickier about a package's physical shape than python-pptx or a
    // generic zip reader -- so this keeps the archive to exactly the parts the manifest lists.
    zip.file(name, dataMap.get(name), { date: fixedDate, createFolders: false });
  }
  const buf = await zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    platform: "UNIX",
  });
  fs.writeFileSync(path, buf);
}

module.exports = { readZip, writeZip };
