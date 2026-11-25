const fs=require('fs'),cp=require('child_process'),crypto=require('crypto'),path=require('path');
const dir=__dirname;const paths=cp.execFileSync('git',['ls-files','-z'],{encoding:'utf8'}).split('\0').filter(p=>p&&!p.startsWith('references/')&&fs.existsSync(p));
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
fs.writeFileSync(path.join(dir,'start.json'),JSON.stringify({at:new Date().toISOString(),branch:cp.execFileSync('git',['branch','--show-current'],{encoding:'utf8'}).trim(),status:cp.execFileSync('git',['status','--short'],{encoding:'utf8'}),hashes:Object.fromEntries(paths.map(p=>[p,hash(p)]))},null,2));
for(const p of ['courses/ai-native/production-standard.md','guides/production-guide.md'])fs.copyFileSync(p,path.join(dir,path.basename(p)+'.before'));
console.log('Preservation snapshot recorded');
