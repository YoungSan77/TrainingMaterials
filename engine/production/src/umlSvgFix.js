"use strict";
// SVG-level corrections for PlantUML drawings the smetana layout gets wrong or has no option for
// (production-guide.md "Visual layout 및 가독성"). Applied to PlantUML's own SVG output, which the
// adapter then rasterizes; every coordinate here is in that SVG's (already scaled) units.

function num(v) { return Number.parseFloat(v); }

// Endpoints of an SVG path "d" (first and last coordinate pair).
function endpoints(d) {
  const pts = [...String(d).matchAll(/(-?[\d.]+),(-?[\d.]+)/g)].map((m) => ({ x: num(m[1]), y: num(m[2]) }));
  return pts.length ? { start: pts[0], end: pts[pts.length - 1] } : null;
}

const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const fmt = (p) => `${+p.x.toFixed(4)},${+p.y.toFixed(4)}`;

// Crops the empty band a shrunken figure leaves at the top: the new top is the highest of
// `extraTops` (the shrunken figures) and every other drawn element (rect/ellipse/text/polygon),
// with the stick figures themselves (now inside a scaling <g transform>) excluded.
function cropTop(svg, extraTops) {
  const plain = String(svg).replace(/<g transform="translate[^"]*scale[^"]*">[\s\S]*?<\/g>/g, "");
  const tops = [...extraTops];
  for (const m of plain.matchAll(/<rect\b[^>]*\by="(-?[\d.]+)"/g)) tops.push(num(m[1]));
  for (const m of plain.matchAll(/<ellipse\b[^>]*\bcy="(-?[\d.]+)"[^>]*\bry="([\d.]+)"/g)) tops.push(num(m[1]) - num(m[2]));
  for (const m of plain.matchAll(/<text\b[^>]*\bfont-size="([\d.]+)"[^>]*\by="(-?[\d.]+)"/g)) tops.push(num(m[2]) - num(m[1]));
  for (const m of plain.matchAll(/<polygon\b[^>]*\bpoints="([^"]+)"/g)) {
    const ys = m[1].split(/[ ,]+/).filter(Boolean).map(num).filter((v, i) => i % 2 === 1);
    tops.push(Math.min(...ys));
  }
  for (const m of plain.matchAll(/<path\b[^>]*\bd="([^"]+)"/g)) {
    for (const c of m[1].matchAll(/(-?[\d.]+),(-?[\d.]+)/g)) tops.push(num(c[2]));
  }
  const top = Math.min(...tops.filter(Number.isFinite));
  const vb = /viewBox="([\d.-]+) ([\d.-]+) ([\d.]+) ([\d.]+)"/.exec(svg);
  if (!vb || !Number.isFinite(top)) return svg;
  const cut = top - 20 - num(vb[2]);
  if (cut <= 1) return svg;
  const h = num(vb[4]) - cut;
  return String(svg).replace(vb[0], `viewBox="${vb[1]} ${num(vb[2]) + cut} ${vb[3]} ${h}"`)
    .replace(/(<svg\b[^>]*?\sheight=")[\d.]+px"/, `$1${h}px"`)
    .replace(/(<svg\b[^>]*?style="[^"]*?height:)[\d.]+px/, `$1${h}px`);
}

// -- Use-case actors -------------------------------------------------------------------------
// PlantUML's stick figure has a fixed size (no skinparam/style). Scale it by `factor` about its
// feet -- the name label below stays where it is -- and move every association endpoint that
// touched the old figure by the same transform, so the lines still meet the smaller figure.
function shrinkUsecaseActors(svg, factor) {
  let out = String(svg);
  const actors = [];
  out = out.replace(/(<g class="entity"[^>]*\bid="([^"]+)"[^>]*>)([\s\S]*?)(<\/g>)/g, (whole, open, id, body, close) => {
    const figure = /(<ellipse\b[^>]*\/>\s*<path\b[^>]*\/>)/.exec(body);
    if (!figure) return whole;
    const e = /<ellipse\b[^>]*\bcx="([\d.]+)"[^>]*\bcy="([\d.]+)"[^>]*\brx="([\d.]+)"/.exec(figure[1]);
    const d = /\bd="([^"]+)"/.exec(figure[1]);
    if (!e || !d || /[Cc]/.test(d[1])) return whole; // a use-case ellipse has no stick-figure path
    const pts = [...d[1].matchAll(/(-?[\d.]+),(-?[\d.]+)/g)].map((m) => ({ x: num(m[1]), y: num(m[2]) }));
    const cx = num(e[1]);
    const feet = Math.max(...pts.map((p) => p.y));
    const halfW = Math.max(...pts.map((p) => Math.abs(p.x - cx)));
    const headTop = num(e[2]) - num(e[3]);
    // The entity's horizontal extent includes its (often wider) name label: PlantUML attaches
    // side links to that edge, not to the figure.
    let x0 = cx - halfW, x1 = cx + halfW;
    for (const m of body.matchAll(/<text\b[^>]*\btextLength="([\d.]+)"[^>]*\bx="([\d.]+)"/g)) {
      x0 = Math.min(x0, num(m[2]));
      x1 = Math.max(x1, num(m[2]) + num(m[1]));
    }
    actors.push({ id, cx, feet, halfW, headTop, x0, x1 });
    const g = `<g transform="translate(${cx},${feet}) scale(${factor}) translate(${-cx},${-feet})">${figure[1]}</g>`;
    return open + body.replace(figure[1], g) + close;
  });
  if (!actors.length) return out;
  out = cropTop(out, actors.map((a) => a.feet - (a.feet - a.headTop) * factor));
  const margin = 24;
  // A link point beside/above the old figure (not below it, where the name label is) belongs to
  // the figure: map it through the same scale about the feet, and pull a side point that sat at
  // the label's wider edge in to the new figure's edge.
  const onFigure = (p, a) => p.y >= a.headTop - margin && p.y <= a.feet + margin && p.x >= a.x0 - margin && p.x <= a.x1 + margin;
  const move = (p, a) => {
    const y = a.feet + (p.y - a.feet) * factor;
    const edge = a.halfW * factor + 6;
    let x = a.cx + (p.x - a.cx) * factor;
    if (Math.abs(p.x - a.cx) > a.halfW) x = a.cx + Math.sign(p.x - a.cx) * edge;
    return { x, y };
  };
  return out.replace(/(<g class="link"[^>]*\bdata-entity-1="([^"]+)"[^>]*\bdata-entity-2="([^"]+)"[^>]*>)([\s\S]*?)(<\/g>)/g,
    (whole, open, e1, e2, body, close) => {
      const mine = actors.filter((a) => a.id === e1 || a.id === e2);
      if (!mine.length) return whole;
      let next = body.replace(/(<path\b[^>]*\bd=")([^"]+)(")/, (w, a, d, b) => {
        const coords = [...d.matchAll(/(-?[\d.]+),(-?[\d.]+)/g)];
        if (!coords.length) return w;
        const edits = [];
        for (const m of [coords[0], coords[coords.length - 1]]) {
          const p = { x: num(m[1]), y: num(m[2]) };
          const actor = mine.find((ac) => onFigure(p, ac));
          if (actor) edits.push({ m, p: move(p, actor) });
        }
        let dd = d;
        for (const { m, p } of edits.sort((x, y) => y.m.index - x.m.index)) {
          dd = dd.slice(0, m.index) + fmt(p) + dd.slice(m.index + m[0].length);
        }
        return a + dd + b;
      });
      // Arrowheads drawn at an actor end move with that end.
      next = next.replace(/(<polygon\b[^>]*\bpoints=")([^"]+)(")/g, (w, a, pts, b) => {
        const ps = pts.split(/[ ,]+/).filter(Boolean).map(num);
        const xy = [];
        for (let i = 0; i + 1 < ps.length; i += 2) xy.push({ x: ps[i], y: ps[i + 1] });
        const c = { x: xy.reduce((s, p) => s + p.x, 0) / xy.length, y: xy.reduce((s, p) => s + p.y, 0) / xy.length };
        const actor = mine.find((ac) => onFigure(c, ac));
        if (!actor) return w;
        const dx = move(c, actor).x - c.x, dy = move(c, actor).y - c.y;
        return a + xy.map((p) => fmt({ x: p.x + dx, y: p.y + dy })).join(",") + b;
      });
      return open + next + close;
    });
}

// -- Association classes ---------------------------------------------------------------------
// `(A, B) .. C` is drawn by PlantUML through an invisible midpoint entity. smetana misplaces that
// point: the A–B association comes out as two halves with a gap, a stray dot floats nearby, and
// the dashed line to C starts in empty space. Rebuild the standard notation: one continuous
// A–B line and a dashed line from its midpoint to C, with no dot.
function fixAssociationClasses(svg) {
  let out = String(svg);
  const entityIds = new Set([...out.matchAll(/<g class="(?:entity|cluster)"[^>]*\bid="([^"]+)"/g)].map((m) => m[1]));
  const links = [...out.matchAll(/<g class="link"[^>]*\bdata-entity-1="([^"]+)"[^>]*\bdata-entity-2="([^"]+)"[^>]*>[\s\S]*?<\/g>/g)]
    .map((m) => ({ whole: m[0], e1: m[1], e2: m[2], d: (/<path\b[^>]*\bd="([^"]+)"/.exec(m[0]) || [])[1], dashed: /stroke-dasharray/.test(m[0]) }));
  const points = new Set(links.flatMap((l) => [l.e1, l.e2]).filter((id) => !entityIds.has(id)));
  let fixed = false;
  for (const point of points) {
    const mine = links.filter((l) => (l.e1 === point || l.e2 === point) && l.d);
    const halves = mine.filter((l) => !l.dashed);
    const dash = mine.find((l) => l.dashed);
    if (halves.length !== 2 || !dash) continue;
    const ends = halves.map((l) => endpoints(l.d));
    const dashEnds = endpoints(dash.d);
    // Each half's class-side end is the one farther from the other half.
    const other = (i) => ends[1 - i];
    const outer = ends.map((e, i) => {
      const o = other(i);
      const near = (p) => Math.min(dist(p, o.start), dist(p, o.end));
      return near(e.start) > near(e.end) ? e.start : e.end;
    });
    const mid = { x: (outer[0].x + outer[1].x) / 2, y: (outer[0].y + outer[1].y) / 2 };
    const classEnd = dist(dashEnds.start, mid) > dist(dashEnds.end, mid) ? dashEnds.start : dashEnds.end;
    out = out.replace(halves[0].whole, halves[0].whole.replace(halves[0].d, `M${fmt(outer[0])} L${fmt(outer[1])}`));
    // Drop only the second half's line -- its group also carries that end's multiplicity text.
    out = out.replace(halves[1].whole, halves[1].whole.replace(/<path\b[^>]*\/>/, ""));
    out = out.replace(dash.whole, dash.whole.replace(dash.d, `M${fmt(mid)} L${fmt(classEnd)}`));
    fixed = true;
  }
  if (!fixed) return out;
  // The misplaced midpoint marker: a small filled dot drawn outside every entity group (entity
  // groups are masked first so a class's own drawing is never touched).
  const kept = [];
  const masked = out.replace(/<g class="(?:entity|cluster)"[\s\S]*?<\/g>/g, (g) => { kept.push(g); return `\u0000${kept.length - 1}\u0000`; });
  return masked.replace(/<ellipse\b[^>]*\brx="8"[^>]*\bry="8"[^>]*\/>/g, "")
    .replace(/\u0000(\d+)\u0000/g, (w, i) => kept[Number(i)]);
}


// -- Use-case ellipses -----------------------------------------------------------------------
// After uniformSize.js pads use-case labels with no-break spaces (equal ellipses), two smetana
// artifacts show: the label is no longer centered in its ellipse, and association lines stop at
// the ellipse's bounding box instead of its outline. Center each label on its ellipse and snap
// arrow-less link endpoints that fall short onto the ellipse outline.
function fitUsecaseEllipses(svg) {
  let out = String(svg);
  const ellipses = [];
  out = out.replace(/(<g class="entity"[^>]*\bid="([^"]+)"[^>]*>)([\s\S]*?)(<\/g>)/g, (whole, open, id, body, close) => {
    if (/<path\b/.test(body)) return whole; // actors (stick figure) are handled elsewhere
    const e = /<ellipse\b[^>]*\bcx="([\d.]+)"[^>]*\bcy="([\d.]+)"[^>]*\brx="([\d.]+)"[^>]*\bry="([\d.]+)"/.exec(body);
    if (!e) return whole;
    const c = { id, x: num(e[1]), y: num(e[2]), rx: num(e[3]), ry: num(e[4]) };
    ellipses.push(c);
    const texts = body.replace(/<text\b([^>]*)>([^<]*)<\/text>/g, (w, attrs, content) => {
      const trimmed = content.replace(/^(?:&#160;|\u00a0)+|(?:&#160;|\u00a0)+$/g, "");
      const a = attrs.replace(/\s(?:textLength|lengthAdjust)="[^"]*"/g, "").replace(/\bx="[\d.]+"/, `x="${c.x}" text-anchor="middle"`);
      return `<text${a}>${trimmed}</text>`;
    });
    return open + texts + close;
  });
  if (!ellipses.length) return out;
  const snap = (p, c) => {
    const dx = p.x - c.x, dy = p.y - c.y;
    const k = Math.hypot(dx / c.rx, dy / c.ry);
    return k > 0 ? { x: c.x + dx / k, y: c.y + dy / k } : p;
  };
  return out.replace(/(<g class="link"[^>]*\bdata-entity-1="([^"]+)"[^>]*\bdata-entity-2="([^"]+)"[^>]*>)([\s\S]*?)(<\/g>)/g,
    (whole, open, e1, e2, body, close) => {
      if (/<polygon\b/.test(body)) return whole;
      const mine = ellipses.filter((c) => c.id === e1 || c.id === e2);
      if (!mine.length) return whole;
      return open + body.replace(/(<path\b[^>]*\bd=")([^"]+)(")/, (w, a, d, b) => {
        const coords = [...d.matchAll(/(-?[\d.]+),(-?[\d.]+)/g)];
        if (!coords.length) return w;
        const edits = [];
        for (const m of [coords[0], coords[coords.length - 1]]) {
          const p = { x: num(m[1]), y: num(m[2]) };
          const c = mine.find((cc) => Math.abs(p.x - cc.x) <= cc.rx + 24 && Math.abs(p.y - cc.y) <= cc.ry + 24);
          if (c && Math.hypot((p.x - c.x) / c.rx, (p.y - c.y) / c.ry) > 1.02) edits.push({ m, p: snap(p, c) });
        }
        let dd = d;
        for (const { m, p } of edits.sort((x, y) => y.m.index - x.m.index)) dd = dd.slice(0, m.index) + fmt(p) + dd.slice(m.index + m[0].length);
        return a + dd + b;
      }) + close;
    });
}


// PlantUML's smetana layout can place content (curved links and their labels in communication
// diagrams) at negative coordinates while the SVG viewBox starts at 0, clipping it. Widen the
// viewBox to the drawn content (with a small margin); an SVG already inside its viewBox is
// returned unchanged.
function fitViewBox(svg, margin = 6) {
  const vb = /viewBox="([\d.-]+) ([\d.-]+) ([\d.]+) ([\d.]+)"/.exec(svg);
  if (!vb) return svg;
  const [x0, y0, w, h] = vb.slice(1).map(Number);
  const xs = [], ys = [];
  for (const m of svg.matchAll(/\s(x|x1|x2|cx)="(-?[\d.]+)"/g)) xs.push(Number(m[2]));
  for (const m of svg.matchAll(/\s(y|y1|y2|cy)="(-?[\d.]+)"/g)) ys.push(Number(m[2]));
  // Text is positioned by its baseline: allow for the glyph height above it.
  for (const m of svg.matchAll(/<text\b[^>]*\sy="(-?[\d.]+)"/g)) ys.push(Number(m[1]) - 16);
  for (const m of svg.matchAll(/\s(?:d|points)="([^"]*)"/g)) {
    const nums = m[1].match(/-?[\d.]+/g) || [];
    for (let i = 0; i + 1 < nums.length; i += 2) { xs.push(Number(nums[i])); ys.push(Number(nums[i + 1])); }
  }
  const minX = Math.min(x0, ...xs), minY = Math.min(y0, ...ys);
  if (minX >= x0 && minY >= y0) return svg;
  const nx = Math.min(x0, minX - margin), ny = Math.min(y0, minY - margin);
  const nw = w + (x0 - nx), nh = h + (y0 - ny);
  return svg.replace(vb[0], `viewBox="${nx} ${ny} ${nw} ${nh}"`)
    .replace(/(<svg\b[^>]*?\swidth=")[\d.]+px"/, `$1${nw}px"`)
    .replace(/(<svg\b[^>]*?\sheight=")[\d.]+px"/, `$1${nh}px"`)
    .replace(/(<svg\b[^>]*?style="[^"]*?width:)[\d.]+px/, `$1${nw}px`)
    .replace(/(<svg\b[^>]*?style="[^"]*?height:)[\d.]+px/, `$1${nh}px`);
}

module.exports = { fitViewBox, cropTop, endpoints, shrinkUsecaseActors, fitUsecaseEllipses, fixAssociationClasses };
