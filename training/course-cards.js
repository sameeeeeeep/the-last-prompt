export function initCourseCards(track){
 if(!track)return {destroy(){}};
 const cards=[...track.querySelectorAll('[data-course]')];
 const previous=document.querySelector('#course-prev'),next=document.querySelector('#course-next'),range=document.querySelector('#course-range');
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 let frame=0;
 function positions(){const left=track.getBoundingClientRect().left;return cards.map(card=>card.getBoundingClientRect().left-left+track.scrollLeft);}
 function current(){const left=track.scrollLeft;const starts=positions();let index=0;starts.forEach((start,i)=>{if(Math.abs(start-left)<Math.abs(starts[index]-left))index=i;});return index;}
 function update(){
  frame=0;const max=track.scrollWidth-track.clientWidth;
  previous.disabled=track.scrollLeft<=2;next.disabled=track.scrollLeft>=max-2;
  const left=track.getBoundingClientRect().left,right=left+track.clientWidth;
  const visible=cards.map((card,i)=>{const r=card.getBoundingClientRect();return {i,amount:Math.max(0,Math.min(right,r.right)-Math.max(left,r.left))/r.width};}).filter(v=>v.amount>.45);
  if(visible.length){const first=visible[0].i+1,last=visible[visible.length-1].i+1;range.textContent=`${first===last?first:`${first}–${last}`} of ${cards.length}`;}
 }
 function request(){if(!frame)frame=requestAnimationFrame(update);}
 function go(index){const target=Math.max(0,Math.min(cards.length-1,index));track.scrollTo({left:positions()[target],behavior:reduced.matches?'auto':'smooth'});}
 function back(){go(current()-1);}
 function forward(){go(current()+1);}
 function key(event){
  if(event.target!==track)return;
  if(event.key==='ArrowRight'){event.preventDefault();forward();}
  else if(event.key==='ArrowLeft'){event.preventDefault();back();}
  else if(event.key==='Home'){event.preventDefault();go(0);}
  else if(event.key==='End'){event.preventDefault();go(cards.length-1);}
 }
 previous.addEventListener('click',back);next.addEventListener('click',forward);track.addEventListener('scroll',request,{passive:true});track.addEventListener('keydown',key);
 const resize=new ResizeObserver(request);resize.observe(track);
 update();
 return {destroy(){cancelAnimationFrame(frame);resize.disconnect();previous.removeEventListener('click',back);next.removeEventListener('click',forward);track.removeEventListener('scroll',request);track.removeEventListener('keydown',key);}};
}
