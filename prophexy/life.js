/* Prophexy — your life, read.
   The people in your life (partner, family, boss, colleagues, friends) + your real chart
   (planets, houses, what is moving through each part of your life, their charts against yours)
   → a deep, area-by-area reading that names them, a set of things I think are true that you
   confirm or correct, and the dated turns coming up. All stored on this device. */
(function(){
  var PX=window.__PX, S=window.PXSky; if(!PX||!S)return;
  function $(i){return document.getElementById(i);}
  function esc(x){return String(x==null?'':x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  var root=$('lifeRoot'); if(!root)return;
  var pid=PX.pid||'_';
  var person=null; try{ var ppl=JSON.parse(localStorage.getItem('prophexy.people'))||[]; person=ppl.find(function(p){return p.id===pid;})||null; }catch(e){}
  if(!person)return;
  var LK='prophexy.life::'+pid, RK='prophexy.lifeRead::'+pid, HK='prophexy.lifeHyp::'+pid;
  function load(k,d){ try{ var v=JSON.parse(localStorage.getItem(k)); return v==null?d:v; }catch(e){ return d; } }
  function save(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} }
  var life=load(LK,null)||{love:'',work:'',workWhat:'',mind:'',people:[],facts:[]};
  life.people=life.people||[]; life.facts=life.facts||[];
  function first(n){ return String(n||'').trim().split(/\s+/)[0]||''; }
  function hashLife(){ var s=JSON.stringify([life.love,life.work,life.workWhat,life.mind,life.people.map(function(p){return [p.name,p.role,p.dob,p.vibe,p.note,p.pr];})]);
    var h=0; for(var i=0;i<s.length;i++){ h=(h*31+s.charCodeAt(i))|0; } return String(h); }
  function hasLife(){ return !!(life.love||life.work||life.mind||life.people.length); }

  /* ============ the chart ============ */
  var now=new Date(), MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var DAYN=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  function fmt(d){ return d.getDate()+' '+MON[d.getMonth()]; }
  var dp=String(person.dob||'1992-10-01').split('-').map(Number);
  var tm=String(person.tob||'12:00').split(':').map(Number), timeKnown=person.tmode==='exact';
  var tz=S.tzGuess(person.lat,person.lng);
  var birth=new Date(Date.UTC(dp[0],dp[1]-1,dp[2],tm[0]||12,tm[1]||0)-tz*3600000);
  var natal=S.positions(birth);
  var ascLon=(timeKnown&&person.lat!=null)?S.ascendant(birth,person.lat,person.lng):natal.Sun;
  var ascIdx=Math.floor(ascLon/30);
  function house(lon){ return ((Math.floor(S.rev(lon)/30)-ascIdx+12)%12)+1; }
  var HOUSE={1:'you and how you come across',2:'money and what you own',3:'siblings, messages and short trips',4:'home, family and your mother',5:'romance, fun and children',6:'daily work, colleagues and health',7:'your partner and one-to-one dealings',8:'shared money, debts and what you keep private',9:'travel, study, belief and your father',10:'career, reputation and the people above you',11:'friends, your circle and your gains',12:'rest, endings and what goes on behind the scenes'};
  var DOM={love:{h:[7,5],label:'Love'},family:{h:[4,3],label:'Family'},work:{h:[10,6],label:'Work'},friends:{h:[11],label:'Friends'},money:{h:[2,8],label:'Money'},you:{h:[1,12],label:'You'}};
  function domOf(h){ for(var k in DOM){ if(DOM[k].h.indexOf(h)>=0)return k; } return null; }
  var ORDER=['love','family','work','friends','money','you'];

  var sky=S.positions(now);
  var MOVERS=['Sun','Mercury','Venus','Mars','Jupiter','Saturn','Rahu','Ketu'];
  var STEP={Sun:1,Mercury:1,Venus:1,Mars:1,Jupiter:4,Saturn:6,Rahu:6,Ketu:6};
  var MAXD={Sun:40,Mercury:120,Venus:180,Mars:260,Jupiter:500,Saturn:1100,Rahu:700,Ketu:700};
  function signIdx(l){ return Math.floor(S.rev(l)/30); }
  function leaves(body){ var s0=signIdx(sky[body]); for(var t=STEP[body];t<=MAXD[body];t+=STEP[body]){
      var d=new Date(now.getTime()+t*86400000); if(signIdx(S.lonOf(body,d))!==s0)return d; } return null; }
  var transits=MOVERS.map(function(b){ var h=house(sky[b]); return {b:b,lon:sky[b],sign:S.sign(sky[b]),h:h,dom:domOf(h),rx:S.retro(b,now)&&b!=='Rahu'&&b!=='Ketu',until:leaves(b)}; });
  var moonH=house(sky.Moon);

  /* the moon through the week — which part of your life each day lands on */
  var week=[]; for(var i=0;i<7;i++){ var d=new Date(now.getTime()+i*86400000); d.setHours(12,0,0,0);
    var mh=house(S.lonOf('Moon',d)); week.push({d:d,h:mh,dom:domOf(mh)}); }

  /* the dated turns ahead: sign changes into a part of your life, retrogrades, new + full moons */
  var events=(function(){
    var out=[], prev=S.positions(now), prevRx={}; ['Mercury','Venus','Mars','Jupiter','Saturn'].forEach(function(b){ prevRx[b]=S.retro(b,now); });
    var prevEl=S.rev(prev.Moon-prev.Sun);
    for(var t=1;t<=90;t++){
      var d=new Date(now.getTime()+t*86400000), p=S.positions(d);
      ['Sun','Mercury','Venus','Mars','Jupiter','Saturn'].forEach(function(b){
        if(signIdx(p[b])!==signIdx(prev[b])){ var h=house(p[b]); out.push({d:d,k:'ingress',b:b,sign:S.sign(p[b]),h:h,dom:domOf(h)}); }
      });
      ['Mercury','Venus','Mars','Jupiter','Saturn'].forEach(function(b){ var rx=S.retro(b,d);
        if(rx!==prevRx[b]){ var h=house(p[b]); out.push({d:d,k:rx?'rx':'direct',b:b,sign:S.sign(p[b]),h:h,dom:domOf(h)}); prevRx[b]=rx; } });
      var el=S.rev(p.Moon-p.Sun);
      if(prevEl>300&&el<60){ var h1=house(p.Moon); out.push({d:d,k:'new',b:'Moon',sign:S.sign(p.Moon),h:h1,dom:domOf(h1)}); }
      if(prevEl<180&&el>=180){ var h2=house(p.Moon); out.push({d:d,k:'full',b:'Moon',sign:S.sign(p.Moon),h:h2,dom:domOf(h2)}); }
      prev=p; prevEl=el;
    }
    return out;
  })();

  /* ============ plain meaning ============ */
  var EFF={
    Sun:{love:['You want to be seen by them','Love takes more of your attention. You want to be noticed by the person you are with, or by someone new.'],family:['Home asks for you','Family and the house pull at your time. A parent or something at home needs you to show up.'],work:['Work puts you on show','People above you notice what you do. Good for being seen, bad for coasting.'],friends:['Your circle lights up','Friends want you around. Plans and invitations come in.'],money:['Money is on your mind','You look hard at what you earn and what you own.'],you:['A stretch about you','Your energy comes back. People notice you and you feel more like yourself.']},
    Mercury:{love:['A lot gets said between you','Messages and talks with a partner or someone you like pick up. Say it plainly and it lands.'],family:['Family talk picks up','Calls with family, news from a sibling, practical plans for home.'],work:['Meetings, emails, paperwork','Work runs on talk and admin. One conversation with a colleague or boss settles something.'],friends:['The group chat gets busy','Friends get in touch, plans get made, someone shares news.'],money:['Money talk and deals','Bills, negotiations and money conversations. Read the small print.'],you:['Your head is busy','Your mind runs fast. Good for deciding, bad for sleep.']},
    Venus:{love:['Love gets easier','Warmth comes back between you and a partner, or someone new shows interest.'],family:['Home feels softer','Family is kinder and easier. A good stretch to host or mend something.'],work:['Easier at work','Colleagues are friendlier and people help. A good window to ask for something.'],friends:['Good time with friends','A friend does something kind, and new people like you fast.'],money:['Money comes easier','Money comes in more easily, and you want to spend it on nice things.'],you:['You look and feel good','You are easier in yourself and people are drawn to you.']},
    Mars:{love:['Heat and friction','More passion and more arguments. Small things set you both off.'],family:['Short fuses at home','Tension with a parent or sibling, or a push to fix or move something at home.'],work:['A push-and-shove at work','You push hard and someone pushes back — a colleague competes or a boss leans on you. You get a lot done.'],friends:['Friction in the group','A friend annoys you or a plan turns into an argument.'],money:['Money goes out fast','Impulse buys, repairs, or a bold money move.'],you:['Energy runs high','You feel driven and impatient. Moving your body helps; rushing hurts.']},
    Jupiter:{love:['Love grows','A relationship deepens or someone who matters arrives. Commitments made now hold.'],family:['Home grows','The family gets closer or bigger — a move, a bigger home, good news in the family.'],work:['Work opens up','A better role, a bigger project, or a senior person who backs you.'],friends:['Your circle opens doors','Friends and contacts help you. Your network pays off.'],money:['Money has room to grow','Income and savings can grow. A good stretch to invest in yourself.'],you:['A lucky, confident stretch','You feel hopeful and people give you the benefit of the doubt.']},
    Saturn:{love:['Love gets serious','The relationship is tested. It commits and gets solid, or you face what isn’t working.'],family:['Weight at home','More duty at home — a parent who needs care, a family responsibility, a house that needs work.'],work:['Pressure at work','More responsibility and tougher people above you. You are being tested; steady work pays later.'],friends:['Fewer, truer friends','You find out who is really there. Some friends drift away.'],money:['Money needs discipline','Money feels tight or slow. Budgets and debts take over.'],you:['A heavy, serious stretch','You feel tired and older, and you get real about what matters.']},
    Rahu:{love:['Hungry for something new','A strong, unusual pull in love — someone unexpected, or restlessness with what you have.'],family:['Unsettled at home','Home feels unsettled — a sudden change, a move, or a family situation that is hard to read.'],work:['Ambition runs hot','Big ambition, sudden changes at work, and one or two people you can’t fully trust.'],friends:['New, unusual people','New people come into your circle. Big but mixed results.'],money:['Big money swings','Money comes fast and goes fast. Careful with quick-win offers.'],you:['Restless to change','You want to reinvent yourself and can’t sit still.']},
    Ketu:{love:['Pulling back from love','You feel detached from a relationship or from dating. Old patterns come back to be finished.'],family:['A little apart from family','You feel less attached to home and family than usual.'],work:['Unsure what work is for','Work feels less meaningful. You question why you do it.'],friends:['Stepping back from people','You want fewer people around. Some friendships fade quietly.'],money:['Loosening your grip on money','Unplanned costs, and caring less about money than usual.'],you:['Looking inward','You care less about image and more about what is real.']}
  };
  var QUIET={love:['Love runs on its own steam','Nothing big is moving in love right now. What you put in is what you get.'],family:['Home is steady','No big pressure at home right now.'],work:['Work is routine','Work runs on routine right now. No big turns.'],friends:['Friends are steady','Your circle is quiet and steady.'],money:['Money is steady','No big swings in money right now.'],you:['You are steady','You are on even ground.']};
  var MOONDAY={1:'Today is about you — your mood shows on your face.',2:'Today money and comfort are on your mind.',3:'Today is busy with messages, a sibling or errands.',4:'Today pulls you home — family comes first.',5:'Today is lighter — romance, fun, kids or play.',6:'Today is a get-things-done day with colleagues and chores.',7:'Today is about one other person — your partner or someone you deal with one-to-one.',8:'Today stirs up deeper feelings, shared money or something private.',9:'Today your mind goes far — travel, study, the bigger picture.',10:'Today work and reputation are in focus — people above you notice you.',11:'Today is about friends and your wider circle.',12:'Today is quiet and inward — rest, sleep, time alone.'};
  var BODYPLAIN={Sun:'the Sun',Moon:'the Moon',Mercury:'Mercury',Venus:'Venus',Mars:'Mars',Jupiter:'Jupiter',Saturn:'Saturn',Rahu:'Rahu (the moon’s north node)',Ketu:'Ketu (the moon’s south node)'};
  var RXPLAIN={Mercury:'old conversations come back, plans slip, messages get crossed',Venus:'an old flame or old feelings come back; hold off on big purchases',Mars:'anger turns inward and pushes stall',Jupiter:'growth slows so you can check it is the right growth',Saturn:'old duties come back to be finished'};
  function durTxt(t){ if(!t.until)return 'for a long while'; var days=Math.round((t.until-now)/86400000);
    return t.until.getFullYear()!==now.getFullYear()?('until '+MON[t.until.getMonth()]+' '+t.until.getFullYear()):('until '+fmt(t.until)); }

  /* ============ the people ============ */
  function red(n){ while(n>9&&n!==11&&n!==22){ n=String(n).split('').reduce(function(a,c){return a+ +c;},0);} return n; }
  var NW={1:'a beginning',2:'patience',3:'expression',4:'foundation',5:'change',6:'care',7:'the inner life',8:'power',9:'completion',11:'insight',22:'building big'};
  var ROLES=[['partner','Partner'],['mother','Mother'],['father','Father'],['sibling','Sibling'],['child','Child'],['relative','Relative'],['boss','Boss'],['colleague','Colleague'],['report','Reports to me'],['client','Client'],['friend','Friend'],['ex','Ex'],['other','Other']];
  function roleLabel(r){ for(var i=0;i<ROLES.length;i++)if(ROLES[i][0]===r)return ROLES[i][1]; return 'Other'; }
  var ROLEDOM={partner:'love',ex:'love',mother:'family',father:'family',sibling:'family',child:'family',relative:'family',boss:'work',colleague:'work',report:'work',client:'work',friend:'friends',other:'friends'};
  var VIBES=[['close','Close'],['good','Good'],['distant','Distant'],['tense','Tense'],['complicated','Complicated'],['new','New']];
  function asp(a,b){ var x=S.sep(a,b); if(x<8)return 'conj'; if(Math.abs(x-180)<8)return 'opp'; if(Math.abs(x-90)<7)return 'sq'; if(Math.abs(x-120)<7)return 'tri'; if(Math.abs(x-60)<5)return 'sex'; return ''; }
  function readPerson(p){
    var o={p:p,first:first(p.name)};
    if(!p.dob)return o;
    var q=p.dob.split('-').map(Number); if(!q[0]||!q[1]||!q[2])return o;
    var pos=S.positions(new Date(Date.UTC(q[0],q[1]-1,q[2],6,30)));
    o.sun=pos.Sun; o.sunSign=S.sign(pos.Sun); o.moonSign=S.sign(pos.Moon);
    o.pd=red(red(q[1])+red(q[2])+red(now.getFullYear())+red(now.getMonth()+1)+red(now.getDate()));
    var N=o.first, T=[];
    if(S.sign(sky.Moon)===o.sunSign)T.push({w:3,t:N+' is more emotional and more present than usual today, and what they say lands harder.',k:'The Moon is in their sign'});
    if(asp(sky.Mars,pos.Sun)==='conj'||asp(sky.Mars,pos.Sun)==='sq'||asp(sky.Mars,pos.Sun)==='opp')T.push({w:3,t:N+' has a shorter fuse right now.',k:'Mars is pressing on their Sun'});
    var sa=asp(sky.Saturn,pos.Sun); if(sa==='conj'||sa==='sq'||sa==='opp')T.push({w:4,t:N+' is going through a heavy, pressured stretch, and carrying more than they show.',k:'Saturn is on their Sun'});
    var ju=asp(sky.Jupiter,pos.Sun); if(ju==='conj'||ju==='tri')T.push({w:2,t:N+' is in a lucky, expanding stretch — more confident and more generous.',k:'Jupiter is backing their Sun'});
    if(S.sign(sky.Venus)===o.sunSign)T.push({w:2,t:N+' is warmer and easier to be around right now.',k:'Venus is in their sign'});
    T.push({w:1,t:'A day of '+(NW[o.pd]||'change')+' for '+N+'.',k:'A '+o.pd+' day on their numbers'});
    T.sort(function(a,b){return b.w-a.w;}); o.today=T;
    /* synastry: their Sun against your chart */
    var SY=[], MY={Sun:'your Sun',Moon:'your Moon',Venus:'your Venus',Mars:'your Mars',Saturn:'your Saturn',Jupiter:'your Jupiter',Mercury:'your Mercury'};
    var SYN={Sun:{conj:'you are alike — easy recognition, some ego clashes',opp:'you pull on each other — attraction and tug-of-war',sq:'you push each other — friction that gets things done',tri:'you get each other easily'},
      Moon:{conj:'they make you feel at home',opp:'you feel them in your gut — close, sometimes smothering',sq:'they unsettle your moods',tri:'they calm you'},
      Venus:{conj:'natural affection between you',opp:'attraction with a pull',sq:'you like each other but want different things',tri:'easy fondness'},
      Mars:{conj:'spark and friction — you fire each other up',opp:'you clash, and it can be charged',sq:'arguments come fast between you',tri:'you work well side by side'},
      Saturn:{conj:'duty and weight — they can make you feel judged, and the bond lasts',opp:'they feel like a test',sq:'they restrict you, or you feel held back by them',tri:'a steady, dependable bond'},
      Jupiter:{conj:'they are good luck for you',tri:'they help you grow',opp:'they promise more than they can give',sq:'they push you to overdo it'},
      Mercury:{conj:'you think alike and talk easily',sq:'you misread each other’s words',opp:'you argue ideas',tri:'easy talk'}};
    Object.keys(MY).forEach(function(k){ var a=asp(pos.Sun,natal[k]); if(a&&SYN[k][a])SY.push({k:k,a:a,t:SYN[k][a]}); });
    o.syn=SY; o.overlay=house(pos.Sun);
    return o;
  }
  var reads=life.people.map(readPerson);

  /* ============ things that are probably true (computed) ============ */
  var HYP={
    Saturn:{1:'You have been more tired and self-critical than usual, and people see you as more serious lately.',2:'Money has felt tight or slow to come in, and you are watching spending more closely than you like.',3:'Something with a sibling or a neighbour feels like an obligation right now.',4:'There is a weight at home — a parent’s health, a family duty, or a house problem you keep carrying.',5:'Romance or fun has felt dry, or something with a child is asking a lot of you.',6:'Your daily work is a grind and your body is keeping score — sleep, back or stomach.',7:'Your closest relationship is being tested: it is either getting more serious or showing its cracks.',8:'There is a debt, a shared-money issue or a private worry you have not told many people about.',9:'A plan to travel, study or move has been delayed, or a father figure is weighing on you.',10:'Someone senior at work is demanding more than usual, and you feel your effort isn’t fully seen yet.',11:'A friendship has cooled or a group you belong to feels like duty rather than fun.',12:'You have been sleeping badly or quietly ending something that no one else knows is ending.'},
    Jupiter:{1:'People have been more drawn to you lately, and you feel more confident than a year ago.',2:'Your income has room to grow this year, and a money opportunity is closer than you think.',3:'A sibling, a short course or a new way of communicating is opening something up for you.',4:'Home is growing — a move, a renovation, or the family getting closer.',5:'Romance, creativity or a child is bringing real joy right now.',6:'Work has more on the plate, but it is good work and your health can improve.',7:'A key relationship or partnership is growing — or someone important is about to arrive.',8:'Money from others — a partner, an investment, a loan or an inheritance — is part of the story this year.',9:'Travel, study or a teacher is pulling you somewhere bigger.',10:'Your career is on the rise — a bigger role or recognition is within reach this year.',11:'Friends and contacts are opening doors for you; one introduction matters.',12:'You are drawn to rest, retreat or something spiritual, and it helps.'},
    Rahu:{1:'You feel restless to change how you look or how you live.',2:'You want more money, fast, and are tempted by a quick-win idea.',3:'You are hungry to be heard — posting, writing, pitching more than before.',4:'Home feels unsettled, or you are thinking about moving.',5:'There is an unusual or secret pull in romance.',6:'Work is chaotic, and there is a rival or a difficult colleague.',7:'Someone unusual — different background, age or culture — is central in your love life or partnerships.',8:'Something hidden is surfacing — secrets, shared money or a sudden change.',9:'You are questioning what you were taught to believe.',10:'You are hungry for a big career jump and willing to take a risk for it.',11:'You are chasing a big goal and meeting new, ambitious people.',12:'You are drawn to far-off places or to spending time alone.'}
  };
  function computedHyps(){
    var out=[]; ['Saturn','Jupiter','Rahu'].forEach(function(b){ var t=transits.filter(function(x){return x.b===b;})[0]; if(t&&HYP[b][t.h])out.push({a:(DOM[t.dom]||{label:'Life'}).label,t:HYP[b][t.h]}); });
    var nh=house(natal.Saturn); if(HYP.Saturn[nh]&&!out.some(function(o){return o.t===HYP.Saturn[nh];}))out.push({a:(DOM[domOf(nh)]||{label:'Life'}).label,t:'All your life, '+HOUSE[nh]+' has been where you work hardest and trust least that it will come easily.'});
    var vs=S.sign(natal.Venus), EL={Aries:'fire',Leo:'fire',Sagittarius:'fire',Taurus:'earth',Virgo:'earth',Capricorn:'earth',Gemini:'air',Libra:'air',Aquarius:'air',Cancer:'water',Scorpio:'water',Pisces:'water'}[vs];
    var VL={fire:'In love you want chemistry and pursuit — when it gets too comfortable you get restless.',earth:'In love you show it through doing and providing, and you need someone reliable more than someone exciting.',air:'In love you need someone you can talk to for hours — without that, attraction fades fast.',water:'In love you feel everything deeply and take hurts to heart longer than you let on.'};
    out.push({a:'Love',t:VL[EL]});
    return out;
  }

  /* ============ context handed to every AI call ============ */
  function chartContext(){
    var L=[];
    L.push('HOUSES: '+(timeKnown?'from the rising sign ('+S.sign(ascLon)+' rising, birth time given)':'solar houses from the Sun sign (birth time unknown)')+'. Whole-sign.');
    L.push('NATAL: '+['Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn','Rahu'].map(function(b){ return b+' '+S.sign(natal[b])+' h'+house(natal[b])+((b==='Moon'&&!timeKnown)?' (approx)':''); }).join('; ')+'.');
    L.push('SKY NOW (through my houses): '+transits.map(function(t){ return t.b+' in '+t.sign+(t.rx?' retrograde':'')+' → my '+ord(t.h)+' ('+HOUSE[t.h]+') '+durTxt(t); }).join('; ')+'. Moon today in my '+moonH+'th ('+HOUSE[moonH]+').');
    L.push('MOON THIS WEEK: '+week.map(function(w){ return DAYN[w.d.getDay()]+' '+fmt(w.d)+' → '+ord(w.h)+' ('+(DOM[w.dom]?DOM[w.dom].label:HOUSE[w.h])+')'; }).join('; ')+'.');
    L.push('COMING UP: '+events.slice(0,14).map(function(e){ return fmt(e.d)+' '+evShort(e); }).join('; ')+'.');
    return L.join('\n');
  }
  function peopleContext(){
    var L=[];
    if(life.love)L.push('LOVE STATUS: '+life.love+'.');
    if(life.work||life.workWhat)L.push('WORK: '+[life.work,life.workWhat].filter(Boolean).join(' — ')+'.');
    if(reads.length)L.push('MY PEOPLE:\n'+reads.map(function(r){ var p=r.p;
      return '- '+p.name+' ('+roleLabel(p.role).toLowerCase()+(p.pr?(', '+p.pr):'')+(p.vibe?', things are '+p.vibe:'')+')'+(p.note?(' — "'+String(p.note).slice(0,160)+'"'):'')+
        (r.sunSign?(' · Sun '+r.sunSign+', Moon likely '+r.moonSign+'; their Sun falls in my '+ord(r.overlay)+' house; '+(r.syn.length?('with me: '+r.syn.map(function(s){return 'their Sun '+s.a+' my '+s.k+' ('+s.t+')';}).join(', ')):'no tight contacts with my chart')+'; today for them: '+r.today.slice(0,2).map(function(x){return x.k;}).join(', ')):' · birthday unknown');
    }).join('\n'));
    if(life.mind)L.push('ON MY MIND LATELY: "'+String(life.mind).slice(0,400)+'"');
    var yes=life.facts.filter(function(f){return f.v==='yes';}), part=life.facts.filter(function(f){return f.v==='partly';}), no=life.facts.filter(function(f){return f.v==='no';});
    if(yes.length)L.push('TRUE ABOUT ME (I confirmed): '+yes.slice(-10).map(function(f){return f.t;}).join(' | '));
    if(part.length)L.push('PARTLY TRUE: '+part.slice(-6).map(function(f){return f.t;}).join(' | '));
    if(no.length)L.push('NOT TRUE (I corrected you — do not repeat): '+no.slice(-8).map(function(f){return f.t;}).join(' | '));
    return L.join('\n');
  }
  /* sysPrompt() calls this, so every reading, answer and card draw knows your life */
  window.__lifeContext=function(){ var p=peopleContext(); return (p?('MY LIFE (what I have told you):\n'+p+'\n'):'')+'MY CHART:\n'+chartContext(); };
  window.__lifeHas=hasLife;
  window.__lifePrompts=function(){ return {areas:areaPrompt(),hyp:hypPrompt()}; };

  function evShort(e){
    if(e.k==='ingress')return e.b+' enters '+e.sign+' (my '+ord(e.h)+')';
    if(e.k==='rx')return e.b+' turns retrograde in '+e.sign+' (my '+ord(e.h)+')';
    if(e.k==='direct')return e.b+' turns direct (my '+ord(e.h)+')';
    if(e.k==='new')return 'new moon in '+e.sign+' (my '+ord(e.h)+')';
    return 'full moon in '+e.sign+' (my '+ord(e.h)+')';
  }
  function evPlain(e){
    var area=e.dom?(DOM[e.dom].label.toLowerCase()):'', hp=HOUSE[e.h];
    if(e.k==='ingress'&&EFF[e.b]&&e.dom)return EFF[e.b][e.dom][1];
    if(e.k==='ingress')return 'The focus moves to '+hp+'.';
    if(e.k==='rx')return 'Things slow down around '+hp+': '+(RXPLAIN[e.b]||'old business comes back')+'.';
    if(e.k==='direct')return 'What stalled around '+hp+' starts moving again.';
    if(e.k==='new')return 'A fresh start around '+hp+' — a good week to begin something there.';
    return 'Something around '+hp+' comes to a head, and feelings run high.';
  }
  function evWhy(e){
    if(e.k==='ingress')return BODYPLAIN[e.b]+' moves into '+e.sign+', your '+ord(e.h)+' house';
    if(e.k==='rx')return BODYPLAIN[e.b]+' turns retrograde in your '+ord(e.h)+' house';
    if(e.k==='direct')return BODYPLAIN[e.b]+' turns direct in your '+ord(e.h)+' house';
    return (e.k==='new'?'New':'Full')+' moon in '+e.sign+', your '+ord(e.h)+' house';
  }
  function ord(n){ return n+(n===1?'st':n===2?'nd':n===3?'rd':'th'); }

  /* ============ computed reading, area by area ============ */
  function computedArea(dk){
    var hs=DOM[dk].h, act=transits.filter(function(t){ return hs.indexOf(t.h)>=0; });
    var W={Saturn:6,Rahu:5,Jupiter:5,Ketu:4,Mars:4,Venus:3,Sun:3,Mercury:2};
    act.sort(function(a,b){ return (W[b.b]||0)-(W[a.b]||0); });
    var top=act[0], e=top?EFF[top.b][dk]:QUIET[dk];
    var ppl=reads.filter(function(r){ return (ROLEDOM[r.p.role]||'friends')===dk; });
    var read=e[1];
    if(act[1])read+=' At the same time, '+EFF[act[1].b][dk][1].charAt(0).toLowerCase()+EFF[act[1].b][dk][1].slice(1);
    if(hs.indexOf(moonH)>=0)read+=' '+MOONDAY[moonH];
    var under=ppl.filter(function(r){return r.today;}).slice(0,2).map(function(r){ return r.today[0].w>=2?r.today[0].t:''; }).filter(Boolean).join(' ');
    var when=(function(){ for(var i=0;i<week.length;i++){ if(hs.indexOf(week[i].h)>=0)return i===0?'Today':(DAYN[week[i].d.getDay()]+', '+fmt(week[i].d)); } return ''; })();
    var why=act.map(function(t){ return BODYPLAIN[t.b]+' in your '+ord(t.h)+' house '+durTxt(t); }).join(' · ');
    return {k:dk,who:ppl.map(function(r){return r.first;}).join(', '),head:e[0],read:read,under:under,when:when,why:why};
  }

  /* ============ AI prompts ============ */
  function areaPrompt(){
    return 'Read my life right now, area by area, like a sharp astrologer who has known me for years. Use everything you know: the people I have named, how things are between us, what is on my mind, what I confirmed or corrected, my chart, what is moving through each house, each person’s own sky today and how their chart hits mine.\n'+
      'Be SPECIFIC to my life, not generic: name my people and say what happens with each of them — who reaches out, what gets said or left unsaid, what shifts, what they are going through right now. Where I have told you nothing about an area, read what the chart says is most likely going on there and state it plainly; I will correct you. Commit: no "may", "might", "could", "perhaps". Predict — say what WILL happen and what IS likely going on underneath. Name real timing: a part of today, or a named day this week from MOON THIS WEEK, or a date from COMING UP.\n'+
      'Use each person’s pronouns exactly as given; where none are given, use their name or they/them — never guess from a name.\n'+
      'Plain everyday words, short sentences, like talking to a friend. No astrology words in HEAD/READ/UNDER/DO (the planets go only in WHY). No emojis, no advice-speak ("you should", "remember to").\n'+
      'Write exactly these six blocks in this order: LOVE, FAMILY, WORK, FRIENDS, MONEY, YOU. Each block:\n'+
      '## LOVE\nWHO: names involved, or —\nHEAD: the headline, at most 8 words\nREAD: 3–4 sentences — what happens in this part of my life today and this week, with names and moments\nUNDER: 1–2 sentences — what is really going on underneath: the unspoken dynamic, what someone wants but isn’t saying, the pattern\nWHEN: the key moment — a time today or a named day/date\nDO: one concrete move\nWHY: the chart behind it in one short line (planet, house, their transits)';
  }
  function hypPrompt(){
    return 'Cold-read my life. From my chart, what is moving through my houses, my people’s charts against mine, and everything I have told you, list 8 specific things that are very probably true in my life RIGHT NOW that I have not told you. Spread them across: my relationship or love life, my family (parents, siblings, home), my work (boss, colleagues, what I am building), my friends, my money, my body and my own head. Each one a concrete, checkable statement a good astrologer would say to my face — about situations and people, not personality clichés (good: "Someone at work who is senior to you takes more credit than they give."; bad: "You are a caring person."). Use my people’s names where it fits, and their pronouns only as given (otherwise name or they/them). Don’t repeat anything I already confirmed, and never repeat what I corrected.\n'+
      'Output ONLY 8 lines, each exactly: AREA | statement — AREA is one of Love, Family, Work, Friends, Money, You. No numbering, no extra text.';
  }

  /* ============ render ============ */
  var AREAKEY={LOVE:'love',FAMILY:'family',WORK:'work',FRIENDS:'friends',MONEY:'money',YOU:'you'};
  function parseAreas(txt){
    var out={}, blocks=String(txt||'').split(/^\s*#{1,3}\s*/m);
    blocks.forEach(function(b){ var m=b.match(/^([A-Z]+)\s*\n([\s\S]*)$/); if(!m)return; var k=AREAKEY[m[1].trim()]; if(!k)return;
      var o={k:k}; m[2].split('\n').forEach(function(line){ var mm=line.match(/^\s*(WHO|HEAD|READ|UNDER|WHEN|DO|WHY)\s*:\s*(.*)$/i);
        if(mm){ o._last=mm[1].toLowerCase(); o[o._last]=mm[2].trim(); } else if(o._last&&line.trim()){ o[o._last]+=' '+line.trim(); } });
      delete o._last; if(o.who==='—'||o.who==='-')o.who=''; if(o.when)o.when=o.when.replace(/\.$/,''); out[k]=o; });
    return out;
  }
  function areaHTML(a,badge){
    return '<article class="larea" data-k="'+a.k+'">'+
      '<div class="lahd"><span class="mono">'+DOM[a.k].label+(a.who?(' &middot; <b>'+esc(a.who)+'</b>'):'')+'</span>'+(badge?'<span class="lbadge mono">'+badge+'</span>':'')+'</div>'+
      '<h3 class="display">'+esc(a.head||'…')+'</h3>'+
      (a.read?'<p class="body">'+esc(a.read)+'</p>':'')+
      (a.under?'<p class="lunder"><span class="mono">Underneath</span>'+esc(a.under)+'</p>':'')+
      ((a.when||a['do'])?'<div class="lmove">'+(a.when?'<span class="lwhen">'+esc(a.when)+'</span>':'')+(a['do']?'<span class="ldo">'+esc(a['do'])+'</span>':'')+'</div>':'')+
      (a.why?'<p class="lwhy mono">'+esc(a.why)+'</p>':'')+
    '</article>';
  }
  function srcLabel(){ var m=PX.mode(); return m==='local'?'On your device':(m==='switchboard'?'Your Claude':'Computed'); }

  function renderAll(){
    var h='';
    h+='<p class="body ltoday">'+esc(MOONDAY[moonH])+'</p>';
    if(!hasLife()){
      h+='<div class="lintro"><h3 class="display">Tell me who is in your life.</h3>'+
        '<p class="body">Your partner, your family, your boss, the people you work with, your friends. Name them and I’ll read them into every day.</p>'+
        '<button class="cbtn go" id="lifeStart" type="button">Tell me about your life</button></div>';
    } else {
      if(reads.length){
        h+='<div class="lsub"><span class="mono">Your people, today</span><button class="llink" id="lifeEdit2" type="button">Edit</button></div><div class="lpeople">'+reads.map(function(r){
          return '<div class="lp"><span class="nm">'+esc(r.p.name)+'</span><span class="mt mono">'+esc(roleLabel(r.p.role))+(r.sunSign?(' &middot; '+r.sunSign):'')+'</span>'+
            '<span class="tx">'+esc(r.today?r.today[0].t:(r.p.vibe?('Things are '+r.p.vibe+' between you.'):'Add their birthday and I’ll read their day too.'))+'</span>'+
            (r.syn&&r.syn.length?'<span class="sy">Between you: '+esc(r.syn[0].t)+'.</span>':'')+
            (r.today?'<span class="lk mono">'+esc(r.today[0].k)+(r.syn&&r.syn.length?(' · their Sun '+({conj:'on',opp:'opposite',sq:'square',tri:'trine',sex:'sextile'}[r.syn[0].a])+' your '+r.syn[0].k):'')+'</span>':'')+'</div>';
        }).join('')+'</div>';
      }
    }
    h+='<div id="lifeAreas" class="lareas"></div>';
    h+='<div class="lsub"><span class="mono">What I think is going on</span></div><p class="secsub lss">Tell me where I’m right. Every answer goes into the next reading.</p><div id="lifeHyp"></div>';
    h+='<div class="lsub"><span class="mono">Coming up in your life</span></div><div id="lifeEvents"></div>';
    h+='<div class="fieldrow"><button class="cbtn" id="lifeEdit" type="button">'+(hasLife()?'Edit who’s in your life':'Tell me about your life')+'</button></div>';
    h+='<div id="lifeEditor" hidden></div>';
    root.innerHTML=h;
    ['lifeStart','lifeEdit','lifeEdit2'].forEach(function(id){ var b=$(id); if(b)b.addEventListener('click',openEditor); });
    renderAreasComputed(); renderEvents(); renderHyps();
  }
  function renderAreasComputed(){
    var box=$('lifeAreas'); if(!box)return;
    var cached=load(RK,null);
    if(cached&&cached.day===PX.tk()&&cached.h===hashLife()&&cached.text){ paintAreas(parseAreas(cached.text),cached.src); return; }
    box.innerHTML=ORDER.map(function(k){ return areaHTML(computedArea(k),'Computed'); }).join('');
  }
  function paintAreas(parsed,src){
    var box=$('lifeAreas'); if(!box)return;
    box.innerHTML=ORDER.map(function(k){ var a=parsed[k]; if(!a||!a.head)return areaHTML(computedArea(k),'Computed'); return areaHTML(a,src||srcLabel()); }).join('');
  }
  function renderEvents(){
    var el=$('lifeEvents'); if(!el)return;
    var pick=events.filter(function(e){ return e.dom||e.k==='rx'; });
    var seen={}; pick=pick.filter(function(e){ var k=e.k+e.b+e.h; if(seen[k])return false; seen[k]=1; return true; }).slice(0,8);
    if(!pick.length){ el.innerHTML='<p class="secsub">No big turns in the next three months — a steady stretch.</p>'; return; }
    el.innerHTML=pick.map(function(e){ return '<div class="lev"><span class="ld mono">'+fmt(e.d)+'</span><span class="lt"><b>'+(e.dom?DOM[e.dom].label+'. ':'')+'</b>'+esc(evPlain(e))+'<span class="lw mono">'+esc(evWhy(e))+'</span></span></div>'; }).join('');
  }
  function hypRow(hh,i){
    var f=life.facts.filter(function(x){return x.t===hh.t;})[0], v=f?f.v:'';
    return '<div class="lhyp" data-i="'+i+'"><span class="la mono">'+esc(hh.a)+'</span><p>'+esc(hh.t)+'</p><div class="lans">'+
      [['yes','Right'],['partly','Partly'],['no','No']].map(function(o){ return '<button type="button" data-v="'+o[0]+'" class="'+(v===o[0]?'on':'')+'">'+o[1]+'</button>'; }).join('')+'</div></div>';
  }
  var hyps=null;
  function renderHyps(){
    var el=$('lifeHyp'); if(!el)return;
    var c=load(HK,null);
    hyps=(c&&c.items&&c.items.length)?c.items:computedHyps();
    el.innerHTML=hyps.map(hypRow).join('');
    el.querySelectorAll('.lhyp button').forEach(function(b){ b.addEventListener('click',function(){
      var row=b.closest('.lhyp'), hh=hyps[+row.dataset.i]; if(!hh)return;
      life.facts=life.facts.filter(function(x){return x.t!==hh.t;});
      life.facts.push({a:hh.a,t:hh.t,v:b.dataset.v,d:PX.tk()}); save(LK,life);
      row.querySelectorAll('button').forEach(function(o){ o.classList.toggle('on',o===b); });
    }); });
  }

  /* ============ AI runs (lazy, cached per day / per change) ============ */
  var running={};
  async function runAreas(){
    if(running.a||!PX.aiReady())return; var c=load(RK,null); if(c&&c.day===PX.tk()&&c.h===hashLife()&&c.text)return;
    running.a=1; var box=$('lifeAreas'); if(!box){ running.a=0; return; }
    box.insertAdjacentHTML('afterbegin','<div class="lload">'+PX.eyeLoader('reading your life…')+'</div>');
    var acc='', src=srcLabel();
    try{
      for await (var d of PX.aiStream({system:PX.sysPrompt(),messages:[{role:'user',content:areaPrompt()}],maxTokens:1700})){
        if(d&&d.text){ acc+=d.text; var pz=parseAreas(acc); if(Object.keys(pz).length)paintAreas(pz,src); } }
      var parsed=parseAreas(acc);
      if(Object.keys(parsed).length>=3){ save(RK,{day:PX.tk(),h:hashLife(),text:acc,src:src}); paintAreas(parsed,src); }
      else renderAreasComputed();
    }catch(e){ renderAreasComputed(); }
    running.a=0;
  }
  function wk(){ var d=new Date(), j=new Date(d.getFullYear(),0,1); return d.getFullYear()+'-'+Math.ceil(((d-j)/86400000+j.getDay()+1)/7); }
  async function runHyps(force){
    if(running.h||!PX.aiReady())return; var c=load(HK,null);
    if(!force&&c&&c.h===hashLife()&&c.w===wk()&&c.items&&c.items.length)return;
    running.h=1; var el=$('lifeHyp'); if(el)el.insertAdjacentHTML('afterbegin','<div class="lload">'+PX.eyeLoader('looking closer…')+'</div>');
    var acc='';
    try{
      for await (var d of PX.aiStream({system:PX.sysPrompt(),messages:[{role:'user',content:hypPrompt()}],maxTokens:700})){ if(d&&d.text)acc+=d.text; }
      var items=acc.split('\n').map(function(l){ var m=l.replace(/^[\s\-*\d.]+/,'').match(/^(Love|Family|Work|Friends|Money|You)\s*[|:—-]\s*(.+)$/i);
        return m?{a:m[1].charAt(0).toUpperCase()+m[1].slice(1).toLowerCase(),t:m[2].trim()}:null; }).filter(Boolean).slice(0,8);
      if(items.length>=3)save(HK,{h:hashLife(),w:wk(),items:items});
    }catch(e){}
    running.h=0; renderHyps(); addMore();
  }
  function addMore(){ var el=$('lifeHyp'); if(!el||!PX.aiReady()||$('lifeMore'))return;
    el.insertAdjacentHTML('beforeend','<div class="fieldrow"><button class="cbtn" id="lifeMore" type="button">Read me closer</button></div>');
    $('lifeMore').addEventListener('click',function(){ runHyps(true); }); }
  function whenVisible(fn){
    var sec=$('s-life'); if(!sec||!('IntersectionObserver' in window)){ fn(); return; }
    var io=new IntersectionObserver(function(es){ if(es.some(function(e){return e.isIntersecting;})){ io.disconnect(); fn(); } },{rootMargin:'300px'}); io.observe(sec);
  }
  function kick(){ runAreas().then(function(){ return runHyps(false); }).then(addMore); }
  /* the source connects after load — wait for it, then read once the section is near */
  (function wait(n){ if(PX.aiReady()){ whenVisible(kick); return; } if(n>40)return; setTimeout(function(){ wait(n+1); },750); })(0);

  /* ============ the editor ============ */
  var LOVES=['Single','Seeing someone','In a relationship','Engaged','Married','It’s complicated','Just ended'];
  var WORKS=['A job','My own business','Freelance','Studying','Between things','Not working'];
  function chipRow(id,opts,cur){ return '<div class="chips lchips" id="'+id+'">'+opts.map(function(o){ return '<button type="button" class="chip'+(o===cur?' on':'')+'" data-v="'+esc(o)+'">'+esc(o)+'</button>'; }).join('')+'</div>'; }
  var PRS=['she/her','he/him','they/them'];
  var draft=null;
  function openEditor(){
    draft=JSON.parse(JSON.stringify(life));
    var ed=$('lifeEditor'); ed.hidden=false; paintEditor(); ed.scrollIntoView({behavior:'smooth',block:'start'});
  }
  function personRow(p,i){
    return '<div class="lprow" data-i="'+i+'"><div class="lprh"><b>'+esc(p.name)+'</b><span class="mono">'+esc(roleLabel(p.role))+(p.vibe?(' &middot; '+esc(p.vibe)):'')+(p.dob?(' &middot; '+esc(p.dob)):'')+'</span><button type="button" class="llink" data-del="'+i+'">Remove</button></div>'+(p.note?'<p>'+esc(p.note)+'</p>':'')+'</div>';
  }
  function paintEditor(){
    var ed=$('lifeEditor');
    ed.innerHTML='<div class="led">'+
      '<div class="lsub"><span class="mono">Love</span></div>'+chipRow('edLove',LOVES,draft.love)+
      '<div class="lsub"><span class="mono">Work</span></div>'+chipRow('edWork',WORKS,draft.work)+
      '<input class="lin" id="edWorkWhat" placeholder="What do you do? e.g. product lead at a startup" value="'+esc(draft.workWhat||'')+'">'+
      '<div class="lsub"><span class="mono">The people in your life</span></div>'+
      '<div id="edPeople">'+draft.people.map(personRow).join('')+'</div>'+
      '<div class="ladd">'+
        '<input class="lin" id="edName" placeholder="Their name" autocomplete="off">'+
        chipRow('edRole',ROLES.map(function(r){return r[1];}),'')+
        '<span class="mono lfl">How is it between you?</span>'+chipRow('edVibe',VIBES.map(function(v){return v[1];}),'')+
        '<span class="mono lfl">They go by</span>'+chipRow('edPr',PRS,'')+
        '<div class="lrow2"><span><span class="mono lfl">Birthday, if you know it</span><input class="lin" id="edDob" type="date"></span></div>'+
        '<input class="lin" id="edNote" placeholder="Anything I should know? e.g. we argue about money; she just got promoted">'+
        '<div class="fieldrow"><button type="button" class="cbtn" id="edAdd">Add this person</button><span class="savednote" id="edAddNote"></span></div>'+
      '</div>'+
      '<div class="lsub"><span class="mono">What’s on your mind lately?</span></div>'+
      '<textarea id="edMind" placeholder="The thing you keep thinking about — a decision, a person, a worry, a hope.">'+esc(draft.mind||'')+'</textarea>'+
      '<div class="fieldrow"><button type="button" class="cbtn go" id="edSave">Read my life</button><button type="button" class="llink" id="edCancel">Cancel</button></div>'+
    '</div>';
    function single(id,cb){ var box=$(id); box.querySelectorAll('.chip').forEach(function(c){ c.addEventListener('click',function(){
      var was=c.classList.contains('on'); box.querySelectorAll('.chip').forEach(function(o){o.classList.remove('on');}); if(!was)c.classList.add('on'); cb&&cb(was?'':c.dataset.v); }); }); }
    single('edLove',function(v){ draft.love=v; }); single('edWork',function(v){ draft.work=v; });
    var role='',vibe='',pr=''; single('edRole',function(v){ role=v; }); single('edVibe',function(v){ vibe=v; }); single('edPr',function(v){ pr=v; });
    ed.querySelectorAll('[data-del]').forEach(function(b){ b.addEventListener('click',function(){ draft.people.splice(+b.dataset.del,1); keepText(); paintEditor(); }); });
    function keepText(){ draft.workWhat=$('edWorkWhat').value.trim(); draft.mind=$('edMind').value.trim(); }
    $('edAdd').addEventListener('click',function(){
      var nm=$('edName').value.trim(); if(!nm){ $('edAddNote').textContent='A name first.'; return; }
      var rk='other'; ROLES.forEach(function(r){ if(r[1]===role)rk=r[0]; });
      var vk=''; VIBES.forEach(function(v){ if(v[1]===vibe)vk=v[0]; });
      draft.people.push({name:nm,role:rk,vibe:vk,pr:pr,dob:$('edDob').value||'',note:$('edNote').value.trim()});
      if(rk==='partner'&&!draft.love)draft.love='In a relationship';
      keepText(); paintEditor(); $('edName').focus();
    });
    $('edCancel').addEventListener('click',function(){ ed.hidden=true; });
    $('edSave').addEventListener('click',function(){
      keepText();
      var pend=$('edName').value.trim(); if(pend){ $('edAdd').click(); }
      life=draft; save(LK,life);
      reads=life.people.map(readPerson);
      renderAll();
      if(PX.aiReady()){ kick(); if(window.__readNow){ try{ localStorage.removeItem('prophexy.daily::'+pid); }catch(e){} window.__readNow(); } }
      var sec=$('s-life'); if(sec)sec.scrollIntoView({behavior:'smooth'});
    });
  }

  renderAll();
})();
