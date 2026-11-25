'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),cp=require('child_process'),path=require('path');
test('PDF sensor rejects split identifiers, missing/overlapping text and overflow while allowing wrapped prose',()=>{
 const script=path.resolve(__dirname,'../../../../tools/check-rendered-tables.py');
 const code=`import importlib.util
s=importlib.util.spec_from_file_location('sensor',${JSON.stringify(script)})
m=importlib.util.module_from_spec(s);s.loader.exec_module(m)
def word(t,y,x=1,right=95):return dict(text=t,xMin=x,xMax=right,yMin=y,yMax=y+8)
assert m.inspect_cell('Order.shippingAddress',[word('Order.shippingAddres',1),word('s',11)],(0,0,100,30))
assert not m.inspect_cell('Order.shippingAddress',[word('Order.shippingAddress',1)],(0,0,100,30))
assert not m.inspect_cell('first line second line',[word('first line',1),word('second line',11)],(0,0,100,30))
assert m.inspect_cell('same text',[word('same text INTRUSION',1)],(0,0,100,30))
assert m.inspect_cell('same text',[word('same text',25)],(0,0,100,30))
assert m.inspect_cell('same text',[word('same text',1,right=103)],(0,0,100,30))
`;
 const r=cp.spawnSync('python3',['-c',code],{encoding:'utf8'});assert.equal(r.status,0,r.stderr);
});
