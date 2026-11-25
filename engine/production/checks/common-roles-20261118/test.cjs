const fs=require('fs'),cp=require('child_process'),path=require('path');
const files=fs.readdirSync('engine/production/src/test').filter(n=>n.endsWith('.test.js')).map(n=>'engine/production/src/test/'+n);
const r=cp.spawnSync('node',['--test',...files],{encoding:'utf8',maxBuffer:30*1024*1024});
const log=r.stdout+r.stderr;fs.writeFileSync(path.join(__dirname,'tests.log'),log);
console.log(log.split('\n').filter(l=>/^[✖ℹ]/.test(l)).join('\n'));process.exitCode=r.status;
