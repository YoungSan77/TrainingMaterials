'use strict';
// normalize.js — pptxgenjs가 매 실행마다 현재 시각(new Date())을 docProps/core.xml에 찍는다.
// deterministic generation을 위해 이 필드만 고정값으로 되돌린 뒤, 항목 순서·압축을 고정해
// 다시 압축한다(같은 내용이면 byte 단위로 같은 zip이 나온다).
const JSZip = require('jszip');
const FIXED_DATE = new Date('2000-01-01T00:00:00.000Z');
const FIXED_ISO = '2000-01-01T00:00:00Z';

async function normalizeForDeterminism(buffer) {
  const zip = await JSZip.loadAsync(buffer);
  const names = Object.keys(zip.files);
  const out = new JSZip();
  for (const name of names) {
    const entry = zip.files[name];
    if (entry.dir) {
      // createFolders:false — 중간 폴더 항목을 JSZip이 자동 생성하며 현재 시각을 넣지 못하게 한다.
      out.file(name, null, { dir: true, date: FIXED_DATE, createFolders: false });
      continue;
    }
    let content = await entry.async('nodebuffer');
    if (name === 'docProps/core.xml') {
      let xml = content.toString('utf8');
      xml = xml.replace(/<dcterms:created([^>]*)>[^<]*<\/dcterms:created>/, `<dcterms:created$1>${FIXED_ISO}</dcterms:created>`);
      xml = xml.replace(/<dcterms:modified([^>]*)>[^<]*<\/dcterms:modified>/, `<dcterms:modified$1>${FIXED_ISO}</dcterms:modified>`);
      content = Buffer.from(xml, 'utf8');
    }
    out.file(name, content, { date: FIXED_DATE, createFolders: false });
  }
  return out.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE', platform: 'UNIX' });
}

module.exports = { normalizeForDeterminism, FIXED_ISO };
