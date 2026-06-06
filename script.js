/* ════════════════════════════════════════
   FIREBASE
════════════════════════════════════════ */
const fbCfg = {
  apiKey:"AIzaSyA7SlllDkivi27WF7ikTRjqb4GqRIoYxlI",
  authDomain:"sentinel-vault-fb4b7.firebaseapp.com",
  projectId:"sentinel-vault-fb4b7",
  storageBucket:"sentinel-vault-fb4b7.firebasestorage.app",
  messagingSenderId:"192301825793",
  appId:"1:192301825793:web:734530705f4084608fe500"
};
firebase.initializeApp(fbCfg);
firebase.auth().onAuthStateChanged(u=>{if(u)window.location.href='flow.html'});

function loginAgent(){
  const email=document.getElementById('agentEmail').value;
  const pass=document.getElementById('agentPass').value;
  const btn=document.getElementById('loginBtn');
  const err=document.getElementById('loginErr');
  btn.textContent='◌ AUTHENTICATING...';btn.style.opacity='0.7';err.textContent='';
  firebase.auth().signInWithEmailAndPassword(email,pass).catch(e=>{
    err.textContent='⚠ '+e.message;
    btn.textContent='⚡ INITIATE UPLINK';btn.style.opacity='1';
  });
}
document.addEventListener('keydown',e=>{
  if(e.key==='Enter'&&document.getElementById('modal').classList.contains('active'))loginAgent();
});

/* ════════════════════════════════════════
   SPLASH — STATUS CYCLE + HIDE
════════════════════════════════════════ */
const statuses=[
  'INITIALIZING SECURE UPLINK...',
  'LOADING FIREBASE MODULES...',
  'AUTHENTICATING NODE CLUSTER...',
  'CALIBRATING GPS ARRAY...',
  'DEPLOYING TACTICAL SUITE...',
  'ALL SYSTEMS OPERATIONAL ✓'
];
let sIdx=0;
const spSt=document.getElementById('spStatus');
const sInt=setInterval(()=>{sIdx++;if(sIdx<statuses.length)spSt.textContent=statuses[sIdx]},900);

// Splash particle canvas
(function(){
  const c=document.getElementById('spCanvas');
  const ctx=c.getContext('2d');
  c.width=window.innerWidth;c.height=window.innerHeight;
  const pts=[];
  for(let i=0;i<60;i++) pts.push({
    x:Math.random()*c.width,y:Math.random()*c.height,
    vx:(Math.random()-.5)*.6,vy:(Math.random()-.5)*.6,
    r:Math.random()*1.2+.3,a:Math.random()*.4+.1
  });
  function draw(){
    ctx.clearRect(0,0,c.width,c.height);
    pts.forEach(p=>{
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<0||p.x>c.width)p.vx*=-1;if(p.y<0||p.y>c.height)p.vy*=-1;
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(0,229,255,${p.a})`;ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

window.addEventListener('load',()=>{
  setTimeout(()=>{
    clearInterval(sInt);
    const sp=document.getElementById('splash');
    sp.classList.add('hide');
    setTimeout(()=>{sp.style.display='none'},1300);
  },5100);
});

/* ════════════════════════════════════════
   CURSOR EFFECTS
════════════════════════════════════════ */
const cGlow=document.getElementById('cGlow');
const cDot=document.getElementById('cDot');
const cRing=document.getElementById('cRing');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{
  mx=e.clientX;my=e.clientY;
  cGlow.style.left=mx+'px';cGlow.style.top=my+'px';
  cDot.style.left=mx+'px';cDot.style.top=my+'px';
});
(function animRing(){
  rx+=(mx-rx)*.12;ry+=(my-ry)*.12;
  cRing.style.left=rx+'px';cRing.style.top=ry+'px';
  requestAnimationFrame(animRing);
})();
document.querySelectorAll('button,a,.fcard,.mod-card').forEach(el=>{
  el.addEventListener('mouseenter',()=>{
    cDot.style.width='14px';cDot.style.height='14px';
    cRing.style.width='52px';cRing.style.height='52px';
    cRing.style.borderColor='rgba(0,229,255,0.9)';
  });
  el.addEventListener('mouseleave',()=>{
    cDot.style.width='8px';cDot.style.height='8px';
    cRing.style.width='32px';cRing.style.height='32px';
    cRing.style.borderColor='rgba(0,229,255,0.5)';
  });
});

/* ════════════════════════════════════════
   PARTICLE BACKGROUND
════════════════════════════════════════ */
const bgCanvas=document.getElementById('bgCanvas');
const bctx=bgCanvas.getContext('2d');
function resizeBg(){bgCanvas.width=window.innerWidth;bgCanvas.height=window.innerHeight}
resizeBg();window.addEventListener('resize',resizeBg);
const bpts=[];
const PC=Math.min(90,Math.floor(window.innerWidth/18));
for(let i=0;i<PC;i++) bpts.push({
  x:Math.random()*bgCanvas.width,y:Math.random()*bgCanvas.height,
  vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35,
  r:Math.random()*1.5+.4,a:Math.random()*.45+.08,
  col:Math.random()>.65?'59,130,246':'0,229,255'
});
(function animBg(){
  bctx.clearRect(0,0,bgCanvas.width,bgCanvas.height);
  bpts.forEach(p=>{
    p.x+=p.vx;p.y+=p.vy;
    if(p.x<0||p.x>bgCanvas.width)p.vx*=-1;
    if(p.y<0||p.y>bgCanvas.height)p.vy*=-1;
    bctx.beginPath();bctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    bctx.fillStyle=`rgba(${p.col},${p.a})`;bctx.fill();
  });
  for(let i=0;i<bpts.length;i++){
    for(let j=i+1;j<bpts.length;j++){
      const dx=bpts[i].x-bpts[j].x,dy=bpts[i].y-bpts[j].y;
      const d=Math.sqrt(dx*dx+dy*dy);
      if(d<130){
        bctx.beginPath();bctx.moveTo(bpts[i].x,bpts[i].y);bctx.lineTo(bpts[j].x,bpts[j].y);
        bctx.strokeStyle=`rgba(0,229,255,${0.07*(1-d/130)})`;bctx.lineWidth=.5;bctx.stroke();
      }
    }
  }
  requestAnimationFrame(animBg);
})();

/* ════════════════════════════════════════
   FLASH CARDS — DATA + DRAG + 3D TILT
════════════════════════════════════════ */
const cardData=[
  {icon:'📡',title:'GPS TRACKING',color:'cyan',
   desc:'Sub-10s position updates via Firebase Realtime DB with map visualization, trail history and geofence alerts.',
   status:'LIVE'},
  {icon:'🔒',title:'SECURE VAULT',color:'blue',
   desc:'Firebase Auth with 256-bit TLS encrypted sessions. Role-based access control for every agent.',
   status:'SECURED'},
  {icon:'⚡',title:'REMOTE CONTROL',color:'orange',
   desc:'Trigger SMS, emails, app functions and hardware actions from anywhere via the secure web terminal.',
   status:'ARMED'},
  {icon:'🌩️',title:'WEATHER INTEL',color:'green',
   desc:'Live meteorological data integrated for field operations and environmental threat assessment.',
   status:'MONITORING'},
  {icon:'📨',title:'MSG CONTROL',color:'cyan',
   desc:'SMS payload management, encrypted messaging channels and alert broadcasting to all field agents.',
   status:'ACTIVE'},
  {icon:'🎮',title:'MASTER CTRL',color:'blue',
   desc:'Central command dashboard with full system visibility and one-click remote action execution.',
   status:'STANDBY'},
];
const arena=document.getElementById('cardsArena');
cardData.forEach((d,i)=>{
  const card=document.createElement('div');
  card.className=`fcard fc-${d.color}`;
  card.innerHTML=`
    <div class="fc-icon">${d.icon}</div>
    <div class="fc-title">${d.title}</div>
    <div class="fc-desc">${d.desc}</div>
    <div class="fc-status"><span class="fc-dot"></span>${d.status}</div>
  `;
  card.style.opacity='0';
  card.style.animation=`fadeUp .6s ease ${i*.12+.3}s both`;
  arena.appendChild(card);
  makeInteractive(card);
});

function makeInteractive(card){
  const state={tx:0,ty:0,startX:0,startY:0,dragging:false};
  let prevX=0;

  function upd(twist=0,scale=1){
    card.style.transform=`translate(${state.tx}px,${state.ty}px) rotate(${twist}deg) scale(${scale})`;
  }

  const onMove=e=>{
    const cx=e.touches?e.touches[0].clientX:e.clientX;
    const cy=e.touches?e.touches[0].clientY:e.clientY;
    const vx=cx-prevX;prevX=cx;
    state.tx=cx-state.startX;state.ty=cy-state.startY;
    upd(Math.min(Math.max(vx*3,-20),20),1.06);
    e.preventDefault&&e.preventDefault();
  };
  const onEnd=()=>{
    state.dragging=false;card.classList.remove('dragging');
    card.style.transition='transform .5s cubic-bezier(.34,1.56,.64,1)';
    upd(0,1);setTimeout(()=>card.style.transition='',520);
    document.removeEventListener('mousemove',onMove);
    document.removeEventListener('mouseup',onEnd);
    document.removeEventListener('touchmove',onMove);
    document.removeEventListener('touchend',onEnd);
  };
  card.addEventListener('mousedown',e=>{
    if(e.button!==0)return;
    state.dragging=true;card.classList.add('dragging');
    prevX=e.clientX;
    state.startX=e.clientX-state.tx;state.startY=e.clientY-state.ty;
    card.style.transition='none';
    document.addEventListener('mousemove',onMove);document.addEventListener('mouseup',onEnd);
    e.preventDefault();
  });
  card.addEventListener('touchstart',e=>{
    state.dragging=true;card.classList.add('dragging');
    prevX=e.touches[0].clientX;
    state.startX=e.touches[0].clientX-state.tx;state.startY=e.touches[0].clientY-state.ty;
    card.style.transition='none';
    document.addEventListener('touchmove',onMove,{passive:false});
    document.addEventListener('touchend',onEnd);
  },{passive:false});

  // 3D hover tilt (when not dragging)
  card.addEventListener('mousemove',e=>{
    if(state.dragging)return;
    const r=card.getBoundingClientRect();
    const dx=(e.clientX-(r.left+r.width/2))/(r.width/2);
    const dy=(e.clientY-(r.top+r.height/2))/(r.height/2);
    card.style.transition='none';
    card.style.transform=`translate(${state.tx}px,${state.ty}px) perspective(700px) rotateY(${dx*15}deg) rotateX(${-dy*15}deg) scale(1.04)`;
  });
  card.addEventListener('mouseleave',()=>{
    if(state.dragging)return;
    card.style.transition='transform .5s ease';
    card.style.transform=`translate(${state.tx}px,${state.ty}px)`;
  });
  card.addEventListener('mouseenter',()=>{if(!state.dragging)card.style.transition='none'});
}

/* ════════════════════════════════════════
   TERMINAL ANIMATION
════════════════════════════════════════ */
const termLines=[
  {c:'tp',t:'$ sentinel --uplink --auth'},
  {c:'ts',t:'✓ Firebase node connected'},
  {c:'tp',t:'$ gps.track --live --interval=10'},
  {c:'tt',t:'GPS LOCK: 12.9716°N 77.5946°E'},
  {c:'tw',t:'⚠ Node-A ping: 43ms'},
  {c:'tp',t:'$ sms.broadcast --alert "MOTION"'},
  {c:'ts',t:'✓ SMS dispatched to 3 agents'},
  {c:'tp',t:'$ weather.fetch --location=field'},
  {c:'tt',t:'Bengaluru: 28°C · Humidity 72%'},
  {c:'tp',t:'$ app.control --trigger camera_on'},
  {c:'ts',t:'✓ Camera feed active on Node-B'},
  {c:'tp',t:'$ system.status --all'},
  {c:'ts',t:'✓ ALL NODES OPERATIONAL'},
  {c:'tw',t:'⚠ Node-C battery: 18% — alert sent'},
  {c:'tp',t:'$ dashboard.sync --push'},
  {c:'ts',t:'✓ Dashboard updated successfully'},
];
const tb=document.getElementById('termBody');
let tIdx=0;
function addTermLine(){
  if(tIdx>=termLines.length){tIdx=0;tb.innerHTML=''}
  const l=termLines[tIdx++];
  const el=document.createElement('div');
  el.className='tl';
  el.innerHTML=`<span class="${l.c}">${l.t}</span>`;
  tb.appendChild(el);
  tb.scrollTop=tb.scrollHeight;
  setTimeout(addTermLine,820);
}
setTimeout(addTermLine,800);

/* ════════════════════════════════════════
   NAVBAR SCROLL
════════════════════════════════════════ */
window.addEventListener('scroll',()=>{
  document.getElementById('navbar').classList.toggle('scrolled',window.scrollY>60);
});

/* ════════════════════════════════════════
   MOBILE MENU
════════════════════════════════════════ */
function toggleMenu(){
  const m=document.getElementById('mMenu'),b=document.getElementById('burger');
  m.classList.toggle('open');b.classList.toggle('open');
}
function closeMenu(){
  document.getElementById('mMenu').classList.remove('open');
  document.getElementById('burger').classList.remove('open');
}

/* ════════════════════════════════════════
   MODAL
════════════════════════════════════════ */
function openModal(){
  const m=document.getElementById('modal');
  m.style.display='flex';
  requestAnimationFrame(()=>requestAnimationFrame(()=>m.classList.add('active')));
}
function closeModal(){
  const m=document.getElementById('modal');
  m.classList.remove('active');
  setTimeout(()=>m.style.display='none',500);
}
document.getElementById('modal').addEventListener('click',function(e){if(e.target===this)closeModal()});

/* ════════════════════════════════════════
   SCROLL REVEAL
════════════════════════════════════════ */
const revEls=document.querySelectorAll('.reveal');
const io=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')});
},{threshold:0.12});
revEls.forEach(el=>io.observe(el));

/* ════════════════════════════════════════
   COUNTER ANIMATION
════════════════════════════════════════ */
const statEls=document.querySelectorAll('[data-target]');
const cio=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(!e.isIntersecting)return;
    const el=e.target,target=+el.dataset.target;
    let cur=0;const step=target/55;
    const t=setInterval(()=>{
      cur+=step;if(cur>=target){cur=target;clearInterval(t)}
      el.textContent=Math.floor(cur);
    },36);
    cio.unobserve(el);
  });
},{threshold:0.5});
statEls.forEach(el=>cio.observe(el));
