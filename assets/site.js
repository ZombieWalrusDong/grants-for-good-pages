'use strict';
const menuButton=document.querySelector('.menu-toggle');
const navigation=document.querySelector('#primary-navigation');
if(menuButton&&navigation){
 const closeMenu=()=>{navigation.classList.remove('is-open');menuButton.setAttribute('aria-expanded','false');};
 menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));navigation.classList.toggle('is-open',open);});
 navigation.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu();});
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menuButton.getAttribute('aria-expanded')==='true'){closeMenu();menuButton.focus();}});
}
// Every organization and finding in this product tour is fictional.
const examples=[
 {id:'canopy',name:'Canopy Learning Trust',program:'Outdoor science grants',cycle:'Open round · illustrative',state:'current',ratings:[5,5,4,4,4,null],confidence:'Medium',summary:'A promising route for the collective’s outdoor science program. The published focus and service area align; the project budget and next application deadline still need confirmation.',next:'Check the eligible cost list, confirm the application date, and bring the recommendation to your colleague.'},
 {id:'river',name:'River & Reed Foundation',program:'Community learning fund',cycle:'Current round closed · future lead',state:'future',ratings:[4,5,3,null,3,null],confidence:'Medium',summary:'The program looks relevant even though the current round has closed. Keep this as a future prospect, with a reminder to check for the next published opening. A closed window does not make it a poor fit.',next:'Confirm the next cycle on the funder’s own website. Do not assume last year’s dates will repeat.'},
 {id:'meadow',name:'Meadow Community Fund',program:'Local education support',cycle:'Application route to confirm',state:'discovery',ratings:[4,4,null,null,3,null],confidence:'Low',summary:'The mission and location look promising, but there is not enough evidence about comparable grants or the application route. Unknown factors stay unknown; the score shows only the assessed portion.',next:'Find current applicant guidance and comparable awards before deciding whether deeper research is worth the time.'}
];
const factors=[['Mission & program',25],['Eligibility & geography',25],['Comparable giving',20],['Funding value',15],['Feasibility',10],['Relationships',5]];
function ratingTotal(ratings){let known=0,points=0;ratings.forEach((rating,i)=>{if(rating!==null){known+=factors[i][1];points+=rating/5*factors[i][1];}});return{score:known?Math.round(points/known*100):null,coverage:known};}
function escapeText(value){return String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));}
const tour=document.querySelector('[data-tour]');
if(tour){
 const list=tour.querySelector('[data-tour-list]');
 const detail=tour.querySelector('[data-tour-detail]');
 const buttons=[...tour.querySelectorAll('[data-tour-filter]')];
 let filter='all',selected='canopy';
 function render(){
  const visible=examples.filter(row=>filter==='all'||row.state===filter);
  if(!visible.some(row=>row.id===selected))selected=visible[0].id;
  list.innerHTML=visible.map(row=>`<button type="button" class="tour-match" data-tour-match="${row.id}" aria-pressed="${row.id===selected}"><span><strong>${escapeText(row.name)}</strong><small>${escapeText(row.program)}</small><small>${escapeText(row.cycle)}</small></span><b>${ratingTotal(row.ratings).score}</b></button>`).join('');
  const row=visible.find(item=>item.id===selected),total=ratingTotal(row.ratings);
  detail.innerHTML=`<span class="chip ${row.state==='future'?'future':''}">${escapeText(row.cycle)}</span><h3>${escapeText(row.name)}</h3><p>${escapeText(row.summary)}</p><div class="scoreline"><strong>${total.score}</strong><span>Illustrative fit score<br>${total.coverage}% of criteria assessed · ${row.confidence.toLowerCase()} confidence</span></div>${factors.map(([name],i)=>`<div class="rating"><span>${name}</span><progress max="5" value="${row.ratings[i]??0}" aria-label="${name}: ${row.ratings[i]===null?'unknown':row.ratings[i]+' out of 5'}"></progress><span>${row.ratings[i]===null?'Unknown':row.ratings[i]+' / 5'}</span></div>`).join('')}<div class="note"><strong>Next step</strong><br>${escapeText(row.next)}</div>`;
 }
 buttons.forEach(button=>button.addEventListener('click',()=>{filter=button.dataset.tourFilter;buttons.forEach(item=>item.setAttribute('aria-pressed',String(item===button)));render();}));
 list.addEventListener('click',event=>{const button=event.target.closest('[data-tour-match]');if(button){selected=button.dataset.tourMatch;render();list.querySelector(`[data-tour-match="${selected}"]`).focus();}});
 render();
}
