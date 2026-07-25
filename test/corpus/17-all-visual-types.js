// 결함 아님 — '전 시각 타입 렌더 경로'가 살아 있는지 보는 케이스다.
// 계기: share·quadrant 렌더러에 미정의 식별자가 남아 있었는데(모듈 분리 때 지역 변수가 사라진 자리)
//       어느 덱도 그 타입을 쓰지 않아 verify·골든·코퍼스 어디에도 걸리지 않았다.
//       계약이 선언한 타입은 전부 최소 한 번 렌더되어야 한다 — 죽은 경로는 조용히 썩는다.
module.exports = {
  book: { title: '전 시각 타입 렌더 시험', subtitle: '도메인 무관 더미' },
  curriculum: [{ day: 'Day 1 — 시각 타입', items: ['전 타입 렌더'] }],
  session: { no: 1, title: '전 타입 렌더', type: '설명형',
    toc: [['01','목표'],['02','boxes'],['03','table'],['04','versus'],['05','flow'],
          ['06','pipeline'],['07','loop'],['08','steps'],['09','share'],['10','magnitude'],
          ['11','pyramid'],['12','quadrant'],['13','statement'],['14','요약']],
    slides: [
      { kind:'학습 목표', title:'목표', sub:'s', question:'무엇을 보는가?', lead:{label:'리드',text:'전 타입을 한 번씩 그린다'},
        visual:{ type:'bullets', data:[{text:'항목 하나'},{text:'항목 둘'},{text:'항목 셋'}] },
        foot:{kw:'키워드',color:'navy',body:'결론'}, notes:'노트' },

      { kind:'현상', title:'boxes', sub:'s', question:'왜?', lead:{label:'리드',text:'텍스트'},
        visual:{ type:'boxes', data:[{title:'가',body:['첫 줄','둘째 줄']},{title:'나',body:['첫 줄']}] },
        foot:{kw:'키워드',color:'teal',body:'결론'}, notes:'노트' },

      { kind:'현상', title:'table', sub:'s', question:'왜?', lead:{label:'리드',text:'텍스트'},
        visual:{ type:'table', data:[['머리1','머리2'],['값1','값2'],['값3','값4']] },
        foot:{kw:'키워드',color:'navy',body:'결론'}, notes:'노트' },

      { kind:'원인', title:'versus', sub:'s', question:'왜?', lead:{label:'리드',text:'텍스트'},
        visual:{ type:'versus', data:[{title:'왼쪽',body:['한 줄'],negative:false},{title:'오른쪽',body:['한 줄']}] },
        foot:{kw:'키워드',color:'failL',body:'결론'}, notes:'노트' },

      { kind:'원칙', title:'flow', sub:'s', question:'왜?', lead:{label:'리드',text:'텍스트'},
        visual:{ type:'flow', data:{ dir:'LR', nodes:[{id:'a',label:'가'},{id:'b',label:'나'},{id:'c',label:'다'}],
                                     edges:[{from:'a',to:'b',label:'이동'},{from:'b',to:'c'}] } },
        foot:{kw:'키워드',color:'navy',body:'결론'}, notes:'노트' },

      { kind:'원칙', title:'pipeline', sub:'s', question:'왜?', lead:{label:'리드',text:'텍스트'},
        visual:{ type:'pipeline', data:{ nodes:[{id:'a',label:'가'},{id:'b',label:'나',gate:true},{id:'c',label:'다'}] } },
        foot:{kw:'키워드',color:'teal',body:'결론'}, notes:'노트' },

      { kind:'원칙', title:'loop', sub:'s', question:'왜?', lead:{label:'리드',text:'텍스트'},
        visual:{ type:'loop', data:{ nodes:[{id:'a',label:'계획'},{id:'b',label:'실행'},{id:'c',label:'점검'}] } },
        foot:{kw:'키워드',color:'navy',body:'결론'}, notes:'노트' },

      { kind:'원칙', title:'steps', sub:'s', question:'왜?', lead:{label:'리드',text:'텍스트'},
        visual:{ type:'steps', data:[{title:'하나',body:['설명']},{title:'둘',body:['설명']},{title:'셋',body:['설명']}] },
        foot:{kw:'키워드',color:'navy',body:'결론'}, notes:'노트' },

      { kind:'적용', title:'share', sub:'s', question:'왜?', lead:{label:'리드',text:'텍스트'},
        visual:{ type:'share', data:[{label:'가',value:50},{label:'나',value:30,note:'주석'},{label:'다',value:20}],
                 caption:'출처와 한계' },
        foot:{kw:'키워드',color:'teal',body:'결론'}, notes:'노트' },

      { kind:'적용', title:'magnitude', sub:'s', question:'왜?', lead:{label:'리드',text:'텍스트'},
        visual:{ type:'magnitude', data:[{label:'가',value:1,unit:'배'},{label:'나',value:10,unit:'배'},{label:'다',value:100,unit:'배'}],
                 caption:'출처와 한계' },
        foot:{kw:'키워드',color:'navy',body:'결론'}, notes:'노트' },

      { kind:'적용', title:'pyramid', sub:'s', question:'왜?', lead:{label:'리드',text:'텍스트'},
        visual:{ type:'pyramid', data:[{label:'위',note:'좁다'},{label:'가운데'},{label:'아래',note:'넓다'}] },
        foot:{kw:'키워드',color:'navy',body:'결론'}, notes:'노트' },

      { kind:'타협', title:'quadrant', sub:'s', question:'왜?', lead:{label:'리드',text:'텍스트'},
        visual:{ type:'quadrant', data:{ x:{label:'가로축',low:'낮음',high:'높음'}, y:{label:'세로축',low:'낮음',high:'높음'},
                 cells:[{at:'TL',title:'좌상',body:['한 줄']},{at:'TR',title:'우상',body:['한 줄']},
                        {at:'BL',title:'좌하',body:['한 줄']},{at:'BR',title:'우하',body:['한 줄']}] } },
        foot:{kw:'키워드',color:'failT',body:'결론'}, notes:'노트' },

      { kind:'원칙', title:'statement',
        visual:{ type:'statement', text:'한 문장으로 던지는 전환점이다.', note:'해설 한 줄' }, notes:'노트' },

      { kind:'요약', title:'요약', sub:'s', question:'무엇을 얻었나?', lead:{label:'리드',text:'텍스트'},
        visual:{ type:'takeaways', data:[{title:'하나',body:['한 문장']},{title:'둘',body:['한 문장']}] },
        foot:{kw:'키워드',color:'navy',body:'결론'}, notes:'노트' }
    ] }
};
