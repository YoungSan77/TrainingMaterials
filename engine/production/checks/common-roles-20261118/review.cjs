const cp=require('child_process');
for(const [name,pages] of [['ai-native-s03',['8','18-19','26-30']],['ai-native-s04',['4','20-23','30','32-49']],['ooad-s02',['6','9','11','21','61','65','87','90']]]){
 cp.execFileSync('tools/review-pdf.sh',['out/common-production-20261118/'+name+'.pptx',...pages],{stdio:'pipe'});console.log('PowerPoint PDF rendered: '+name);
}
