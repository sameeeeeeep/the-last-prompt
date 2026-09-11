const form = document.querySelector('#enquiry-form');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const value = id => document.getElementById(id).value.trim();
  const details = [
    '[AI for All programme enquiry]',
    `Institution / mission / programme: ${value('institution')}`,
    `People reached: ${value('audience')}`,
    `Preferred languages: ${value('language-preference') || 'To discuss'}`,
    `Group size: ${value('size') || 'To discuss'}`,
    `City / location: ${value('city') || 'To discuss'}`,
    `Preferred timing: ${value('timing') || 'To discuss'}`,
    `Programme scope: ${value('programme')}`,
    `Goals and available tools: ${value('goals') || 'To discuss'}`,
  ].join('\n');
  const url = new URL(form.action);
  url.searchParams.set('usp','pp_url');
  url.searchParams.set('entry.1412016144',value('name'));
  url.searchParams.set('entry.1545493625',value('email'));
  url.searchParams.set('entry.280725317',details);
  // The visitor reviews and submits in the existing form; no no-cors request or false success state.
  window.location.assign(url.href);
});
