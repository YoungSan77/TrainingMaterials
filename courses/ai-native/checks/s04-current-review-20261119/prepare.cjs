'use strict';
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'),protectedFiles={};
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else if(!p.includes('/checks/'))protectedFiles[p]=sha(p);}}
walk('courses');
for(const p of ['guides/production-guide.md','guides/session-authoring-guide.md','guides/agentic-repository-guide.md'])protectedFiles[p]=sha(p);
fs.writeFileSync(path.join(__dirname,'start.json'),JSON.stringify({protectedFiles},null,2));
fs.mkdirSync('out/s04-current-review-20261119',{recursive:true});console.log('snapshotted',Object.keys(protectedFiles).length);
