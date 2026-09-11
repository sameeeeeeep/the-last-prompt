export const learningLevels = ['Prompt','Research','Create','Build','Automate'];
export function initUpgradeAnimation(root) {
  if(!root)return {setPaused(){},destroy(){}};
  const panels=[...root.querySelectorAll('[data-upgrade-panel]')];
  const buttons=[...root.querySelectorAll('[data-upgrade-step]')];
  const count=root.querySelector('[data-level-count]');
  const title=root.querySelector('[data-level-title]');
  const announcement=root.querySelector('[data-upgrade-announcement]');
  const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
  let step=0,paused=false,visible=true,alive=true,pageActive=true,timer=0;
  function show(next,manual=false){
    step=next;root.dataset.stage=String(step);root.style.setProperty('--level',String(step));
    panels.forEach(panel=>{panel.hidden=Number(panel.dataset.upgradePanel)!==step;});
    buttons.forEach(button=>{
      const i=Number(button.dataset.upgradeStep);
      button.setAttribute('aria-pressed',String(i===step));button.dataset.complete=String(i<step);
    });
    count.textContent=`LEVEL ${step+1} / 5`;title.textContent=learningLevels[step];
    if(manual)announcement.textContent=`Level ${step+1}: ${learningLevels[step]}.`;
  }
  function schedule(){
    clearTimeout(timer);timer=0;
    const running=alive&&!paused&&!motion.matches&&!document.hidden&&visible&&pageActive;
    root.dataset.running=String(running);
    if(running)timer=setTimeout(()=>{show((step+1)%5);schedule();},step===4?6000:4800);
  }
  const handlers=buttons.map(button=>{
    const handler=()=>{
      const next=Number(button.dataset.upgradeStep);if(next<0||next>4||!Number.isInteger(next))return;
      show(next,true);schedule();
    };button.addEventListener('click',handler);return [button,handler];
  });
  function hide(){pageActive=false;schedule();}function reveal(){pageActive=true;schedule();}
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule();},{threshold:.1});observer.observe(root);
  document.addEventListener('visibilitychange',schedule);motion.addEventListener('change',schedule);
  window.addEventListener('pagehide',hide);window.addEventListener('pageshow',reveal);
  show(0);schedule();
  return {setPaused(value){paused=Boolean(value);schedule();},destroy(){alive=false;clearTimeout(timer);observer.disconnect();for(const [button,handler] of handlers)button.removeEventListener('click',handler);document.removeEventListener('visibilitychange',schedule);motion.removeEventListener('change',schedule);window.removeEventListener('pagehide',hide);window.removeEventListener('pageshow',reveal);}};
}
