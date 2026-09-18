const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

const intro = $('#intro');
const setBodyScroll = locked => { document.body.style.overflow = locked ? 'hidden' : ''; };
$('#enterBtn').addEventListener('click', () => {
  intro.classList.add('hidden');
  setBodyScroll(false);
  sessionStorage.setItem('jl-entered', 'yes');
});
if (sessionStorage.getItem('jl-entered') === 'yes') intro.classList.add('hidden');
else setBodyScroll(true);

window.addEventListener('scroll', () => {
  $('#topbar').classList.toggle('scrolled', scrollY > 30);
  const doc = document.documentElement;
  const max = doc.scrollHeight - doc.clientHeight;
  $('#progressBar').style.width = `${Math.max(0, Math.min(100, (scrollY / max) * 100))}%`;
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: .12 });
$$('.reveal').forEach(el => observer.observe(el));

function diffCalendar(start, end){
  if (end < start) return {years:0,months:0,days:0,hours:0,minutes:0,seconds:0};
  let cursor = new Date(start);
  let years = 0, months = 0;
  const addYear = d => { const n = new Date(d); n.setFullYear(n.getFullYear()+1); return n; };
  const addMonth = d => { const n = new Date(d); n.setMonth(n.getMonth()+1); return n; };
  while (addYear(cursor) <= end) { cursor = addYear(cursor); years++; }
  while (addMonth(cursor) <= end) { cursor = addMonth(cursor); months++; }
  let ms = end - cursor;
  const dayMs = 86400000, hourMs = 3600000, minuteMs = 60000;
  const days = Math.floor(ms/dayMs); ms -= days*dayMs;
  const hours = Math.floor(ms/hourMs); ms -= hours*hourMs;
  const minutes = Math.floor(ms/minuteMs); ms -= minutes*minuteMs;
  const seconds = Math.floor(ms/1000);
  return {years,months,days,hours,minutes,seconds};
}
function updateLoveCounter(){
  const start = new Date('2026-06-24T21:00:00-03:00');
  const d = diffCalendar(start, new Date());
  Object.entries(d).forEach(([k,v]) => { const el = document.getElementById(k); if(el) el.textContent = String(v).padStart(2,'0'); });
}
updateLoveCounter(); setInterval(updateLoveCounter,1000);

function nextOccurrence(monthIndex, day){
  const now = new Date(); let y = now.getFullYear();
  let target = new Date(y, monthIndex, day, 0, 0, 0);
  if(target <= now) target = new Date(y+1, monthIndex, day, 0, 0, 0);
  return target;
}
function compactCountdown(target){
  let ms = target - new Date();
  const days = Math.floor(ms/86400000); ms -= days*86400000;
  const hours = Math.floor(ms/3600000); ms -= hours*3600000;
  const min = Math.floor(ms/60000);
  return `${days} dias · ${String(hours).padStart(2,'0')}h · ${String(min).padStart(2,'0')}min`;
}
function updateMiniCounts(){
  $('#birthdayCountdown').textContent = compactCountdown(nextOccurrence(9,13));
  $('#anniversaryCountdown').textContent = compactCountdown(nextOccurrence(5,24));
}
updateMiniCounts(); setInterval(updateMiniCounts,60000);

const lightbox = $('#lightbox');
$$('.photo').forEach(btn => btn.addEventListener('click', () => {
  $('#lightboxImg').src = btn.dataset.src;
  lightbox.classList.add('open');
  setBodyScroll(true);
}));
function closeLightbox(){ lightbox.classList.remove('open'); setBodyScroll(false); }
$('#closeLightbox').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if(e.target === lightbox) closeLightbox(); });

const letterModal = $('#letterModal');
$$('.letter').forEach(letter => letter.addEventListener('click', () => {
  $('#letterTitle').textContent = letter.dataset.title;
  $('#letterMessage').textContent = letter.dataset.message;
  letterModal.classList.add('open');
  setBodyScroll(true);
}));
function closeLetter(){ letterModal.classList.remove('open'); setBodyScroll(false); }
$('#closeLetter').addEventListener('click', closeLetter);
letterModal.addEventListener('click', e => { if(e.target === letterModal) closeLetter(); });

const promiseOverlay = $('#promiseOverlay');
$('#promiseBtn').addEventListener('click', () => { promiseOverlay.classList.add('open'); setBodyScroll(true); });
function closePromise(){ promiseOverlay.classList.remove('open'); setBodyScroll(false); }
$('#closePromise').addEventListener('click', closePromise);
promiseOverlay.addEventListener('click', e => { if(e.target === promiseOverlay) closePromise(); });

const surpriseOverlay = $('#surpriseOverlay');
const finalSurpriseOverlay = $('#finalSurpriseOverlay');
$('#openSurprise').addEventListener('click', () => { surpriseOverlay.classList.add('open'); setBodyScroll(true); });
$('#openFinalSurprise').addEventListener('click', () => { finalSurpriseOverlay.classList.add('open'); setBodyScroll(true); });
function closeSurprise(){ surpriseOverlay.classList.remove('open'); setBodyScroll(false); }
function closeFinalSurprise(){ finalSurpriseOverlay.classList.remove('open'); setBodyScroll(false); }
$('#closeSurprise').addEventListener('click', closeSurprise);
$('#closeFinalSurprise').addEventListener('click', closeFinalSurprise);
surpriseOverlay.addEventListener('click', e => { if(e.target === surpriseOverlay) closeSurprise(); });
finalSurpriseOverlay.addEventListener('click', e => { if(e.target === finalSurpriseOverlay) closeFinalSurprise(); });

$('#musicMini').addEventListener('click', () => $('#musica').scrollIntoView({behavior:'smooth'}));

document.addEventListener('keydown', e => {
  if(e.key === 'Escape'){
    closeLightbox(); closeLetter(); closePromise(); closeSurprise(); closeFinalSurprise();
  }
});

function addAmbientHearts(){
  const holder = $('#ambientHearts');
  const symbols = ['♥','♡','✦'];
  for(let i=0;i<14;i++){
    const el = document.createElement('span');
    el.textContent = symbols[i % symbols.length];
    el.style.left = `${Math.random()*100}%`;
    el.style.animationDuration = `${11 + Math.random()*16}s`;
    el.style.animationDelay = `${-Math.random()*18}s`;
    el.style.fontSize = `${.8 + Math.random()*1.2}rem`;
    holder.appendChild(el);
  }
}
function addAmbientBubbles(){
  const holder = $('#ambientBubbles');
  for(let i=0;i<10;i++){
    const el = document.createElement('span');
    const size = 8 + Math.random()*10;
    el.style.left = `${Math.random()*100}%`;
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.animationDuration = `${12 + Math.random()*16}s`;
    el.style.animationDelay = `${-Math.random()*20}s`;
    holder.appendChild(el);
  }
}
addAmbientHearts();
addAmbientBubbles();

function spawnHeart(x, y){
  const el = document.createElement('span');
  el.className = 'click-heart';
  el.textContent = Math.random() > .4 ? '♥' : '♡';
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  el.style.color = Math.random() > .5 ? '#ff97b2' : '#9fd8ff';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 900);
}

document.addEventListener('click', e => {
  if (e.target.closest('button, a, .photo')) spawnHeart(e.clientX, e.clientY);
});
