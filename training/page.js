import { initUpgradeAnimation } from './upgrade-animation.js';
import { initTrainingHistory } from './training-history.js';
import { initGlobe } from './globe.js';
import { initNameSequence } from './hero-names.js';
import { initCourseCards } from './course-cards.js';
import { examples } from './curriculum-data.js';
import { initLanguageExamples } from './languages.js';
import './enquiry.js';

document.documentElement.classList.add('js');
const history=initTrainingHistory(document);
const globe=initGlobe(document.querySelector('#globe'),history.locations);
const names=initNameSequence(document.querySelector('#hero-names'));
const upgrade=initUpgradeAnimation(document.querySelector('#upgrade-animation'));
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
  paused=!paused;globe.setPaused(paused);names.setPaused(paused);upgrade.setPaused(paused);syncMotion();
});
document.querySelector('#focus-india').addEventListener('click',()=>globe.resetView());
reduced.addEventListener('change',syncMotion);syncMotion();
window.addEventListener('pagehide',()=>globe.setPaused(true));
window.addEventListener('pageshow',()=>globe.setPaused(paused));
initCourseCards(document.querySelector('#course-track'));
initLanguageExamples(document);

const audienceNames = {students:'students and ITI learners',faculty:'faculty and trainers',enterprise:'enterprise and livelihood cohorts'};
const audienceOptions = {students:'Students and ITI learners',faculty:'Faculty and trainers',enterprise:'MSMEs and local entrepreneurs'};
for (const button of document.querySelectorAll('[data-audience]')) {
  button.addEventListener('click', () => {
    const audience = button.dataset.audience;
    if (!examples[audience]) return;
    for (const item of document.querySelectorAll('[data-audience]')) item.setAttribute('aria-pressed', String(item === button));
    for (let i = 0; i < 6; i++) {
      document.querySelector(`[data-project-title="${i+1}"]`).textContent = examples[audience][i][0];
      document.querySelector(`[data-exercise="${i+1}"]`).textContent = examples[audience][i][1];
      document.querySelector(`[data-takeaway="${i+1}"]`).textContent = examples[audience][i][2];
    }
    document.querySelector('#audience-update').textContent = `All six labs now show projects for ${audienceNames[audience]}.`;
    document.querySelector('#audience').value = audienceOptions[audience];
  });
}
for (const link of document.querySelectorAll('[data-programme]')) link.addEventListener('click', () => {
  document.querySelector('#programme').value = link.dataset.programme;
});

const projectNotes = {
  idea:'Start with a skill the group already has and a practical goal they care about.',
  build:'Learners use AI to make each piece, then check the product claims, wording and calculations together.',
  outcome:'The learner can demonstrate the project, explain how it works and use the method again.'
};
const stageViews = [...document.querySelectorAll('[data-stage-view]')];
const stageButtons = [...document.querySelectorAll('[data-doc-step]')];
for (const button of stageButtons) button.addEventListener('click', () => {
  const step = button.dataset.docStep;
  if (!projectNotes[step]) return;
  for (const item of stageButtons) item.setAttribute('aria-pressed',String(item === button));
  for (const view of stageViews) {
    const selected = view.dataset.stageView === step;
    view.hidden = !selected;
    view.classList.toggle('changing', selected);
  }
  document.querySelector('[data-doc-copy]').textContent = projectNotes[step];
});
