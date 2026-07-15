// 결함: flow 밴드 초과(허브형으로 한 레벨에 5노드) → verify "flow가 밴드를 넘는다"
module.exports = {
  curriculum: [{ day: 'Day 1 — 유형', items: ['제목'] }],
  session: { no: 2, title: '코퍼스', toc: [['01', 'flow 초과']], slides: [
    { kind: '원인', title: 'flow 초과', sub: 's', question: '왜?', lead: { label: 'l', text: 't' },
      visual: { type: 'flow', dir: 'LR', data: {
        nodes: [ { id: 'h', label: '허브' }, { id: 't1', label: '표적1' }, { id: 't2', label: '표적2' },
                 { id: 't3', label: '표적3' }, { id: 't4', label: '표적4' }, { id: 't5', label: '표적5' } ],
        edges: [ { from: 'h', to: 't1' }, { from: 'h', to: 't2' }, { from: 'h', to: 't3' },
                 { from: 'h', to: 't4' }, { from: 'h', to: 't5' } ] } },
      foot: { kw: 'k', color: 'navy', body: 'b' }, notes: 'n' }
  ] }
};
