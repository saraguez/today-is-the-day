let KEY='today-is-the-day-v1';const morning=['Tefillah','Chumash','Tehillim','Tanya','10-minute Gratitude'], habits=['10 minute Workout','10 minute Piano','Holy Podcast','10 minute Read','30 minute Walk'];
let state={days:{}}, storageOK=true;
try{state=JSON.parse(localStorage.getItem(KEY))||state}catch(e){storageOK=false}if(!state.days||typeof state.days!=='object')state={days:{}};
if(state.contentVersion!==2){for(const d of Object.values(state.days)){d.previousRoutine={morning:d.morning,care:d.care};d.morning=[];d.care=[]}state.contentVersion=2;}
const $=s=>document.querySelector(s), iso=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
let selected=iso(new Date());const day=k=>state.days[k]||(state.days[k]={morning:[],care:[],todos:[],ink:{}});
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));window.dispatchEvent(new Event('planner-saved'));storageOK=true;$('#saveStatus').textContent='Saved on this device'}catch(e){storageOK=false;$('#saveStatus').textContent='Not saved — export a backup (storage unavailable or full)'}}
function row(text,checked,change,remove){let label=document.createElement('label');label.className='check-row';let input=document.createElement('input');input.type='checkbox';input.checked=!!checked;input.onchange=()=>change(input.checked);let span=document.createElement('span');span.className='task-text';span.textContent=text;label.append(input,span);if(remove){let b=document.createElement('button');b.type='button';b.className='delete';b.textContent='×';b.setAttribute('aria-label','Delete '+text);b.onclick=e=>{e.preventDefault();remove()};label.append(b)}return label}
function lists(){let d=day(selected);d.home ||= [];$('#home').replaceChildren();['Launch Laundry','Defrost Dinner',"Tonight’s Dinner Menu"].forEach((t,i)=>$('#home').append(row(t,d.home[i],v=>{d.home[i]=v;save()})));$('#todoBlanks').replaceChildren();for(let i=d.todos.length;i<18;i++){let r=document.createElement('div');r.className='blank-todo';r.textContent='□';$('#todoBlanks').append(r)}for(const [id,items] of [['morning',morning],['care',habits]]){let box=$('#'+id);box.replaceChildren();items.forEach((text,i)=>box.append(row(text,d[id][i],v=>{d[id][i]=v;save();tracker()})))}$('#todos').replaceChildren();d.todos.forEach((t,i)=>$('#todos').append(row(t.text,t.done,v=>{t.done=v;save()},()=>{d.todos.splice(i,1);save();lists()})))}
function week(){let start=new Date(selected+'T12:00:00');start.setDate(start.getDate()-start.getDay());return Array.from({length:7},(_,i)=>{let d=new Date(start);d.setDate(d.getDate()+i);return iso(d)})}
function tracker(){if(window.render90)window.render90();if(window.renderMenuRating)window.renderMenuRating();if(window.renderWeighIn)window.renderWeighIn();let dates=week(), table=$('#tracker');table.replaceChildren();let tr=document.createElement('tr');['Ritual','S','M','T','W','T','F','S','Total'].forEach((v,i)=>{let th=document.createElement('th');th.textContent=v;if(i>0&&i<8){th.title=dates[i-1];if(dates[i-1]===selected)th.className='today'}tr.append(th)});table.append(tr);const weeklyHabits=[...habits,'10-minute Gratitude'];const completed=(k,i)=>i===habits.length?!!state.days[k]?.morning?.[4]:!!state.days[k]?.care?.[i];weeklyHabits.forEach((h,i)=>{let tr=document.createElement('tr'),name=document.createElement('td');name.textContent=h;tr.append(name);let total=0;dates.forEach(k=>{let td=document.createElement('td'),c=document.createElement('input');c.type='checkbox';c.checked=completed(k,i);if(c.checked)total++;c.setAttribute('aria-label',h+' on '+k);c.onchange=()=>{if(i===habits.length)day(k).morning[4]=c.checked;else day(k).care[i]=c.checked;save();lists();tracker()};td.append(c);if(k===selected)td.className='today';tr.append(td)});let td=document.createElement('td');td.textContent=total+'/7';tr.append(td);table.append(tr)});let counts=dates.map(k=>weeklyHabits.filter((_,i)=>completed(k,i)).length),total=counts.reduce((a,b)=>a+b,0),max=Math.max(...counts);$('#weekLabel').textContent='Week of '+new Date(dates[0]+'T12:00:00').toLocaleDateString(undefined,{month:'long',day:'numeric'})+' · Tap any day to update it.';$('#pattern').textContent=total?`${total} of 42 rituals this week · Most consistent: ${dates.filter((_,i)=>counts[i]===max).map(k=>new Date(k+'T12:00:00').toLocaleDateString(undefined,{weekday:'short'})).join(', ')} (${max}/6).`:'Your weekly pattern starts with one small ritual.'}
const icons=[
'<path d="M4 15v18m7-23v28m26-28v28m7-23v18M11 20h26v8H11M4 20h7m26 0h7M4 28h7m26 0h7"/>',
'<rect x="4" y="8" width="40" height="32" rx="3"/><path d="M12 8v32m8-32v32m8-32v32m8-32v32M16 8v17m8-17v17m8-17v17"/>',
'<path d="M6 31v-9a18 18 0 0 1 36 0v9M10 22V13m28 9v-9"/><rect x="4" y="22" width="8" height="18" rx="3"/><rect x="36" y="22" width="8" height="18" rx="3"/>',
'<path d="M24 12C16 7 8 7 3 10v29c8-3 14-2 21 2 7-4 13-5 21-2V10c-5-3-13-3-21 2v29M8 16l11 2m-11 5 11 2m-11 5 11 2m10-14 11-2m-11 9 11-2m-11 9 11-2"/>',
'<path d="M4 33c7-3 13-10 17-23l7 5 5 8 10 3 2 9C30 42 15 42 4 39zM17 21l7 5m-10 0 7 5M4 35c15 4 27 2 40-4"/>'
];
const originalLists=lists;lists=function(){originalLists();document.querySelectorAll('#care .task-text').forEach((el,i)=>{let icon=document.createElement('span');icon.className='habit-icon';icon.innerHTML='<svg aria-hidden="true" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">'+icons[i]+'</svg>';el.prepend(icon)})};
const pads={};
for(const id of ['schedule','notes','menu']){let canvas=$('#'+id),ctx=canvas.getContext('2d'),p=pads[id]={canvas,ctx,mode:'pen',drawing:false,version:0};let tools=$(`[data-for="${id}"]`);for(const [text,mode] of [['Pen','pen'],['Eraser','eraser'],['Clear','clear']]){let b=document.createElement('button');b.textContent=text;b.type='button';if(mode==='pen')b.className='active';b.onclick=()=>{if(mode==='clear'){if(!confirm('Clear handwriting in this area?'))return;ctx.clearRect(0,0,canvas.width,canvas.height);delete day(selected).ink[id];p.version++;save()}else{p.mode=mode;tools.querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===b))}};tools.append(b)}let note=document.createElement('span');note.textContent='Pencil, touch or mouse · image only';tools.append(note);
const point=e=>{let r=canvas.getBoundingClientRect();return [e.clientX-r.left,e.clientY-r.top]};
canvas.onpointerdown=e=>{if(e.button!==0||p.drawing)return;e.preventDefault();canvas.setPointerCapture(e.pointerId);p.drawing=true;p.pointer=e.pointerId;ctx.globalCompositeOperation=p.mode==='eraser'?'destination-out':'source-over';ctx.strokeStyle='#715347';ctx.fillStyle='#715347';ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=p.mode==='eraser'?20:2.2;let [x,y]=point(e);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+.01,y+.01);ctx.stroke()};canvas.onpointermove=e=>{if(!p.drawing||p.pointer!==e.pointerId)return;for(let ev of e.getCoalescedEvents?.()||[e]){let [x,y]=point(ev);ctx.lineWidth=p.mode==='eraser'?20:(ev.pointerType==='pen'?1+ev.pressure*3:2.2);ctx.lineTo(x,y);ctx.stroke();ctx.beginPath();ctx.moveTo(x,y)}};const finish=e=>{if(!p.drawing||e.pointerId!==p.pointer)return;p.drawing=false;day(selected).ink[id]=canvas.toDataURL('image/png');save()};canvas.onpointerup=finish;canvas.onpointercancel=finish;
new ResizeObserver(()=>loadPad(id)).observe(canvas)}
function loadPad(id){let p=pads[id];if(p.canvas.hidden)return;if(p.drawing)return;let {canvas,ctx}=p,r=canvas.getBoundingClientRect(),ratio=devicePixelRatio||1,version=++p.version;canvas.width=Math.round(r.width*ratio);canvas.height=Math.round(r.height*ratio);ctx.setTransform(ratio,0,0,ratio,0,0);let src=day(selected).ink[id];if(src){let img=new Image();img.onload=()=>{if(version===p.version)ctx.drawImage(img,0,0,r.width,r.height)};img.src=src}}
const trustReflections=[
  {
    "text": "Let your reliance on Hashem be wholehearted; trust includes confidence in His ability to help you.",
    "source": "Chapter 1",
    "url": "https://www.chabad.org/library/article_cdo/aid/5478268/jewish/Chapter-One-The-Definition-of-Trust.htm"
  },
  {
    "text": "Trust can make room for inner quiet, leaving more of your attention available for serving Hashem.",
    "source": "Introduction · Tranquility",
    "url": "https://www.chabad.org/library/article_cdo/aid/5478227/jewish/Introduction-Part-2-Tranquility.htm"
  },
  {
    "text": "Remember that Hashem’s ability to provide is greater than the particular route you can currently imagine.",
    "source": "Introduction · Peace of Mind",
    "url": "https://www.chabad.org/library/article_cdo/aid/5478237/jewish/Introduction-Part-5-Peace-of-Mind-and-Serenity.htm"
  },
  {
    "text": "Let your relationships support your service of Hashem, rather than pull your attention away from it.",
    "source": "Introduction · Independence",
    "url": "https://www.chabad.org/library/article_cdo/aid/5478234/jewish/Introduction-Part-4-Independence.htm"
  },
  {
    "text": "Remember Hashem’s care in peaceful moments too; help is not always visible as a rescue from difficulty.",
    "source": "Chapter 2 · Trustworthiness",
    "url": "https://www.chabad.org/library/article_cdo/aid/5478271/jewish/Chapter-Two-Part-1-The-Seven-Qualities-of-Trustworthiness.htm"
  },
  {
    "text": "Bitachon asks for more than acknowledging Hashem’s power: it asks you to lean on Him with confidence.",
    "source": "Chapter 1",
    "url": "https://www.chabad.org/library/article_cdo/aid/5478268/jewish/Chapter-One-The-Definition-of-Trust.htm"
  },
  {
    "text": "When worry crowds your day, return gently to reliance on Hashem and the responsibilities before you.",
    "source": "Introduction · Tranquility",
    "url": "https://www.chabad.org/library/article_cdo/aid/5478227/jewish/Introduction-Part-2-Tranquility.htm"
  },
  {
    "text": "Let trust soften your worries about provision so that your heart has more room for Divine service.",
    "source": "Introduction · Peace of Mind",
    "url": "https://www.chabad.org/library/article_cdo/aid/5478237/jewish/Introduction-Part-5-Peace-of-Mind-and-Serenity.htm"
  },
  {
    "text": "Seeking approval need not determine your choices; keep your spiritual commitments at the center.",
    "source": "Introduction · Independence",
    "url": "https://www.chabad.org/library/article_cdo/aid/5478234/jewish/Introduction-Part-4-Independence.htm"
  },
  {
    "text": "A day without a crisis can also invite gratitude for Divine protection you may never have noticed.",
    "source": "Chapter 2 · Trustworthiness",
    "url": "https://www.chabad.org/library/article_cdo/aid/5478271/jewish/Chapter-Two-Part-1-The-Seven-Qualities-of-Trustworthiness.htm"
  },
  {
    "text": "Bring your hopes to Hashem with the conviction that His help is possible, rather than merely wishing.",
    "source": "Chapter 1",
    "url": "https://www.chabad.org/library/article_cdo/aid/5478268/jewish/Chapter-One-The-Definition-of-Trust.htm"
  },
  {
    "text": "Think of bitachon as opening yourself to blessing, rather than facing everything through the lens of fear.",
    "source": "Introduction · Tranquility",
    "url": "https://www.chabad.org/library/article_cdo/aid/5478227/jewish/Introduction-Part-2-Tranquility.htm"
  },
  {
    "text": "Bitachon can help you settle into your home with appreciation, rather than constantly searching elsewhere for security.",
    "source": "Introduction · Peace of Mind",
    "url": "https://www.chabad.org/library/article_cdo/aid/5478237/jewish/Introduction-Part-5-Peace-of-Mind-and-Serenity.htm"
  },
  {
    "text": "You can care about people without allowing the desire for their favor to direct your life.",
    "source": "Introduction · Independence",
    "url": "https://www.chabad.org/library/article_cdo/aid/5478234/jewish/Introduction-Part-4-Independence.htm"
  },
  {
    "text": "Hashem’s kindness includes protection before trouble arrives, as well as support when trouble is already here.",
    "source": "Chapter 2 · Trustworthiness",
    "url": "https://www.chabad.org/library/article_cdo/aid/5478271/jewish/Chapter-Two-Part-1-The-Seven-Qualities-of-Trustworthiness.htm"
  },
  {
    "text": "Practice making Hashem your deepest source of support when you think about the outcome you hope for.",
    "source": "Chapter 1",
    "url": "https://www.chabad.org/library/article_cdo/aid/5478268/jewish/Chapter-One-The-Definition-of-Trust.htm"
  },
  {
    "text": "Let reliance on Hashem guide you toward tranquility and give your spiritual life space to breathe.",
    "source": "Introduction · Tranquility",
    "url": "https://www.chabad.org/library/article_cdo/aid/5478227/jewish/Introduction-Part-2-Tranquility.htm"
  },
  {
    "text": "Treat your resources as an opportunity for thoughtful, responsible choices, and use what you have for good.",
    "source": "Introduction · Peace of Mind",
    "url": "https://www.chabad.org/library/article_cdo/aid/5478237/jewish/Introduction-Part-5-Peace-of-Mind-and-Serenity.htm"
  },
  {
    "text": "When social pressure competes with your values, return to the purpose you want your relationships to serve.",
    "source": "Introduction · Independence",
    "url": "https://www.chabad.org/library/article_cdo/aid/5478234/jewish/Introduction-Part-4-Independence.htm"
  },
  {
    "text": "Look beyond dramatic moments of rescue when you reflect on how Hashem cares for you.",
    "source": "Chapter 2 · Trustworthiness",
    "url": "https://www.chabad.org/library/article_cdo/aid/5478271/jewish/Chapter-Two-Part-1-The-Seven-Qualities-of-Trustworthiness.htm"
  },
  {
    "text": "The commentary describes trust as a relationship: wholehearted reliance invites a caring Divine response.",
    "source": "Chapter 1",
    "url": "https://www.chabad.org/library/article_cdo/aid/5478268/jewish/Chapter-One-The-Definition-of-Trust.htm"
  },
  {
    "text": "Place your deepest trust in the Source of blessing, rather than only in the channels it travels through.",
    "source": "Introduction · Tranquility",
    "url": "https://www.chabad.org/library/article_cdo/aid/5478227/jewish/Introduction-Part-2-Tranquility.htm"
  },
  {
    "text": "When one familiar avenue seems closed, remember that Hashem’s care is not restricted to that avenue.",
    "source": "Introduction · Peace of Mind",
    "url": "https://www.chabad.org/library/article_cdo/aid/5478237/jewish/Introduction-Part-5-Peace-of-Mind-and-Serenity.htm"
  },
  {
    "text": "Make space for connections that help you live faithfully, rather than keeping you preoccupied with pleasing others.",
    "source": "Introduction · Independence",
    "url": "https://www.chabad.org/library/article_cdo/aid/5478234/jewish/Introduction-Part-4-Independence.htm"
  },
  {
    "text": "Quiet, ordinary days can be occasions to appreciate care that works without announcing itself.",
    "source": "Chapter 2 · Trustworthiness",
    "url": "https://www.chabad.org/library/article_cdo/aid/5478271/jewish/Chapter-Two-Part-1-The-Seven-Qualities-of-Trustworthiness.htm"
  },
  {
    "text": "Let confidence in Hashem’s help become a daily practice, something you cultivate within your heart.",
    "source": "Chapter 1",
    "url": "https://www.chabad.org/library/article_cdo/aid/5478268/jewish/Chapter-One-The-Definition-of-Trust.htm"
  },
  {
    "text": "You can nurture trust while waiting for good news, instead of spending the waiting time rehearsing worries.",
    "source": "Introduction · Tranquility",
    "url": "https://www.chabad.org/library/article_cdo/aid/5478227/jewish/Introduction-Part-2-Tranquility.htm"
  },
  {
    "text": "Cultivate a quieter heart by remembering that your needs do not depend solely on your own ingenuity.",
    "source": "Introduction · Peace of Mind",
    "url": "https://www.chabad.org/library/article_cdo/aid/5478237/jewish/Introduction-Part-5-Peace-of-Mind-and-Serenity.htm"
  },
  {
    "text": "Look at your relationships through the lens of Divine service: what helps you stay true to your responsibilities?",
    "source": "Introduction · Independence",
    "url": "https://www.chabad.org/library/article_cdo/aid/5478234/jewish/Introduction-Part-4-Independence.htm"
  },
  {
    "text": "When giving thanks, leave room for the hardships you were spared, including those you never knew about.",
    "source": "Chapter 2 · Trustworthiness",
    "url": "https://www.chabad.org/library/article_cdo/aid/5478271/jewish/Chapter-Two-Part-1-The-Seven-Qualities-of-Trustworthiness.htm"
  }
];
function dailyReflection(){let [y,m,d]=selected.split('-').map(Number);let index=((Math.floor(Date.UTC(y,m-1,d)/86400000)%trustReflections.length)+trustReflections.length)%trustReflections.length;let reflection=trustReflections[index];$('#dailyReflection').textContent=reflection.text;$('.daily-trust').href=reflection.url;$('#reflectionSource').textContent=reflection.source}
const writingModes={notes:'handwrite',menu:'handwrite'};
for(const id of ['notes','menu']){
 const canvas=$('#'+id),paper=canvas.parentElement,tools=$(`[data-for="${id}"]`),switcher=document.createElement('div');
 switcher.className='writing-switch';switcher.setAttribute('role','group');switcher.setAttribute('aria-label',id==='notes'?'Notes input mode':'Tonight’s Menu input mode');
 const textarea=document.createElement('textarea');textarea.id=id+'Text';textarea.className='typed-writing';textarea.setAttribute('aria-label',id==='notes'?'Type notes':'Type tonight’s menu');textarea.placeholder=id==='notes'?'Write a note to yourself…':'What’s for dinner?';textarea.hidden=true;
 textarea.oninput=()=>{day(selected).text ||= {};day(selected).text[id]=textarea.value;save()};paper.append(textarea);
 for(const [label,mode] of [['Handwrite','handwrite'],['Type','type']]){const button=document.createElement('button');button.type='button';button.textContent=label;button.dataset.mode=mode;button.onclick=()=>{writingModes[id]=mode;updateWritingModes()};switcher.append(button)}
 paper.before(switcher);
}
function updateWritingModes(){for(const id of ['notes','menu']){const typing=writingModes[id]==='type',canvas=$('#'+id),textarea=$('#'+id+'Text');canvas.hidden=typing;canvas.style.display=typing?'none':'block';textarea.hidden=!typing;textarea.value=day(selected).text?.[id]||'';$(`[data-for="${id}"]`).hidden=typing;canvas.parentElement.previousElementSibling.querySelectorAll('button').forEach(b=>{const active=b.dataset.mode===writingModes[id];b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});if(!typing)loadPad(id)}}
function render(){updateWritingModes();dailyReflection(); $('#date').value=selected;let current=new Date(selected+'T12:00:00');$('#longDate').textContent=current.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'});$('#hebrewDate').textContent=new Intl.DateTimeFormat('he-IL-u-ca-hebrew',{day:'numeric',month:'long',year:'numeric'}).format(current);lists();tracker();Object.keys(pads).forEach(loadPad)}
$('#date').onchange=e=>{if(e.target.value){selected=e.target.value;render()}};for(let [id,n]of [['prev',-1],['next',1]])$('#'+id).onclick=()=>{let d=new Date(selected+'T12:00:00');d.setDate(d.getDate()+n);selected=iso(d);render()};$('#addTodo').onsubmit=e=>{e.preventDefault();let input=e.target.querySelector('input'),text=input.value.trim();if(text){day(selected).todos.push({text,done:false});input.value='';save();lists()}};
$('#export').onclick=()=>{let url=URL.createObjectURL(new Blob([JSON.stringify(state)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='today-is-the-day-backup.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
$('#import').onchange=async e=>{try{let data=JSON.parse(await e.target.files[0].text());if(!data.days||Array.isArray(data.days)||typeof data.days!=='object')throw Error();for(let [k,d]of Object.entries(data.days)){if(!/^\d{4}-\d{2}-\d{2}$/.test(k)||!Array.isArray(d.morning)||!Array.isArray(d.care)||!Array.isArray(d.todos)||!d.ink||typeof d.ink!=='object'||d.todos.some(t=>typeof t.text!=='string')||Object.values(d.ink).some(s=>typeof s!=='string'||!s.startsWith('data:image/png;base64,')))throw Error()}if(confirm('Replace local planner data with this backup?')){state=data;save();render()}}catch(err){alert('This file is not a valid planner backup.')}e.target.value=''};
render();if(!storageOK)$('#saveStatus').textContent='Storage unavailable — use Export backup';if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{$('#installHint').textContent='Offline setup unavailable. Keep this preview open while testing.'});

let lastToday=iso(new Date());
function refreshToday(){let now=iso(new Date());if(now!==lastToday){if(selected===lastToday){selected=now;render()}lastToday=now}}
setInterval(refreshToday,30000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)refreshToday()});

window.Planner={snapshot:()=>JSON.stringify(state),switchAccount(uid){KEY=uid?'today-is-the-day-user-'+uid:'today-is-the-day-v1';try{state=JSON.parse(localStorage.getItem(KEY))||{days:{},contentVersion:2}}catch{state={days:{},contentVersion:2}}render()},replace(payload){const incoming=JSON.parse(payload);if(!incoming.days||typeof incoming.days!=='object')throw Error('Invalid cloud planner');state=incoming;localStorage.setItem(KEY,JSON.stringify(state));render()},guest(){return localStorage.getItem('today-is-the-day-v1')},key:()=>KEY};

window.renderMenuRating=function(){const box=$('#menuRating');if(!box)return;box.replaceChildren();const current=day(selected).menuRating||0;for(let n=1;n<=5;n++){const button=document.createElement('button');button.type='button';button.textContent=n<=current?'★':'☆';button.setAttribute('aria-label',`Rate menu ${n} out of 5 stars`);button.setAttribute('aria-pressed',String(n===current));button.onclick=()=>{day(selected).menuRating=n;save();window.renderMenuRating()};box.append(button)}if(current){const clear=document.createElement('button');clear.type='button';clear.className='clear-rating';clear.textContent='Clear rating';clear.onclick=()=>{delete day(selected).menuRating;save();window.renderMenuRating()};box.append(clear)}};
function showMenuHistory(){const list=$('#menuHistoryList');list.replaceChildren();const entries=Object.entries(state.days).filter(([date,d])=>date<=selected&&(d.text?.menu?.trim()||d.ink?.menu||d.menuRating)).sort(([a],[b])=>b.localeCompare(a));if(!entries.length){const empty=document.createElement('p');empty.textContent='Your collection begins with your first dinner. Type or handwrite a menu, then add a rating.';list.append(empty)}for(const [date,d]of entries){const article=document.createElement('article');article.className='menu-entry';const heading=document.createElement('h3');heading.textContent=new Date(date+'T12:00:00').toLocaleDateString(undefined,{weekday:'short',month:'long',day:'numeric',year:'numeric'});article.append(heading);if(d.text?.menu){const text=document.createElement('p');text.className='menu-entry-text';text.textContent=d.text.menu;article.append(text)}if(d.ink?.menu?.startsWith('data:image/png;base64,')){const img=document.createElement('img');img.src=d.ink.menu;img.alt='Handwritten menu for '+date;article.append(img)}const rating=document.createElement('p');rating.className='history-rating';rating.textContent=d.menuRating?'★'.repeat(d.menuRating)+'☆'.repeat(5-d.menuRating):'Not rated yet';article.append(rating);const open=document.createElement('button');open.textContent='Open this day';open.onclick=()=>{selected=date;render();window.renderMenuRating();$('#menuHistoryDialog').close()};article.append(open);list.append(article)}$('#menuHistoryDialog').showModal()}
$('#menuHistoryOpen').onclick=showMenuHistory;$('#menuHistoryClose').onclick=()=>$('#menuHistoryDialog').close();window.renderMenuRating();


const weighBox=document.createElement('div');weighBox.className='weigh-in';const scaleButton=document.createElement('button');scaleButton.type='button';scaleButton.className='scale-button';scaleButton.setAttribute('aria-label','Open weight history and graph');scaleButton.innerHTML='<svg aria-hidden="true" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="5" width="36" height="38" rx="7"/><path d="M14 19a10 10 0 0 1 20 0v5H14zM24 20l5-6M17 33h14"/></svg>';const weighLabel=document.createElement('label');weighLabel.htmlFor='dailyWeight';weighLabel.textContent='Daily weigh-in';const weightInput=document.createElement('input');weightInput.id='dailyWeight';weightInput.type='number';weightInput.inputMode='decimal';weightInput.min='0.1';weightInput.max='700';weightInput.step='0.1';weightInput.placeholder='Optional';weightInput.setAttribute('aria-label','Daily weight in kilograms');const kg=document.createElement('span');kg.textContent='kg';const weightClear=document.createElement('button');weightClear.type='button';weightClear.textContent='Clear';weightClear.setAttribute('aria-label','Clear daily weight');weighBox.append(scaleButton,weighLabel,weightInput,kg,weightClear);$('#morning').after(weighBox);
window.renderWeighIn=function(){const entry=day(selected).weight;weightInput.value=entry?(entry.unit==='lb'?Math.round(entry.value/2.2046226218*10)/10:entry.value):''};
weightInput.onchange=()=>{if(!weightInput.value){delete day(selected).weight;save();return}if(!weightInput.checkValidity()){weightInput.reportValidity();return}day(selected).weight={value:Number(weightInput.value),unit:'kg'};save()};
weightInput.oninput=()=>{if(weightInput.value&&weightInput.checkValidity()){day(selected).weight={value:Number(weightInput.value),unit:'kg'};save()}};
weightClear.onclick=()=>{delete day(selected).weight;save();window.renderWeighIn()};window.renderWeighIn();
const weightDialog=document.createElement('dialog');weightDialog.id='weightHistoryDialog';weightDialog.innerHTML='<div class="account-heading"><h2>Your Weight History</h2><button id="weightHistoryClose" aria-label="Close weight history">×</button></div><p class="hint">Daily weigh-ins · kilograms</p><p id="weightTrend"></p><div id="weightGraph"></div><div id="weightHistoryList"></div>';document.body.append(weightDialog);$('#weightHistoryClose').onclick=()=>weightDialog.close();
scaleButton.onclick=()=>{const entries=Object.entries(state.days).filter(([date,d])=>date<=selected&&Number.isFinite(d.weight?.value)&&d.weight.value>0).sort(([a],[b])=>a.localeCompare(b)).map(([date,d])=>({date,value:d.weight.unit==='lb'?d.weight.value/2.2046226218:d.weight.value}));const graph=$('#weightGraph'),list=$('#weightHistoryList');graph.replaceChildren();list.replaceChildren();if(!entries.length){$('#weightTrend').textContent='Your graph begins with your first weigh-in.';weightDialog.showModal();return}const first=entries[0],last=entries.at(-1),change=last.value-first.value;$('#weightTrend').textContent=entries.length===1?'One weigh-in saved. Add another day to see a trend.':(Math.abs(change)<.05?'No overall change':(change>0?'Up ':'Down ')+Math.abs(change).toFixed(1)+' kg')+' since '+new Date(first.date+'T12:00:00').toLocaleDateString();const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 500 240');svg.setAttribute('role','img');svg.setAttribute('aria-label','Weight history graph in kilograms; exact entries listed below');const values=entries.map(e=>e.value),min=Math.min(...values)-.5,max=Math.max(...values)+.5,start=Date.parse(first.date+'T12:00:00'),end=Date.parse(last.date+'T12:00:00');const x=e=>55+(end===start?190:((Date.parse(e.date+'T12:00:00')-start)/(end-start))*415),y=e=>190-(e.value-min)/(max-min)*160;for(let n=0;n<4;n++){const value=min+(max-min)*n/3,yy=190-n/3*160,line=document.createElementNS(ns,'line');for(const [k,v]of Object.entries({x1:55,x2:470,y1:yy,y2:yy,stroke:'#dfc8b8'}))line.setAttribute(k,v);svg.append(line);const label=document.createElementNS(ns,'text');label.setAttribute('x','4');label.setAttribute('y',yy+4);label.setAttribute('font-size','12');label.setAttribute('fill','#87553d');label.textContent=value.toFixed(1);svg.append(label)}const path=document.createElementNS(ns,'polyline');path.setAttribute('points',entries.map(e=>x(e)+','+y(e)).join(' '));path.setAttribute('fill','none');path.setAttribute('stroke','#a36d4c');path.setAttribute('stroke-width','2');svg.append(path);for(const e of entries){const dot=document.createElementNS(ns,'circle');dot.setAttribute('cx',x(e));dot.setAttribute('cy',y(e));dot.setAttribute('r','3');dot.setAttribute('fill','#87553d');const title=document.createElementNS(ns,'title');title.textContent=e.date+': '+e.value.toFixed(1)+' kg';dot.append(title);svg.append(dot)}for(const [e,xx,anchor]of [[first,55,'start'],[last,470,'end']]){const label=document.createElementNS(ns,'text');label.setAttribute('x',xx);label.setAttribute('y','220');label.setAttribute('text-anchor',anchor);label.setAttribute('font-size','12');label.setAttribute('fill','#87553d');label.textContent=new Date(e.date+'T12:00:00').toLocaleDateString();svg.append(label)}graph.append(svg);for(const e of [...entries].reverse()){const row=document.createElement('p');row.className='weight-history-row';row.textContent=new Date(e.date+'T12:00:00').toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'})+' · '+e.value.toFixed(1)+' kg';list.append(row)}weightDialog.showModal()};
