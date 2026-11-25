'use strict';
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'),protectedFiles={};
function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);if(e.isDirectory())walk(p);else if(!p.includes('/checks/'))protectedFiles[p]=sha(p);}}
walk('courses');walk('engine/production/src');for(const p of ['guides/production-guide.md','guides/session-authoring-guide.md','guides/agentic-repository-guide.md'])protectedFiles[p]=sha(p);
const out=path.resolve('out/s04-close-20261119');fs.mkdirSync(out,{recursive:true});
fs.copyFileSync('courses/ai-native/sessions/s04.md',path.join(out,'s04-before.md'));
const backup=path.join(out,'previous-official');fs.mkdirSync(backup,{recursive:true});for(const file of ['s04.pptx','s04.qa.json'])fs.copyFileSync('courses/ai-native/sessions/'+file,path.join(backup,file),fs.constants.COPYFILE_EXCL);
fs.writeFileSync(path.join(__dirname,'start.json'),JSON.stringify({protectedFiles,backup},null,2));console.log({out,protectedFiles:Object.keys(protectedFiles).length});
