'use strict';
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'),dir=__dirname,out='out/s04-layout-20261119';fs.mkdirSync(out,{recursive:true});
const protectedFiles={};
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else if(/\.(?:md|pptx|json|java|mjs)$/.test(p)&&!p.includes('/checks/'))protectedFiles[p]=sha(p);}}
walk('courses');
fs.writeFileSync(path.join(dir,'start.json'),JSON.stringify({protectedFiles,officialSHA256:sha('courses/ai-native/sessions/s04.pptx'),guides:Object.fromEntries(['guides/production-guide.md','courses/ai-native/production-standard.md'].map(p=>[p,sha(p)]))},null,2));
fs.copyFileSync('courses/ai-native/sessions/s04.pptx',out+'/s04-before.pptx');
for(const n of [30,33,34])fs.copyFileSync(`/Users/YoungSan/Downloads/slide-${n}.png`,`${out}/attachment-${n}.png`);
console.log({out,official:sha(out+'/s04-before.pptx'),protectedFiles:Object.keys(protectedFiles).length});
