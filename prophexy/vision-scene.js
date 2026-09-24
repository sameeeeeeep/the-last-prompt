import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const PALETTE={Sun:0xffbf79,Moon:0xf3ede2,Mercury:0xb8b5bb,Venus:0xe6b8a1,Mars:0xe89978,Jupiter:0xd9ba8e,Saturn:0xbeb5a3,Uranus:0x8fb9be,Neptune:0x818dbd,Pluto:0xa399aa};

export function createTomorrowScene(canvas,sky,onSelect){
  const host=canvas.parentElement;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.7));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(34,1,.1,50);camera.position.set(0,0,7.8);
  const root=new THREE.Group();scene.add(root);root.rotation.set(-.29,.2,.09);
  let seed=1109;const random=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};
  const stars=new Float32Array(1300*3),starColors=new Float32Array(1300*3);
  for(let i=0;i<1300;i++){const a=random()*Math.PI*2,r=2.75+random()*4.8,z=(random()-.5)*5;stars.set([Math.cos(a)*r,Math.sin(a)*r,z],i*3);const c=new THREE.Color(random()>.89?0xffb975:0xaeb8d3).multiplyScalar(.15+random()*.44);starColors.set([c.r,c.g,c.b],i*3);}
  const starGeometry=new THREE.BufferGeometry();starGeometry.setAttribute('position',new THREE.BufferAttribute(stars,3));starGeometry.setAttribute('color',new THREE.BufferAttribute(starColors,3));
  const starCloud=new THREE.Points(starGeometry,new THREE.PointsMaterial({size:.015,vertexColors:true,transparent:true,opacity:.82,depthWrite:false}));scene.add(starCloud);
  const ringMaterial=(color,opacity)=>new THREE.LineBasicMaterial({color,transparent:true,opacity,depthWrite:false});
  function orbit(radius,z,material,segments=360){const points=[];for(let i=0;i<=segments;i++){const a=i/segments*Math.PI*2;points.push(new THREE.Vector3(Math.cos(a)*radius,Math.sin(a)*radius,z));}const mesh=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),material);root.add(mesh);return mesh;}
  orbit(1.93,-.05,ringMaterial(0x8b745f,.45));orbit(2.04,-.07,ringMaterial(0x98785f,.17));orbit(2.58,-.35,ringMaterial(0x7d7182,.18));
  const ticks=[];for(let i=0;i<72;i++){const a=i*Math.PI/36,inner=2.08,outer=i%6===0?2.22:2.13;ticks.push(new THREE.Vector3(Math.cos(a)*inner,Math.sin(a)*inner,-.04),new THREE.Vector3(Math.cos(a)*outer,Math.sin(a)*outer,-.04));}
  root.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(ticks),ringMaterial(0xc9a779,.55)));
  const arc=[];for(let i=0;i<=130;i++){const a=(-.68+i/130*1.36)*Math.PI;arc.push(new THREE.Vector3(Math.cos(a)*2.59,Math.sin(a)*2.59,-.32));}
  root.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(arc),ringMaterial(0xffad70,.65)));
  const moonGroup=new THREE.Group();root.add(moonGroup);
  const moon=new THREE.Mesh(new THREE.SphereGeometry(.88,48,32),new THREE.MeshPhongMaterial({color:0xdcd3cb,shininess:6,emissive:0x1d1c27,specular:0x686572}));moonGroup.add(moon);
  const halo=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTexture(),color:0xffb77a,transparent:true,opacity:.21,depthWrite:false}));halo.scale.set(3.65,3.65,1);halo.position.z=-.12;moonGroup.add(halo);
  scene.add(new THREE.AmbientLight(0x878994,.23));
  const phase=Number(sky.moonPhase||0)*Math.PI/180;
  const light=new THREE.DirectionalLight(0xffe6c8,2.5);light.position.set(Math.sin(phase)*4,.45,-Math.cos(phase)*4);scene.add(light);
  const fill=new THREE.PointLight(0xb49db1,.22);fill.position.set(-3,-2,4);scene.add(fill);
  const nodes=[];const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();
  (sky.current||[]).forEach((planet,index)=>{const a=Number(planet.longitude)*Math.PI/180-Math.PI/2,r=1.93,z=.06+(index%3)*.025;
    const holder=new THREE.Group();holder.position.set(Math.cos(a)*r,Math.sin(a)*r,z);root.add(holder);
    const color=PALETTE[planet.body]||0xe3d9d2;
    const size=planet.body==='Sun'?.1:planet.body==='Moon'?.075:.055;
    const sphere=new THREE.Mesh(new THREE.SphereGeometry(size,18,12),new THREE.MeshBasicMaterial({color}));sphere.userData.body=planet.body;holder.add(sphere);
    const flare=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTexture(),color,transparent:true,opacity:.44,depthWrite:false}));flare.scale.set(size*5.4,size*5.4,1);holder.add(flare);
    const hit=new THREE.Mesh(new THREE.SphereGeometry(.16,12,8),new THREE.MeshBasicMaterial({visible:false}));hit.userData.body=planet.body;holder.add(hit);nodes.push(hit);
  });
  let visible=true,paused=reduced.matches,frame=0,last=0,drag=null,hover=null,disposed=false;
  function render(now){frame=0;if(disposed||!visible)return;const dt=Math.min((now-last)/1000||0,.06);last=now;if(!paused){root.rotation.z+=dt*.018;starCloud.rotation.z-=dt*.003;}renderer.render(scene,camera);if(!paused&&!document.hidden)frame=requestAnimationFrame(render);}
  function request(){if(!frame&&visible&&!disposed)frame=requestAnimationFrame(render);}
  function sync(){if(frame)cancelAnimationFrame(frame);frame=0;last=performance.now();if(visible&&!document.hidden)request();}
  const resize=new ResizeObserver(()=>{const rect=host.getBoundingClientRect();if(!rect.width||!rect.height)return;renderer.setSize(rect.width,rect.height,false);camera.aspect=rect.width/rect.height;camera.position.z=camera.aspect<.8?10.2:7.8;camera.updateProjectionMatrix();request();});resize.observe(host);
  function pick(event){const rect=canvas.getBoundingClientRect();pointer.set((event.clientX-rect.left)/rect.width*2-1,-((event.clientY-rect.top)/rect.height*2-1));raycaster.setFromCamera(pointer,camera);return raycaster.intersectObjects(nodes,false)[0]?.object.userData.body||null;}
  canvas.addEventListener('pointerdown',event=>{drag={x:event.clientX,y:event.clientY,moved:false};canvas.setPointerCapture(event.pointerId);});
  canvas.addEventListener('pointermove',event=>{if(drag){const dx=event.clientX-drag.x,dy=event.clientY-drag.y;if(Math.abs(dx)+Math.abs(dy)>2)drag.moved=true;root.rotation.y+=dx*.006;root.rotation.x=THREE.MathUtils.clamp(root.rotation.x+dy*.006,-.85,.85);drag.x=event.clientX;drag.y=event.clientY;request();}else{hover=pick(event);canvas.style.cursor=hover?'pointer':'grab';}});
  canvas.addEventListener('pointerup',event=>{if(drag&&!drag.moved){const body=pick(event);if(body)onSelect(body);}drag=null;});
  canvas.addEventListener('pointercancel',()=>{drag=null;});
  const visibility=()=>sync();document.addEventListener('visibilitychange',visibility);
  const reducedChange=()=>{paused=reduced.matches;sync();};reduced.addEventListener('change',reducedChange);
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();visible=false;sync();host.classList.add('vision-no-webgl');});
  request();
  return {setVisible(value){visible=value;sync();},setPaused(value){paused=value||reduced.matches;sync();},select(body){nodes.forEach(node=>{const chosen=node.userData.body===body;node.parent.scale.setScalar(chosen?1.55:1);});request();},dispose(){disposed=true;cancelAnimationFrame(frame);resize.disconnect();document.removeEventListener('visibilitychange',visibility);reduced.removeEventListener('change',reducedChange);scene.traverse(object=>{object.geometry?.dispose();if(object.material){const materials=Array.isArray(object.material)?object.material:[object.material];materials.forEach(material=>material.dispose());}});renderer.dispose();}};
}

function glowTexture(){
  if(glowTexture.cached)return glowTexture.cached;
  const canvas=document.createElement('canvas');canvas.width=64;canvas.height=64;const cx=canvas.getContext('2d'),gradient=cx.createRadialGradient(32,32,0,32,32,32);gradient.addColorStop(0,'rgba(255,255,255,.8)');gradient.addColorStop(.23,'rgba(255,255,255,.27)');gradient.addColorStop(1,'rgba(255,255,255,0)');cx.fillStyle=gradient;cx.fillRect(0,0,64,64);glowTexture.cached=new THREE.CanvasTexture(canvas);return glowTexture.cached;
}
