"use strict";
// DOM helpers — direct port of LecturePpt.java's static XML utility methods.
// Uses @xmldom/xmldom to mirror org.w3c.dom usage in the Java original method-for-method.
const { DOMParser, XMLSerializer } = require("@xmldom/xmldom");

const A = "http://schemas.openxmlformats.org/drawingml/2006/main";
const P = "http://schemas.openxmlformats.org/presentationml/2006/main";
const R = "http://schemas.openxmlformats.org/officeDocument/2006/relationships";
const REL = "http://schemas.openxmlformats.org/package/2006/relationships";
const CT = "http://schemas.openxmlformats.org/package/2006/content-types";
// Same fixed attribute order LecturePpt.ORDER uses when normalizing <a:pPr> children.
const ORDER = ["lnSpc","spcBef","spcAft","buClrTx","buClr","buSzTx","buSzPct","buSzPts","buFontTx","buFont","buNone","buAutoNum","buChar","buBlip","tabLst","defRPr","extLst"];

function need(ok, message) {
  if (!ok) throw new Error(message);
}

function parseXml(bytes) {
  const text = Buffer.isBuffer(bytes) ? bytes.toString("utf-8") : bytes;
  const doc = new DOMParser().parseFromString(text, "text/xml");
  return doc;
}

function xmlOut(doc) {
  const s = new XMLSerializer().serializeToString(doc);
  const withDecl = s.startsWith("<?xml") ? s : '<?xml version="1.0" encoding="UTF-8"?>' + s;
  return Buffer.from(withDecl, "utf-8");
}

function children(n) {
  const out = [];
  for (let c = n.firstChild; c; c = c.nextSibling) {
    if (c.nodeType === 1) out.push(c);
  }
  return out;
}

function kids(n, ns, local) {
  return children(n).filter((e) => e.namespaceURI === ns && e.localName === local);
}

function child(n, ns, local) {
  const r = kids(n, ns, local);
  return r.length ? r[0] : null;
}

// Equivalent of Java's getElementsByTagNameNS on Document or Element (recursive, all descendants).
function all(n, ns, local) {
  const doc = n.nodeType === 9 ? n : n.ownerDocument;
  const nl = n.getElementsByTagNameNS ? n.getElementsByTagNameNS(ns, local) : doc.getElementsByTagNameNS(ns, local);
  const out = [];
  for (let i = 0; i < nl.length; i++) out.push(nl[i]);
  return out;
}

function first(n, ns, local) {
  const r = all(n, ns, local);
  return r.length ? r[0] : null;
}

function el(d, ns, name, ...attrs) {
  const prefix = ns === A ? "a:" : ns === P ? "p:" : "";
  const e = d.createElementNS(ns, prefix + name);
  for (let i = 0; i < attrs.length; i += 2) e.setAttribute(attrs[i], attrs[i + 1]);
  return e;
}

function copy(d, e) {
  return d.importNode(e, true);
}

function shape(d, id) {
  const tree = first(d, P, "spTree");
  for (const e of children(tree)) {
    const nv = first(e, P, "cNvPr");
    if (nv && nv.getAttribute("id") === String(id)) return e;
  }
  throw new Error("Template shape missing: " + id);
}

function paragraph(p) {
  let s = "";
  for (const e of children(p)) {
    if (e.namespaceURI === A && e.localName === "br") s += "";
    else if (e.localName === "r" || e.localName === "fld") {
      for (const t of all(e, A, "t")) s += t.textContent || "";
    }
  }
  return s;
}

function text(e) {
  return all(e, A, "p").map(paragraph).join("\n");
}

function body(e) {
  const b = child(e, P, "txBody");
  return b || child(e, A, "txBody");
}

function setText(e, value) {
  if (text(e) === value) return;
  const d = e.ownerDocument;
  const b = body(e);
  need(b != null, "No text body");
  const old = child(b, A, "p");
  const ppr = old ? child(old, A, "pPr") : null;
  const rpr = old ? first(old, A, "rPr") : null;
  for (const p of kids(b, A, "p")) b.removeChild(p);
  for (const line of value.split("\n")) {
    const p = el(d, A, "p");
    if (ppr) p.appendChild(copy(d, ppr));
    const pieces = line.split("");
    for (let i = 0; i < pieces.length; i++) {
      if (i > 0) p.appendChild(el(d, A, "br"));
      const run = el(d, A, "r");
      if (rpr) run.appendChild(copy(d, rpr));
      const t = el(d, A, "t");
      t.textContent = pieces[i];
      run.appendChild(t);
      p.appendChild(run);
    }
    b.appendChild(p);
  }
}

function relPath(p) {
  return p.replace("/slides/", "/slides/_rels/") + ".rels";
}

// Port of LecturePpt.spacing(): rewrites <a:pPr> spcBef/spcAft(/lnSpc) and re-sorts children per ORDER.
function spacing(p, before, after, leading) {
  const d = p.ownerDocument;
  let pr = child(p, A, "pPr");
  if (!pr) {
    pr = el(d, A, "pPr");
    p.insertBefore(pr, p.firstChild);
  }
  const tags = leading == null ? ["spcBef", "spcAft"] : ["spcBef", "spcAft", "lnSpc"];
  const vals = [before, after, leading == null ? 0 : leading];
  for (let i = 0; i < tags.length; i++) {
    for (const old of kids(pr, A, tags[i])) pr.removeChild(old);
    const s = el(d, A, tags[i]);
    s.appendChild(el(d, A, "spcPts", "val", String(vals[i] * 100)));
    pr.appendChild(s);
  }
  const ordered = children(pr).slice();
  ordered.sort((a, b) => {
    const ia = ORDER.indexOf(a.localName), ib = ORDER.indexOf(b.localName);
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
  });
  for (const e of ordered) pr.appendChild(e);
  return pr;
}

module.exports = { A, P, R, REL, CT, ORDER, need, parseXml, xmlOut, children, kids, child, all, first, el, copy, shape, paragraph, text, body, setText, relPath, spacing };
