import { initTrainingHistory } from './training-history.js';
import { initGlobe } from './globe.js';
import { initNameSequence } from './hero-names.js';
import { initCourseCards } from './course-cards.js';
import { initAIAnatomy } from './ai-anatomy.js';
import './enquiry.js';

document.documentElement.classList.add('js');
initTrainingHistory(document);
const globe=initGlobe(document.querySelector('#globe'));
const names=initNameSequence(document.querySelector('#hero-names'),{
  observedRoots:[document.querySelector('#training-reach')],
  onChange(item){globe.setRegion(item.id==='ALL'?'IN':item.id);}
});
const motionButtons=[...document.querySelectorAll('#motion-toggle,[data-motion-toggle]')];
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
let paused=false;
function syncMotion(){
  for(const button of motionButtons){
    button.hidden=reduced.matches;
    button.textContent=paused?'Play motion ▷':'Pause motion Ⅱ';
    button.setAttribute('aria-pressed',String(paused));
  }
  document.documentElement.dataset.motionPaused=String(paused||reduced.matches);
}
for(const button of motionButtons)button.addEventListener('click',()=>{
  paused=!paused;globe.setPaused(paused);names.setPaused(paused);syncMotion();
});
reduced.addEventListener('change',syncMotion);syncMotion();
window.addEventListener('pagehide',()=>globe.setPaused(true));
window.addEventListener('pageshow',()=>globe.setPaused(paused));
initAIAnatomy(document.querySelector('#ai-anatomy'));
initCourseCards(document.querySelector('#audience-track'),{previous:document.querySelector('#audience-prev'),next:document.querySelector('#audience-next'),range:document.querySelector('#audience-range')});

for (const link of document.querySelectorAll('[data-programme]')) link.addEventListener('click', () => {
  document.querySelector('#programme').value = link.dataset.programme;
});
