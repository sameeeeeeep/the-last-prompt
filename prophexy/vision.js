/* Tomorrow's vision lives in the same Prophexy reading and uses the same saved person and sky engine. */
(function(){
  const S=window.PXSky, PX=window.__PX, root=document.getElementById('s-tomorrow');
  if(!S||!PX||!root)return;
  const $=id=>document.getElementById(id);
  const escape=value=>String(value==null?'':value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  let person=null;
  try{const people=JSON.parse(localStorage.getItem('prophexy.people'))||[];person=people.find(item=>item.id===PX.pid)||null;}catch{}
  const day=new Date();day.setDate(day.getDate()+1);day.setHours(12,0,0,0);
  const label=new Intl.DateTimeFormat(undefined,{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(day);
  const positions=S.positions(day);
  const angle=S.rev(positions.Moon-positions.Sun),illum=Math.round((1-Math.cos(angle*Math.PI/180))*50);
  const bodies=['Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn'];
  const current=bodies.map(body=>({body,longitude:positions[body],sign:S.sign(positions[body]),degree:S.rev(positions[body])%30}));
  const sky={moonPhase:angle,current,transits:[]};
  const houseHeads=['Your own pace takes the lead.','Comfort asks for attention.','Words set the rhythm.','Home holds the center.','A little joy wants room.','Small duties take the stage.','Someone else comes into focus.','Look beneath the surface.','The wider view returns.','Your work is visible.','Your circle comes closer.','A quieter answer arrives.'];
  const houseLines=[
    'You may feel more aware of what is yours to choose. Let your own energy set the scale of the day.',
    'Money, possessions, and simple comforts may matter more than usual. Notice what helps you feel steady.',
    'A message or conversation may change the way you see a small problem. Say the plain thing first.',
    'Familiar places and family can pull at your attention. Home may be where the day makes most sense.',
    'Play, creativity, or affection may feel less optional. Give an ordinary pleasure some room.',
    'Work and daily tasks may ask for care. The useful move is small enough to finish.',
    'A partner or one close person may be the mirror of the day. Listen for what is actually being asked.',
    'A private feeling or shared responsibility may need a closer look. Let the first reaction settle.',
    'You may want more space, learning, or a change of perspective. One new angle could be enough.',
    'A visible piece of work may ask for your attention. Show what is ready, even if it is not perfect.',
    'Friends and future plans may feel closer. One conversation could help a wish take shape.',
    'Your inner life may speak more loudly than the schedule. A quieter stretch could tell you what needs rest.'
  ];
  let house=null,method='shared sky',natal=null;
  if(person&&person.dob){
    const parts=person.dob.split('-').map(Number),time=String(person.tob||'12:00').split(':').map(Number);
    const offset=S.tzGuess(person.lat,person.lng);
    const birth=new Date(Date.UTC(parts[0],parts[1]-1,parts[2],Number.isFinite(time[0])?time[0]:12,Number.isFinite(time[1])?time[1]:0)-offset*3600000);
    natal=S.positions(birth);
    const exact=person.tmode==='exact'&&person.lat!=null&&person.lng!=null;
    const anchor=exact?S.ascendant(birth,person.lat,person.lng):natal.Sun;
    house=((Math.floor(S.rev(positions.Moon)/30)-Math.floor(S.rev(anchor)/30)+12)%12)+1;
    method=exact?'birth-time houses':'solar houses (birth time unknown)';
  }
  const reduce=value=>{while(value>9&&value!==11&&value!==22)value=String(value).split('').reduce((sum,digit)=>sum+Number(digit),0);return value;};
  let personalDay=null;
  if(person&&person.dob){const parts=person.dob.split('-').map(Number);personalDay=reduce(reduce(parts[1])+reduce(parts[2])+reduce(day.getFullYear())+reduce(day.getMonth()+1)+reduce(day.getDate()));}
  const numberMeaning={1:'a fresh start',2:'patience with another person',3:'expression',4:'steady work',5:'change',6:'care and belonging',7:'space to reflect',8:'ownership and ambition',9:'completion',11:'intuition',22:'building something lasting'};
  $('tomorrow-date').textContent=label;
  $('tomorrow-for').textContent=person?(('For '+(PX.first||person.name||'you'))+' · '+method):'The shared sky · add your details for a personal reading';
  $('tomorrow-headline').textContent=house?houseHeads[house-1]:'The Moon moves into '+S.sign(positions.Moon)+'.';
  $('tomorrow-summary').textContent=house
    ?'Tomorrow the Moon moves through '+S.sign(positions.Moon)+' and your '+ordinal(house)+' '+(method.startsWith('solar')?'solar house':'house')+'. '+houseLines[house-1]+(personalDay?' Your '+personalDay+' day adds a thread of '+(numberMeaning[personalDay]||'reflection')+'.':'')
    :'The Moon moves through '+S.sign(positions.Moon)+' tomorrow. Add your birth date to see which part of your life this lights up.';
  $('tomorrow-method').textContent='Planet positions use Prophexy’s on-device sky calculation at local noon tomorrow. '+(person?'The house uses '+method+'. ':'')+'The reading is a symbolic interpretation, not a certain account of future events.';
  $('tomorrow-signals').innerHTML='<div><b>THE MOON</b><span>'+escape(S.sign(positions.Moon))+' · '+illum+'% lit</span></div><div><b>YOUR PART OF THE SKY</b><span>'+(house?escape(ordinal(house)+' house · '+method):'Add birth details')+'</span></div><div><b>YOUR NUMBER</b><span>'+(personalDay?escape(personalDay+' · '+(numberMeaning[personalDay]||'reflection')):'Add birth date')+'</span></div>';
  $('tomorrow-planets').innerHTML=current.map(planet=>'<button type="button" data-planet="'+planet.body+'" aria-pressed="'+(planet.body==='Moon')+'">'+planet.body+'</button>').join('');
  let scene=null,selected='Moon',paused=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function show(body){
    const p=current.find(item=>item.body===body);if(!p)return;
    selected=body;
    $('tomorrow-planet-detail').innerHTML='<div class="tomorrow-planet-name"><span>'+escape(body)+'</span><b>'+escape(p.sign)+' · '+p.degree.toFixed(1)+'°</b></div><p>'+escape(body+' moves through '+p.sign+' at local noon tomorrow.')+'</p>';
    root.querySelectorAll('[data-planet]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.planet===body)));
    scene?.select(body);
  }
  $('tomorrow-planets').addEventListener('click',event=>{const button=event.target.closest('[data-planet]');if(button)show(button.dataset.planet);});
  const motion=$('tomorrow-motion');
  if(paused){motion.textContent='Motion paused';motion.disabled=true;motion.setAttribute('aria-pressed','true');}
  motion.addEventListener('click',()=>{paused=!paused;scene?.setPaused(paused);motion.textContent=paused?'Play motion':'Pause motion';motion.setAttribute('aria-pressed',String(paused));});
  show('Moon');
  const observer=new IntersectionObserver(async entries=>{
    const visible=entries[0].isIntersecting;
    if(!visible){scene?.setVisible(false);return;}
    if(scene){scene.setVisible(true);return;}
    try{
      const module=await import('./vision-scene.js');
      scene=module.createTomorrowScene($('tomorrow-canvas'),sky,show);
      scene.setPaused(paused);scene.select(selected);
    }catch{
      $('tomorrow-canvas').hidden=true;$('tomorrow-fallback').hidden=false;motion.hidden=true;
    }
  },{rootMargin:'250px'});
  observer.observe(root);
  function ordinal(value){return value+(value%10===1&&value!==11?'st':value%10===2&&value!==12?'nd':value%10===3&&value!==13?'rd':'th');}
})();
