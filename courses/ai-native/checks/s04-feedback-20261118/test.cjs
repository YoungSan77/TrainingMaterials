const fs=require('fs'),cp=require('child_process'),path=require('path');
const files=fs.readdirSync('engine/production/src/test').filter(f=>f.endsWith('.test.js')).map(f=>'engine/production/src/test/'+f);
const r=cp.spawnSync(process.execPath,['--test',...files],{encoding:'utf8',maxBuffer:16*1024*1024});
fs.writeFileSync(path.join(__dirname,'tests.log'),r.stdout+r.stderr);console.log((r.stdout+r.stderr).split('\n').slice(-15).join('\n'));process.exitCode=r.status;
