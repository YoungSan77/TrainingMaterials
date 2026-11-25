const fs=require('fs'),path=require('path'),crypto=require('crypto');
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const out='out/s04-feedback-20261118';fs.mkdirSync(out,{recursive:true});
const protectedFiles=['courses/ai-native/sessions/s01.md','courses/ai-native/sessions/s01.pptx','courses/ai-native/sessions/s02.md','courses/ai-native/sessions/s02.pptx','courses/ai-native/sessions/s03.md','courses/ai-native/sessions/s03.pptx','courses/ai-native/sessions/s03.qa.json','guides/production-guide.md','guides/session-authoring-guide.md'];
fs.writeFileSync(path.join(__dirname,'start.json'),JSON.stringify({protectedFiles:Object.fromEntries(protectedFiles.map(p=>[p,sha(p)])),sourceBefore:sha('courses/ai-native/sessions/s04.md'),attachmentSHA256:sha('/Users/YoungSan/Downloads/s04-topic-10.md'),feedbackSHA256:sha('/Users/YoungSan/Downloads/s04-final_fb.pptx')},null,2));
fs.copyFileSync('courses/ai-native/sessions/s04.md',out+'/s04-before.md');
fs.copyFileSync('out/s04-production-20261118/s04-final.pptx',out+'/s04-before.pptx');
fs.copyFileSync('/Users/YoungSan/Downloads/s04-topic-10.md',out+'/s04-topic-10.md');
console.log('baseline saved');
