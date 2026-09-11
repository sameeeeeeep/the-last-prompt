import { languageExamples } from './language-data.js';
export function initLanguageExamples(root) {
  const controls=[...root.querySelectorAll('[data-language]')];
  const message=root.querySelector('#language-message');
  const name=root.querySelector('#language-name');
  if(!message || !name)return;
  for(const button of controls)button.addEventListener('click',()=>{
    const code=button.dataset.language;
    const sample=languageExamples[code];
    if(!sample)return;
    for(const control of controls)control.setAttribute('aria-pressed',String(control===button));
    message.lang=code;
    message.textContent=sample.text;
    name.textContent=sample.name.toUpperCase();
  });
}
