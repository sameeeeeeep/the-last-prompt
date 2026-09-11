export const stateNames = [
  {text:'India', local:'भारत', lang:'hi'},
  {text:'Maharashtra', local:'महाराष्ट्र', lang:'mr'},
  {text:'Tamil Nadu', local:'தமிழ்நாடு', lang:'ta'},
  {text:'Karnataka', local:'ಕರ್ನಾಟಕ', lang:'kn'},
  {text:'Telangana', local:'తెలంగాణ', lang:'te'},
  {text:'Gujarat', local:'ગુજરાત', lang:'gu'},
  {text:'West Bengal', local:'পশ্চিমবঙ্গ', lang:'bn'},
  {text:'Kerala', local:'കേരളം', lang:'ml'},
  {text:'Punjab', local:'ਪੰਜਾਬ', lang:'pa'},
  {text:'All', local:'सबके लिए', lang:'hi'}
];
export function initNameSequence(root) {
  if (!root) return {setPaused(){},destroy(){}};
  const english=root.querySelector('#hero-name');
  const local=root.querySelector('#hero-name-local');
  const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
  let index=0, paused=false, visible=true, alive=true, pageActive=true, timer=0, animations=[];
  function running(){return alive&&!paused&&!motion.matches&&!document.hidden&&visible&&pageActive;}
  function fit(){
    root.style.setProperty('--name-scale','1');
    const width=english.scrollWidth+local.scrollWidth+28;
    root.style.setProperty('--name-scale',String(Math.min(1,root.clientWidth/width)));
  }
  function letters(element,text,lang){
    element.lang=lang;
    // Preserve vowel marks and conjuncts while animating Indian scripts.
    const segments=typeof Intl.Segmenter==='function'
      ? [...new Intl.Segmenter(lang,{granularity:'grapheme'}).segment(text)].map(item=>item.segment)
      : [text];
    element.replaceChildren(...segments.map(part=>{
      const span=document.createElement('span');span.className='flip-letter';span.textContent=part===' '?'\u00a0':part;return span;
    }));
  }
  function cancel(){for(const animation of animations)animation.cancel();animations=[];}
  function show(next,animate=false){
    cancel();index=next;
    const item=stateNames[index];
    letters(english,item.text,'en');letters(local,item.local,item.lang);fit();
    if(animate&&!motion.matches){
      for(const element of [english,local]) [...element.children].forEach((letter,i)=>{
        animations.push(letter.animate([
          {transform:'perspective(500px) rotateX(95deg) translateY(5px)',opacity:0},
          {transform:'perspective(500px) rotateX(0deg) translateY(0)',opacity:1}
        ],{duration:560,delay:i*36,easing:'cubic-bezier(.2,.8,.2,1)',fill:'backwards'}));
      });
    }
  }
  function schedule(){
    clearTimeout(timer);timer=0;
    root.dataset.paused=String(!running());
    for(const animation of animations)running()?animation.play():animation.pause();
    if(running()&&index<stateNames.length-1)timer=setTimeout(()=>{
      show(index+1,true);schedule();
    },index===0?3300:2700);
  }
  function preference(){if(motion.matches)cancel();schedule();}
  function hide(){pageActive=false;schedule();}
  function reveal(){pageActive=true;schedule();}
  const resize=new ResizeObserver(fit);resize.observe(root);
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule();});observer.observe(root);
  document.addEventListener('visibilitychange',schedule);motion.addEventListener('change',preference);
  window.addEventListener('pagehide',hide);window.addEventListener('pageshow',reveal);
  document.fonts?.ready.then(()=>{if(alive)fit();});
  show(0);schedule();
  return {setPaused(value){paused=Boolean(value);schedule();},destroy(){alive=false;clearTimeout(timer);cancel();resize.disconnect();observer.disconnect();document.removeEventListener('visibilitychange',schedule);motion.removeEventListener('change',preference);window.removeEventListener('pagehide',hide);window.removeEventListener('pageshow',reveal);}};
}
