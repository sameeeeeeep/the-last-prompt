import { officialIndiaWorldIndices, regionGeography } from './region-geography.js';
import { landCoordinates } from './land-points.js';
/** Original globe rendering; Natural Earth world data; Survey of India / NWIC official state dots. CSS-size the canvas.
 * const globe = initGlobe(canvas); globe.setPaused(true); globe.resetView(); globe.destroy();
 * Parent supplies accessible equivalent text and an accessible pause/resume button.
 */
export function initGlobe(canvas) {
  if(!canvas)return {setRegion(){},setPaused(){},resetView(){},destroy(){}};
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return { setRegion() {}, setPaused() {}, resetView() {}, destroy() {} };
  const rad = Math.PI / 180;
  const land = [];
  const replaceWorldPoints=new Set(officialIndiaWorldIndices);
  const bandCount=32, depthCount=12, warmthCount=4;
  for (let i = 0; i < landCoordinates.length; i += 2) {
    if(replaceWorldPoints.has(i/2))continue;
    const lon = landCoordinates[i] * rad, lat = landCoordinates[i + 1] * rad;
    const p=[Math.cos(lat)*Math.sin(lon), Math.sin(lat), Math.cos(lat)*Math.cos(lon)];
    // Spatial colour bands follow the actual spherical land coordinates.
    const phase=p[0]*3+p[1]*4+p[2]*2;
    p[3]=Math.floor(((phase % (2*Math.PI)+2*Math.PI)%(2*Math.PI))/(2*Math.PI)*bandCount);
    p[5]=null;
    p[4]=0;
    land.push(p);
  }
  // Geometry comes from the published polygons, including islands and enclaves.
  for(const [id,geometry] of Object.entries(regionGeography)){
    if(!geometry.globe)continue;
    for(let i=0;i<geometry.globe.length;i+=2){
      const lon=geometry.globe[i]*rad,lat=geometry.globe[i+1]*rad;
      const p=[Math.cos(lat)*Math.sin(lon),Math.sin(lat),Math.cos(lat)*Math.cos(lon)];
      const phase=p[0]*3+p[1]*4+p[2]*2;
      p[3]=Math.floor(((phase%(2*Math.PI)+2*Math.PI)%(2*Math.PI))/(2*Math.PI)*bandCount);
      p[4]=1;p[5]=id;
      const [west,south,east,north]=geometry.bounds;
      p[3]=Math.max(0,Math.min(bandCount-1,Math.floor(((geometry.globe[i]-west)/(east-west)*.65+(north-geometry.globe[i+1])/(north-south)*.35)*bandCount)));
      land.push(p);
    }
  }
  const ocean = [];
  for (let lat = -87; lat <= 87; lat += 4) {
    const n = Math.round(360*Math.cos(lat*rad)/4);
    for (let i=0;i<n;i++) {const a=i*2*Math.PI/n,b=lat*rad;ocean.push([Math.cos(b)*Math.sin(a),Math.sin(b),Math.cos(b)*Math.cos(a)]);}
  }
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let alive=true, paused=false, visible=true, frame=0, previous=0, width=0, height=0;
  let selected="IN",targetLongitude=80*rad,targetLatitude=22*rad;
  let longitude=targetLongitude, latitude=targetLatitude, drag=null, drift=0, colourTime=0, userRotated=false;
  const oldTouchAction=canvas.style.touchAction;
  canvas.style.touchAction='pan-y';
  function render() {
    if (!alive || !width || !height) return;
    const dpr=Math.min(devicePixelRatio || 1,2);
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,width,height);
    const cx=width/2,cy=height/2,r=Math.min(width,height)*.445;
    const atmosphere=ctx.createRadialGradient(cx,cy,r*.8,cx,cy,r*1.25);
    atmosphere.addColorStop(0,'rgba(0,76,255,0)');atmosphere.addColorStop(.5,'rgba(58,65,140,.08)');atmosphere.addColorStop(1,'rgba(0,76,255,0)');
    ctx.fillStyle=atmosphere;ctx.fillRect(0,0,width,height);
    const sphere=ctx.createRadialGradient(cx-r*.3,cy-r*.35,0,cx,cy,r);
    sphere.addColorStop(0,'#080b13');sphere.addColorStop(.75,'#03060c');sphere.addColorStop(1,'#020409');
    ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fillStyle=sphere;ctx.fill();
    const sl=Math.sin(longitude),cl=Math.cos(longitude),st=Math.sin(latitude),ct=Math.cos(latitude);
    const project=p=>{const x=p[0]*cl-p[2]*sl,z=p[0]*sl+p[2]*cl;return [x,p[1]*ct-z*st,p[1]*st+z*ct];};
    const bins=Array.from({length:depthCount*bandCount*warmthCount},()=>[]);
    for(const p of ocean){const q=project(p);if(q[2]>.02){const a=.06+.08*q[2];ctx.fillStyle=`rgba(96,107,140,${a})`;ctx.fillRect(cx+q[0]*r,cy-q[1]*r,.8,.8);}}
    for(const p of land){const q=project(p);if(q[2]>.015){
      const active=p[5]&&selected!=="IN"&&p[5]===selected;
      p[4]=active?3:p[5]?1:0;
      const depth=Math.min(depthCount-1,Math.floor(q[2]*depthCount));
      bins[(depth*bandCount+p[3])*warmthCount+p[4]].push(q);
    }}
    // Selected-state dots carry the site's blue-to-violet gradient. India remains white.
    const palettes=Array.from({length:bandCount},(_,band)=>{
      const t=Math.max(0,Math.min(1,band/(bandCount-1)+Math.sin(colourTime*.65)*.12));
      return [73,108,255].map((value,i)=>Math.round(value+([174,128,255][i]-value)*t));
    });
    for(let b=0;b<bins.length;b++) {
      if(!bins[b].length)continue;
      const category=b%warmthCount;
      const band=Math.floor(b/warmthCount)%bandCount;
      const depth=(Math.floor(b/(warmthCount*bandCount))+.5)/depthCount;
      const tiny=selected!=="IN"&&regionGeography[selected].globe.length<=40;
      const radius=(category===3?(tiny?1.8:.76):category===1?.51:.78)*(.8+depth*.2)*Math.max(.72,Math.min(1.3,r/235));
      ctx.beginPath();
      for(const p of bins[b]) {const x=cx+p[0]*r,y=cy-p[1]*r;ctx.moveTo(x+radius,y);ctx.arc(x,y,radius,0,2*Math.PI);}
      const rgb=category===3?palettes[band]:category===1?[255,255,255]:[116,126,153];
      const opacity=category===1?.72+depth*.28:category===3?.96:.20+depth*.35;
      ctx.fillStyle=`rgba(${rgb.join(',')},${opacity})`;
      ctx.shadowColor=category===3?`rgba(${rgb.join(',')},.7)`:'transparent';
      ctx.shadowBlur=category===3?1.6:0;
      ctx.fill();ctx.shadowBlur=0;
    }
    // An atmospheric edge establishes the sphere without drawing political borders.
    ctx.beginPath();ctx.arc(cx,cy,r+.5,0,Math.PI*2);ctx.strokeStyle='rgba(61,124,255,.20)';ctx.lineWidth=.8;ctx.stroke();
  }
  function tick(now) {
    frame=0;
    if(!alive || paused || motion.matches || document.hidden || !visible){previous=0;return;}
    if(!previous)previous=now;
    const delta=now-previous;
    if(delta>=32){
      const elapsed=Math.min(delta,60);colourTime+=elapsed*.00022;
      if(!drag&&!userRotated){
        drift+=elapsed*.0001;
        const target=targetLongitude+Math.sin(drift)*.018;
        longitude+=(target-longitude)*.065;latitude+=(targetLatitude-latitude)*.065;
      }
      previous=now;render();
    }
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
    setRegion(id){
      if(!alive)return;
      selected=regionGeography[id]?id:'IN';
      const [lon,lat]=regionGeography.IN.focus;targetLongitude=lon*rad;targetLatitude=lat*rad;userRotated=false;
      canvas.dataset.region=selected;
      if(paused||motion.matches||!visible){longitude=targetLongitude;latitude=targetLatitude;}
      render();
    },
    resetView(){if(!alive)return;if(drag&&canvas.hasPointerCapture?.(drag.id))canvas.releasePointerCapture(drag.id);drag=null;longitude=targetLongitude;latitude=targetLatitude;drift=0;userRotated=false;render();},
    setPaused(value){if(!alive)return;paused=Boolean(value);sync();},
    destroy(){alive=false;cancelAnimationFrame(frame);ro.disconnect();io.disconnect();canvas.style.touchAction=oldTouchAction;
      canvas.removeEventListener('pointerdown',down);canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerup',up);canvas.removeEventListener('pointercancel',up);canvas.removeEventListener('lostpointercapture',up);
      window.removeEventListener('pointerup',up);window.removeEventListener('resize',resize);document.removeEventListener('visibilitychange',sync);motion.removeEventListener('change',sync);
      if(drag&&canvas.hasPointerCapture?.(drag.id))canvas.releasePointerCapture(drag.id);drag=null;
    }
  };
}
