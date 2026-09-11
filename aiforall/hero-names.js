import { stateNames } from './regions.js';
export { stateNames } from './regions.js';

export function initNameSequence(root, { onChange=()=>{}, observedRoots=[], controls={} }={}) {
  if (!root) return {setPaused(){},destroy(){}};
  const english=root.querySelector('#hero-name'),local=root.querySelector('#hero-name-local');
  const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
  const {select,previous,next,tour,counter,announcement}=controls;
  const visibility=new Map([root,...observedRoots].filter(Boolean).map(el=>[el,true]));
  let index=0,paused=false,held=false,focused=false,alive=true,pageActive=true,timer=0,animations=[];
  function running(){return alive&&!paused&&!held&&!focused&&!motion.matches&&!document.hidden&&[...visibility.values()].some(Boolean)&&pageActive;}
  function fit(){
    root.dataset.layout='stacked';
    root.style.setProperty('--name-scale','1');
  }
  function letters(element,text,lang){
    element.lang=lang;
    const segmenter=typeof Intl.Segmenter==='function'?new Intl.Segmenter(lang,{granularity:'grapheme'}):null;
    const nodes=[];
    for(const [i,word] of text.split(' ').entries()){
      if(i)nodes.push(document.createTextNode(' '));
      const group=document.createElement('span');group.className='flip-word';
      for(const part of segmenter?[...segmenter.segment(word)].map(p=>p.segment):[word]){
        const letter=document.createElement('span');letter.className='flip-letter';letter.textContent=part;group.append(letter);
      }
      nodes.push(group);
    }
    element.replaceChildren(...nodes);
  }
  function cancel(){for(const animation of animations)animation.cancel();animations=[];}
  function show(nextIndex,animate=false,manual=false){
    cancel();index=(nextIndex+stateNames.length)%stateNames.length;
    const item=stateNames[index];root.dataset.length=item.text.length>26?'long':'normal';
    letters(english,item.text,'en');letters(local,item.local,'hi');fit();
    root.closest('h1')?.setAttribute('aria-label',`AI for ${item.text}.`);
    if(select)select.value=item.id;
    const country=item.id==='IN'||item.id==='ALL';
    if(counter){
      const group=stateNames.filter(region=>region.kind===item.kind);
      counter.textContent=country?'28 STATES · 8 UNION TERRITORIES':`${item.kind.toUpperCase()} ${String(group.findIndex(region=>region.id===item.id)+1).padStart(2,'0')} / ${group.length}`;
    }
    if(manual&&announcement)announcement.textContent=`${item.text}. ${country?'India is shown in white.':'Selected region highlighted on the globe.'} Tour paused.`;
    if(animate&&!motion.matches){
      for(const element of [english,local])element.querySelectorAll('.flip-letter').forEach((letter,i)=>{
        animations.push(letter.animate([
          {transform:'perspective(500px) rotateX(90deg) translateY(6px)',opacity:0},
          {transform:'perspective(500px) rotateX(0deg) translateY(0)',opacity:1}
        ],{duration:650,delay:Math.min(i*25,500),easing:'cubic-bezier(.2,.8,.2,1)',fill:'backwards'}));
      });
    }
    onChange(item,{index,manual});
  }
  function schedule(){
    clearTimeout(timer);timer=0;
    const active=running();root.dataset.paused=String(!active);
    // Manual selection holds the tour, but lets the incoming letters finish flipping.
    for(const animation of animations){
      if(paused||document.hidden||!pageActive){if(animation.playState==='running')animation.pause();}
      else if(animation.playState==='paused')animation.play();
    }
    if(tour){tour.hidden=motion.matches;tour.disabled=paused;tour.textContent=held?'Play tour ▷':'Pause tour Ⅱ';tour.setAttribute('aria-pressed',String(held));}
    if(active)timer=setTimeout(()=>{show(index+1,true);schedule();},stateNames[index].text.length>30?8500:6500);
  }
  function choose(value){const target=stateNames.findIndex(item=>item.id===value);if(target<0)return;held=true;show(target,true,true);schedule();}
  const selectChange=()=>choose(select.value),back=()=>choose(stateNames[(index-1+stateNames.length)%stateNames.length].id),forward=()=>choose(stateNames[(index+1)%stateNames.length].id);
  const toggle=()=>{held=!held;schedule();},focus=()=>{focused=true;schedule();},blur=()=>{focused=false;schedule();};
  select?.addEventListener('change',selectChange);select?.addEventListener('focus',focus);select?.addEventListener('blur',blur);
  previous?.addEventListener('click',back);next?.addEventListener('click',forward);tour?.addEventListener('click',toggle);
  function preference(){if(motion.matches)cancel();schedule();}
  function hide(){pageActive=false;schedule();}function reveal(){pageActive=true;schedule();}
  const resize=new ResizeObserver(fit);resize.observe(root);
  const observer=new IntersectionObserver(entries=>{for(const entry of entries)visibility.set(entry.target,entry.isIntersecting);schedule();},{threshold:.08});
  for(const target of visibility.keys())observer.observe(target);
  document.addEventListener('visibilitychange',schedule);motion.addEventListener('change',preference);
  window.addEventListener('pagehide',hide);window.addEventListener('pageshow',reveal);
  document.fonts?.ready.then(()=>{if(alive)fit();});
  show(0);schedule();
  return {setPaused(value){paused=Boolean(value);schedule();},destroy(){alive=false;clearTimeout(timer);cancel();resize.disconnect();observer.disconnect();document.removeEventListener('visibilitychange',schedule);motion.removeEventListener('change',preference);window.removeEventListener('pagehide',hide);window.removeEventListener('pageshow',reveal);select?.removeEventListener('change',selectChange);select?.removeEventListener('focus',focus);select?.removeEventListener('blur',blur);previous?.removeEventListener('click',back);next?.removeEventListener('click',forward);tour?.removeEventListener('click',toggle);}};
}
