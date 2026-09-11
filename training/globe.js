import { indiaPointIndices } from './india-points.js';
import { landCoordinates } from './land-points.js';
/** Original globe rendering; Natural Earth public-domain land data. CSS-size the canvas.
 * const globe = initGlobe(canvas); globe.setPaused(true); globe.resetView(); globe.destroy();
 * Parent supplies accessible equivalent text and an accessible pause/resume button.
 */
export function initGlobe(canvas, locations=[]) {
  if(!canvas)return {setPaused(){},resetView(){},destroy(){}};
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return { setPaused() {}, resetView() {}, destroy() {} };
  const rad = Math.PI / 180;
  const land = [];
  const indiaPoints=new Set(indiaPointIndices);
  const learnerLocations=locations.filter(item=>item.name&&Number.isFinite(item.lat)&&Math.abs(item.lat)<=90&&Number.isFinite(item.lon)&&Math.abs(item.lon)<=180).map(item=>{
    const a=item.lon*rad,b=item.lat*rad;
    return {name:item.name,point:[Math.cos(b)*Math.sin(a),Math.sin(b),Math.cos(b)*Math.cos(a)]};
  });
  const bandCount=32, depthCount=12, warmthCount=4;
  for (let i = 0; i < landCoordinates.length; i += 2) {
    const lon = landCoordinates[i] * rad, lat = landCoordinates[i + 1] * rad;
    const p=[Math.cos(lat)*Math.sin(lon), Math.sin(lat), Math.cos(lat)*Math.cos(lon)];
    // Spatial colour bands follow the actual spherical land coordinates.
    const phase=p[0]*3+p[1]*4+p[2]*2;
    p[3]=Math.floor(((phase % (2*Math.PI)+2*Math.PI)%(2*Math.PI))/(2*Math.PI)*bandCount);
    p[5]=indiaPoints.has(i/2);
    p[4]=p[5]?warmthCount-1:0;
    land.push(p);
  }
  const ocean = [];
  for (let lat = -87; lat <= 87; lat += 4) {
    const n = Math.round(360*Math.cos(lat*rad)/4);
    for (let i=0;i<n;i++) {const a=i*2*Math.PI/n,b=lat*rad;ocean.push([Math.cos(b)*Math.sin(a),Math.sin(b),Math.cos(b)*Math.cos(a)]);}
  }
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let alive=true, paused=false, visible=true, frame=0, previous=0, width=0, height=0;
  let longitude=78*rad, latitude=20*rad, drag=null, drift=0, colourTime=0, userRotated=false;
  const oldTouchAction=canvas.style.touchAction;
  canvas.style.touchAction='pan-y';
  function render() {
    if (!alive || !width || !height) return;
    const dpr=Math.min(devicePixelRatio || 1,2);
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,width,height);
    const cx=width/2,cy=height/2,r=Math.min(width,height)*.405;
    const atmosphere=ctx.createRadialGradient(cx,cy,r*.8,cx,cy,r*1.25);
    atmosphere.addColorStop(0,'rgba(0,76,255,0)');atmosphere.addColorStop(.5,'rgba(14,83,255,.12)');atmosphere.addColorStop(1,'rgba(0,76,255,0)');
    ctx.fillStyle=atmosphere;ctx.fillRect(0,0,width,height);
    const sphere=ctx.createRadialGradient(cx-r*.3,cy-r*.35,0,cx,cy,r);
    sphere.addColorStop(0,'#040f29');sphere.addColorStop(.75,'#020812');sphere.addColorStop(1,'#02050c');
    ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fillStyle=sphere;ctx.fill();
    const sl=Math.sin(longitude),cl=Math.cos(longitude),st=Math.sin(latitude),ct=Math.cos(latitude);
    const project=p=>{const x=p[0]*cl-p[2]*sl,z=p[0]*sl+p[2]*cl;return [x,p[1]*ct-z*st,p[1]*st+z*ct];};
    const bins=Array.from({length:depthCount*bandCount*warmthCount},()=>[]);
    for(const p of ocean){const q=project(p);if(q[2]>.02){const a=.09+.13*q[2];ctx.fillStyle=`rgba(28,96,215,${a})`;ctx.fillRect(cx+q[0]*r,cy-q[1]*r,.8,.8);}}
    for(const p of land){const q=project(p);if(q[2]>.015){
      if(p[5]){
        // A gentle displacement follows the Indian land dots, not an approximate radius.
        const wave=colourTime*2.2+p[0]*19+p[1]*15;
        q[0]+=Math.sin(wave)*.006;q[1]+=Math.cos(wave*.8)*.005;
      }
      const depth=Math.min(depthCount-1,Math.floor(q[2]*depthCount));
      bins[(depth*bandCount+p[3])*warmthCount+p[4]].push(q);
    }}
    // Continuous palette interpolation keeps light moving without flashing or flicker.
    const palettes=Array.from({length:bandCount},(_,band)=>{
      const phase=band/bandCount*Math.PI*2-colourTime;
      const weights=[0,2*Math.PI/3,4*Math.PI/3].map(offset=>Math.pow((1+Math.cos(phase-offset))/2,2));
      const total=weights.reduce((sum,w)=>sum+w,0);
      const stops=[[60,124,255],[143,105,250],[50,201,211]];
      return [0,1,2].map(channel=>stops.reduce((sum,stop,i)=>sum+stop[channel]*weights[i]/total,0));
    });
    for(let b=0;b<bins.length;b++) {
      if(!bins[b].length)continue;
      const warmth=b%warmthCount/(warmthCount-1)*.82;
      const band=Math.floor(b/warmthCount)%bandCount;
      const depth=(Math.floor(b/(warmthCount*bandCount))+.5)/depthCount;
      const radius=(.55+depth*.65)*Math.max(.66,Math.min(1.25,r/235));
      ctx.beginPath();
      for(const p of bins[b]) {const x=cx+p[0]*r,y=cy-p[1]*r;ctx.moveTo(x+radius,y);ctx.arc(x,y,radius,0,2*Math.PI);}
      const warm=[153+Math.round(Math.sin(colourTime*.7)*24),224,246];
      const rgb=palettes[band].map((value,i)=>Math.round((value*(1-warmth)+warm[i]*warmth)*(.78+depth*.22)));
      ctx.fillStyle=`rgba(${rgb.join(',')},${.33+depth*.64})`;
      ctx.fill();
    }
    // Spread city callouts so nearby Mumbai/Pune markers remain readable.
    const markers=learnerLocations.map((location,i)=>{
      const q=project(location.point);if(q[2]<.12)return null;
      return {name:location.name,i,x:cx+q[0]*r,y:cy-q[1]*r,right:i%2===0};
    }).filter(Boolean);
    for(const right of [false,true]){
      const side=markers.filter(item=>item.right===right).sort((a,b)=>a.y-b.y);
      let lastY=cy-r*.55-30;
      for(const marker of side){
        marker.labelY=Math.max(marker.y, lastY+30);lastY=marker.labelY;
        marker.labelX=cx+(right?1:-1)*r*.52;
      }
    }
    for(const marker of markers){
      const {x,y,i,right,labelX:tx,labelY:ty}=marker;
      const pulse=(Math.sin(colourTime*2+i*.7)+1)/2;
      ctx.beginPath();ctx.arc(x,y,4+pulse*4,0,Math.PI*2);
      ctx.strokeStyle=`rgba(153,231,217,${.4-pulse*.2})`;ctx.lineWidth=1;ctx.stroke();
      ctx.beginPath();ctx.arc(x,y,2.5,0,Math.PI*2);ctx.fillStyle='#c6fff1';ctx.fill();
      ctx.beginPath();ctx.moveTo(x+(right?4:-4),y);ctx.lineTo(tx,ty);ctx.strokeStyle='#759eaf90';ctx.stroke();
      ctx.font='500 12px -apple-system, Arial, sans-serif';ctx.fillStyle='#d0e6f2';ctx.textAlign=right?'left':'right';ctx.fillText(marker.name,tx+(right?5:-5),ty+4);
    }
    ctx.textAlign='left';
    // An atmospheric edge establishes the sphere without drawing political borders.
    ctx.beginPath();ctx.arc(cx,cy,r+.5,0,Math.PI*2);ctx.strokeStyle='rgba(61,124,255,.20)';ctx.lineWidth=.8;ctx.stroke();
  }
  function tick(now) {
    frame=0;
    if(!alive || paused || motion.matches || document.hidden || !visible){previous=0;return;}
    if(!previous)previous=now;
    const delta=now-previous;
    if(delta>=32){colourTime+=Math.min(delta,60)*.00022;if(!drag&&!userRotated){drift+=Math.min(delta,60)*.00015;longitude=78*rad+Math.sin(drift)*.11;}previous=now;render();}
    frame=requestAnimationFrame(tick);
  }
  function sync(){cancelAnimationFrame(frame);frame=0;previous=0;render();if(alive&&!paused&&!motion.matches&&!document.hidden&&visible)frame=requestAnimationFrame(tick);}
  function resize(){const rect=canvas.getBoundingClientRect();width=rect.width;height=rect.height;const d=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(width*d);canvas.height=Math.round(height*d);render();}
  function down(e){if(!alive||e.button!==0)return;userRotated=true;drag={id:e.pointerId,x:e.clientX,y:e.clientY,lon:longitude,lat:latitude};if(e.pointerType==='mouse')canvas.setPointerCapture?.(e.pointerId);}
  function move(e){if(!drag||e.pointerId!==drag.id)return;longitude=drag.lon-(e.clientX-drag.x)*.006;latitude=Math.max(-1.15,Math.min(1.15,drag.lat+(e.clientY-drag.y)*.004));render();}
  function up(e){if(drag?.id===e.pointerId){drag=null;if(canvas.hasPointerCapture?.(e.pointerId))canvas.releasePointerCapture(e.pointerId);}}
  const ro=new ResizeObserver(resize);ro.observe(canvas);
  const io=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();});io.observe(canvas);
  canvas.addEventListener('pointerdown',down,{passive:true});canvas.addEventListener('pointermove',move,{passive:true});
  canvas.addEventListener('pointerup',up,{passive:true});canvas.addEventListener('pointercancel',up,{passive:true});canvas.addEventListener('lostpointercapture',up,{passive:true});
  window.addEventListener('pointerup',up,{passive:true});window.addEventListener('resize',resize,{passive:true});
  document.addEventListener('visibilitychange',sync);motion.addEventListener('change',sync);
  resize();sync();
  return {
    resetView(){if(!alive)return;if(drag&&canvas.hasPointerCapture?.(drag.id))canvas.releasePointerCapture(drag.id);drag=null;longitude=78*rad;latitude=20*rad;drift=0;userRotated=false;render();},
    setPaused(value){if(!alive)return;paused=Boolean(value);sync();},
    destroy(){alive=false;cancelAnimationFrame(frame);ro.disconnect();io.disconnect();canvas.style.touchAction=oldTouchAction;
      canvas.removeEventListener('pointerdown',down);canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerup',up);canvas.removeEventListener('pointercancel',up);canvas.removeEventListener('lostpointercapture',up);
      window.removeEventListener('pointerup',up);window.removeEventListener('resize',resize);document.removeEventListener('visibilitychange',sync);motion.removeEventListener('change',sync);
      if(drag&&canvas.hasPointerCapture?.(drag.id))canvas.releasePointerCapture(drag.id);drag=null;
    }
  };
}
