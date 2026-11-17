"use strict";
const {naturalSize,MIN_PT}=require('./visualFit');
// Split the original image's viewport, never its source. Adjacent pages repeat
// a 0.6in band so labels and connectors crossing a boundary remain readable.
function diagramTiles(image,box) {
 const full=naturalSize(image,MIN_PT),overlap=0.6;
 const spans=(size,room)=>{const out=[];let start=0;while(start<size-1e-9){const end=Math.min(size,start+room);out.push([start,end]);if(end===size)break;start=end-Math.min(overlap,room/3);}return out;};
 const xs=spans(full.w,box.w),ys=spans(full.h,box.h),tiles=[];
 for(const [top,bottom] of ys)for(const [left,right] of xs)tiles.push({
  bounds:{x:box.x+(box.w-(right-left))/2,y:box.y,w:right-left,h:bottom-top},
  crop:{l:left/full.w,r:1-right/full.w,t:top/full.h,b:1-bottom/full.h}
 });
 return tiles;
}
module.exports={diagramTiles};
