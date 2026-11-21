/* pet-timer.js — حيوانك الرفيق مدموج داخل بطاقة مؤقّت التركيز نفسها.
   - أثناء جلسة التركيز: الحيوان يجلس ويقرأ معك.
   - لما تخلص الجلسة: يقوم ويأكل ويشرب ويكبر.
   - يشتغل بدون تعديل study-tools.js: بيقرأ حالة المؤقّت من البطاقة.
   الاستخدام: <script src="pet-timer.js"></script> بعد سطر study-tools.js */
(function () {
  const THREE_URL = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
  let tries = 0;
  function whenReady() {
    const card = document.querySelector('[data-st="timer"]');
    if (card && card.querySelector('.timer')) return load(card);
    if (++tries < 60) setTimeout(whenReady, 250);
  }
  function load(card) {
    if (window.THREE) return init(card);
    const s = document.createElement('script'); s.src = THREE_URL;
    s.onload = () => init(card); document.head.appendChild(s);   // لو ما تحمّلت المكتبة، المؤقّت يضل شغال عادي
  }
  function init(card) {
    const $ = (id) => document.getElementById(id);
    const st = document.createElement('style'); st.textContent = `.pt-wrap{margin-bottom:14px}
.pt-stage{position:relative;height:210px;border-radius:16px;overflow:hidden;border:1px solid var(--line);background:radial-gradient(ellipse at 50% 90%,var(--btn-bg),var(--paper) 75%)}
.pt-stage canvas{width:100%;height:100%;display:block;touch-action:pan-y;cursor:grab}
.pt-full{width:min(420px,86vw);height:280px;background:transparent;border:0}
.pt-bub{position:absolute;top:10px;left:50%;transform:translate(-50%,-6px);background:var(--card-bg);border:1px solid var(--line);color:var(--navy);padding:6px 12px;border-radius:99px;font-size:12px;font-weight:600;opacity:0;transition:.3s;pointer-events:none;white-space:nowrap}
.pt-bub.on{opacity:1;transform:translate(-50%,0)}
.pt-fl{position:absolute;bottom:38%;font-size:22px;pointer-events:none;animation:pt-rise 1.5s ease-out forwards}
@keyframes pt-rise{to{transform:translateY(-90px) scale(1.3);opacity:0}}
.pt-info{display:flex;justify-content:space-between;align-items:center;margin-top:10px;font-size:12px}
.pt-info b{color:var(--navy);font-size:13px}.pt-info span{color:var(--slate);font-family:Manrope,sans-serif;font-weight:700}
.pt-bar{height:6px;border-radius:99px;background:var(--btn-bg);margin:7px 0;overflow:hidden}.pt-bar i{display:block;height:100%;width:0;background:var(--gold);border-radius:99px;transition:width .6s}
.pt-mts{display:flex;align-items:center;gap:8px;font-size:13px}.pt-b2{flex:1;height:6px;border-radius:99px;background:var(--btn-bg);overflow:hidden}.pt-b2 i{display:block;height:100%;width:100%;transition:width .4s;border-radius:99px;background:#e8924a}.pt-b2.w i{background:#4aa3e8}
.pt-pick{display:flex;gap:6px;margin-top:10px}.pt-pick button{flex:1;height:38px;border-radius:10px;border:1.5px solid var(--line);background:var(--card-bg);font-size:20px;line-height:1}.pt-pick button.on{border-color:var(--gold);background:var(--btn-bg)}`; document.head.appendChild(st);
    const wrap = document.createElement('div'); wrap.className = 'pt-wrap'; wrap.innerHTML = `<div class="pt-stage" id="ptStage"><canvas id="ptCv"></canvas><div class="pt-bub" id="ptBub"></div></div>
<div class="pt-info"><b id="ptNm"></b><span id="ptCnt"></span></div>
<div class="pt-bar"><i id="ptBf"></i></div>
<div class="pt-mts"><span>🍗</span><div class="pt-b2"><i id="ptHb"></i></div><span>💧</span><div class="pt-b2 w"><i id="ptWb"></i></div></div>
<div class="pt-pick" id="ptPick"></div>`;
    card.querySelector('.timer').before(wrap);
    const stage = $('ptStage'), cv = $('ptCv'), bub = $('ptBub'), $nm = $('ptNm'), $cnt = $('ptCnt'), $bf = $('ptBf'), $hb = $('ptHb'), $wb = $('ptWb'), $pk = $('ptPick');
    const T = window.THREE;
    let renderer; try { renderer = new T.WebGLRenderer({ canvas: cv, antialias: true, alpha: true, preserveDrawingBuffer: true }); } catch (e) { wrap.remove(); return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));

    /* ---------- state ---------- */
const ST=[{n:'قطتك الصغيرة',min:0,s:.62,h:1.3},{n:'قطتك الشابة',min:3,s:.82,h:1.12},{n:'قطتك الكبيرة',min:8,s:1,h:1}];
const KINDS=['cat','dog','horse','parrot'],EM={cat:'🐱',dog:'🐶',horse:'🐴',parrot:'🦜'};
const NAMES={cat:['قطتك الصغيرة','قطتك الشابة','قطتك الكبيرة'],dog:['جروك الصغير','كلبك الشاب','كلبك الكبير'],horse:['مهرك الصغير','حصانك الشاب','حصانك الكبير'],parrot:['فرخك الصغير','ببغاؤك الشاب','ببغاؤك الكبير']};
const SND={cat:['مرررر','ميااو!','😻'],dog:['هاو هاو!','واف! 🐶','🐾'],horse:['ويهيهي!','🐴','♥'],parrot:['مرحبا!','🎵','صفّر 🎶']};
let kind='cat',sessions=0,hunger=70,thirst=70,store={},pend=0;
function loadPet(k){const o=store[k]||{};sessions=+o.sessions||0;pend=+o.pending||0;hunger=70;thirst=70;if(o.ts){const d=(Date.now()-o.ts)/14400000*100;hunger=Math.max(0,(o.h??70)-d);thirst=Math.max(0,(o.w??70)-d)}}
try{const o=JSON.parse(localStorage.getItem('vet_pet')||'{}');if(o.pets){store=o.pets;if(KINDS.includes(o.kind))kind=o.kind}else if(o.sessions!==undefined)store.cat=o}catch(e){}
loadPet(kind);
const stOf=n=>{let r=0;ST.forEach((s,i)=>{if(n>=s.min)r=i});return r};


    /* ---------- scene ---------- */
    const scene = new T.Scene(), cam = new T.PerspectiveCamera(34, 1, .1, 100);
    scene.add(new T.HemisphereLight(0xffffff, 0x9fb4d6, .95));
    const dl = new T.DirectionalLight(0xffffff, .8); dl.position.set(3, 6, 5); scene.add(dl);
const M=c=>new T.MeshStandardMaterial({color:c,flatShading:true,roughness:.85});
const wh=M(0xffffff),pupM=new T.MeshBasicMaterial({color:0x1a1a1a});
const sph=(r,w=10,h=8)=>new T.SphereGeometry(r,w,h);
const S=(g,m,x=0,y=0,z=0,sx=1,sy=1,sz=1)=>{const o=new T.Mesh(g,m);o.position.set(x,y,z);o.scale.set(sx,sy,sz);return o};
const cat=new T.Group();scene.add(cat);
let rig,body,chest,strp,bl,head,eyes,tail,N,P;
const KC={
 cat:{f:0xe8924a,d:0xc4691f,c:0xf7e3c4,p:0xf0a0a0,e:0x7ed957,paw:0xf7e3c4},
 dog:{f:0xd9a35f,d:0x8f5a2e,c:0xf7e8cf,p:0xff9fb0,e:0x3b2a1f,paw:0xf7e8cf},
 horse:{f:0xa86a3d,d:0x3a2416,c:0xe9cfae,p:0xff9fb0,e:0x2a1b14,paw:0x3a2416},
 parrot:{f:0x5cc46e,d:0x2f9e57,c:0xd6f2a8,p:0xe5484d,e:0xffffff,paw:0xf5a623}};
/* g: feminine word? by/cy/sy/bsy: body y, chest y, stripe y, body squash. L/lw: leg length/width. hy,hz: head spot. f: head while studying. e: head while eating. bz/bk: bowls/book distance. cd/ly: camera */
const PS={
 cat:{g:1,by:1,cy:.95,sy:1.72,bsy:.78,L:1,lw:1,hy:1.95,hz:1.1,f:[1.75,1.2],e:[.95,1.9],bz:2.45,bk:2,cd:1,ly:1.25,
  tail:(m,i,k,t,sp,sit)=>m.position.set(Math.sin(t*sp-i*.6)*.2*k*(1+k),1.25-sit*.2+i*.24,-1.15-Math.sin(k*1.6)*.5-i*.04)},
 dog:{g:0,by:1,cy:.95,sy:0,bsy:.78,L:1,lw:1,hy:1.95,hz:1.1,f:[1.75,1.2],e:[1.05,1.9],bz:2.45,bk:2,cd:1,ly:1.25,
  tail:(m,i,k,t,sp,sit)=>m.position.set(Math.sin(t*sp*1.6-i*.5)*.3*k,1.15-sit*.2+k*.95,-1.15-k*.4)},
 horse:{g:0,by:1.4,cy:1.35,sy:0,bsy:.8,L:1.35,lw:.8,hy:2.45,hz:1.15,f:[2.15,1.4],e:[1.5,2.27],bz:2.9,bk:2.5,cd:1.3,ly:1.5,
  tail:(m,i,k,t,sp,sit)=>m.position.set(Math.sin(t*sp*.8-i*.5)*.25*k,1.75-sit*.2-k*1.1,-1.3-k*.2)},
 parrot:{g:0,by:1.25,cy:1.2,sy:0,bsy:.95,L:.55,lw:.35,hy:2.45,hz:.3,f:[2.1,.5],e:[1.05,1.06],bz:1.6,bk:1.25,cd:1.08,ly:1.3,
  tail:(m,i,k,t,sp,sit)=>m.position.set(Math.sin(t*sp-i*.4)*.08*k,.95-sit*.1-i*.17,-.5-i*.14)}};
function build(k){
  if(rig)cat.remove(rig);
  P=PS[k];const C=KC[k],fur=M(C.f),dark=M(C.d),cream=M(C.c),pink=M(C.p),paw=M(C.paw),eyeM=M(C.e),L=P.L,lw=P.lw;
  rig=new T.Group();cat.add(rig);rig.add(book);rig.add(bowls);book.position.z=P.bk;bowls.position.z=P.bz;
  strp=[];bl=[];tail=[];
  if(k==='parrot'){
    body=S(sph(1,12,9),fur,0,P.by,0,.62,P.bsy,.62);rig.add(body);
    chest=S(sph(.5),cream,0,P.cy,.38,.8,1.5,.5);rig.add(chest);
    [-1,1].forEach(sd=>{const w=S(sph(.4,8,6),dark,sd*.6,1.3,-.1,.3,1.9,.9);w.rotation.z=-sd*.12;rig.add(w);
      const lg=S(new T.CylinderGeometry(.07,.06,.85*L,6),paw,sd*.2,.45*L,.05);rig.add(lg);bl.push(lg);
      rig.add(S(sph(.14,8,6),paw,sd*.2,.07,.15,1,.5,1.5))});
  }else{
    body=S(sph(1,12,9),fur,0,P.by,0,.85,P.bsy,1.25);rig.add(body);
    chest=S(sph(.5),k==='horse'?fur:cream,0,P.cy,1,.8,.95,.5);rig.add(chest);
    if(k==='cat')for(let i=0;i<3;i++){const m=S(sph(.3,8,6),dark,0,P.sy,-.55+i*.5,1.3,.32,.4);rig.add(m);strp.push(m)}
    [[-.45,.7],[.45,.7],[-.45,-.6],[.45,-.6]].forEach(([x,z])=>{
      const lg=S(new T.CylinderGeometry(.2*lw,.17*lw,.85*L,7),fur,x,.45*L,z);rig.add(lg);if(z<0)bl.push(lg);
      rig.add(S(sph(k==='horse'?.18:.22,8,6),paw,x,.12,z+.06,1,.6,1.2));
    });
  }
  head=new T.Group();head.position.set(0,P.hy,P.hz);rig.add(head);
  if(k==='cat'){
    head.add(S(sph(.75,12,9),fur,0,0,0,1,.9,.92));
    head.add(S(sph(.22),cream,0,-.17,.6,1.3,.8,.8));
    head.add(S(sph(.07,6,5),pink,0,-.06,.72));
    [-1,1].forEach(sd=>{
      const ear=S(new T.ConeGeometry(.3,.55,4),fur,sd*.44,.7,0);ear.rotation.z=-sd*.3;head.add(ear);
      const ein=S(new T.ConeGeometry(.18,.38,4),pink,sd*.44,.66,.07);ein.rotation.z=-sd*.3;head.add(ein);
      for(let q=0;q<3;q++){const w=S(new T.CylinderGeometry(.008,.008,.6,4),wh,sd*.5,-.12+(q-1)*.07,.58);w.rotation.z=Math.PI/2+sd*(q-1)*.16;head.add(w)}
    });
  }else if(k==='dog'){
    head.add(S(sph(.75,12,9),fur,0,0,0,1,.9,.92));
    head.add(S(sph(.36,10,8),cream,0,-.22,.62,1,.75,1.25));
    head.add(S(sph(.11,8,6),pupM,0,-.08,1.05,1.2,.9,.9));
    head.add(S(sph(.1,8,6),pink,0,-.4,.95,1,.35,1.3));
    [-1,1].forEach(sd=>{const e=S(sph(.34,8,6),dark,sd*.66,.2,-.05,.4,1,.7);e.rotation.z=sd*.35;head.add(e)});
  }else if(k==='horse'){
    head.add(S(sph(.7,12,9),fur,0,0,0,.95,.95,1));
    head.add(S(sph(.42,10,8),cream,0,-.35,.78,.85,.9,1.35));
    [-1,1].forEach(sd=>{
      head.add(S(sph(.05,6,5),dark,sd*.14,-.35,1.38));
      const e=S(new T.ConeGeometry(.17,.5,5),fur,sd*.3,.78,-.1);e.rotation.z=-sd*.15;head.add(e)});
    head.add(S(sph(.2,6,5),dark,0,.62,.4,.7,1,.8));
    for(let q=0;q<4;q++)head.add(S(sph(.2,6,5),dark,0,.55-q*.18,-.45-q*.1,.6,1,.8));
  }else{
    head.add(S(sph(.62,12,9),fur,0,0,0,1,.95,.95));
    const bk=S(new T.ConeGeometry(.2,.5,8),paw,0,-.12,.7);bk.rotation.x=Math.PI/2;head.add(bk);
    [-1,0,1].forEach(q=>{const c=S(new T.ConeGeometry(.1,.4,5),pink,q*.14,.62,-.05);c.rotation.z=-q*.3;head.add(c)});
  }
  const ep={cat:[.3,.12,.62],dog:[.32,.15,.62],horse:[.4,.12,.55],parrot:[.36,.12,.45]}[k];
  eyes=[-1,1].map(sd=>{const g=new T.Group();g.position.set(sd*ep[0],ep[1],ep[2]);g.add(S(sph(.15,8,6),eyeM,0,0,0,1,1,.5));g.add(S(sph(.07,6,5),pupM,0,0,.08,.6,1.3,1));if(k!=='cat')g.add(S(sph(.035,6,5),wh,.04,.06,.11));head.add(g);return g});
  N={cat:7,dog:5,horse:6,parrot:6}[k];
  for(let i=0;i<N;i++){let m;
    if(k==='parrot')m=S(sph(.17,7,6),i>3?M(0x2f6fd6):dark,0,0,0,.7,1.3,.5);
    else if(k==='horse')m=S(sph(.2-i*.012,7,6),dark);
    else m=S(sph(k==='dog'?.2-i*.02:.21-i*.012,7,6),i===N-1?cream:fur);
    rig.add(m);tail.push(m)}
}
const shT=(()=>{const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),g=x.createRadialGradient(32,32,2,32,32,32);g.addColorStop(0,'rgba(0,0,0,.35)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,64,64);return new T.CanvasTexture(c)})();
const sh=new T.Mesh(new T.PlaneGeometry(4,4),new T.MeshBasicMaterial({map:shT,transparent:true,depthWrite:false}));sh.rotation.x=-Math.PI/2;sh.position.y=.02;scene.add(sh);

const book=new T.Group();book.position.set(0,.05,2.0);
book.add(S(new T.BoxGeometry(1.1,.1,.8),M(0x2b5696)));book.add(S(new T.BoxGeometry(1,.08,.7),wh,0,.07,0));book.visible=false;
const bowls=new T.Group();bowls.position.set(0,0,2.45);
[[-.45,0x8a5a2b],[.45,0x6ec6ff]].forEach(([x,f])=>{const g=new T.Group();g.position.x=x;g.add(S(new T.CylinderGeometry(.38,.3,.22,10),M(0x3b6fb6),0,.11,0));g.add(S(new T.CylinderGeometry(.3,.3,.04,10),M(f),0,.22,0));bowls.add(g)});bowls.visible=false;
build(kind);

    let phase = 'idle', rewardEnd = 0, brStart = 0, sit = 0, bowlS = 0, bookS = 0, nextCry = 0;
    let yaw = .6, drag = false, lx = 0, moved = 0, px = 0, py = 0, t = 0, jy = 0, vy = 0, happy = 0, blink = 0, nb = 2, vis = true;
    let sleepy = !!(store[kind] && store[kind].ts && Date.now() - store[kind].ts > 86400000);
    let cs = ST[stOf(sessions)].s, ch = ST[stOf(sessions)].h, hx = 0, hy = 0;

    function resize() {
      const w = stage.clientWidth, h = stage.clientHeight; if (!w || !h) return;
      renderer.setSize(w, h, false); cam.aspect = w / h;
      cam.position.set(0, 2.5 * P.cd, (w / h < .9 ? 9.4 : 6.9) * P.cd); cam.lookAt(0, P.ly, 0); cam.updateProjectionMatrix();
    }
    new ResizeObserver(resize).observe(stage); resize();
    if ('IntersectionObserver' in window) new IntersectionObserver((e) => { vis = stage.ownerDocument !== document || e[0].isIntersecting; if (vis) resize(); }).observe(stage);

    /* ---------- ui ---------- */
    let bt; function say(m, ms = 1800) { bub.textContent = m; bub.classList.add('on'); clearTimeout(bt); bt = setTimeout(() => bub.classList.remove('on'), ms); }
    function fl(e) { const s = document.createElement('span'); s.className = 'pt-fl'; s.textContent = e; s.style.left = (38 + Math.random() * 24) + '%'; stage.appendChild(s); setTimeout(() => s.remove(), 1600); }
    function jump(h = 7) { if (jy <= 0) vy = h; }
    function wake() { sleepy = false; }
    const save = () => { store[kind] = { sessions, h: hunger, w: thirst, ts: Date.now() }; try { localStorage.setItem('vet_pet', JSON.stringify({ kind, pets: store })); } catch (e) {} };
    function ui() {
      const i = stOf(sessions), s = ST[i], nx = ST[i + 1];
      $nm.textContent = NAMES[kind][i]; $cnt.textContent = sessions + ' جلسة';
      $bf.style.width = (nx ? Math.round((sessions - s.min) / (nx.min - s.min) * 100) : 100) + '%';
    }
    const SAY = { cat: 'ميااو 🐱', dog: 'هاو هاو 🐶', horse: 'ويهيهي 🐴', parrot: 'مرحبا 🦜' };
    function drawPick() { $pk.innerHTML = KINDS.map((k) => '<button data-k="' + k + '" class="' + (k === kind ? 'on' : '') + '" aria-label="' + k + '">' + EM[k] + '</button>').join(''); }
    $pk.onclick = (e) => {
      const b = e.target.closest('[data-k]'); if (!b || b.dataset.k === kind) return;
      if (phase !== 'idle') { say('أنهِ الجلسة أولاً 🙂'); return; }
      save(); kind = b.dataset.k; loadPet(kind); build(kind);
      cs = ST[stOf(sessions)].s; ch = ST[stOf(sessions)].h; sleepy = false; sit = 0; resize(); ui(); drawPick(); save(); say(SAY[kind], 1600);
    };
    ui(); drawPick();

    /* ---------- الربط مع المؤقّت: بنقرأ حالته من البطاقة ---------- */
    const mEl = card.querySelector('[data-t="mode"]'), tEl = card.querySelector('[data-t="toggle"]');
    const rd = () => ({ mode: mEl && mEl.textContent && !mEl.textContent.includes('تركيز') ? 'break' : 'focus', run: !!tEl && tEl.textContent.trim() === 'إيقاف' });
    let prev = rd();
    function focusDone() {
      const before = stOf(sessions); sessions++; ui(); happy = 2; jump(); fl('💗'); fl('✨');
      rewardEnd = Date.now() + 12000; brStart = Date.now(); wake();
      say(stOf(sessions) > before ? 'كبر رفيقك! 🎉' : 'أحسنت! خلصنا الجلسة 🎉', 2400); save();
    }
    /* التكبير الكامل: ننقل الحيوان فوق الساعة الكبيرة */
    const ov = $('focusOverlay');
    if (ov) new MutationObserver(() => {
      if (!ov.hidden) { stage.classList.add('pt-full'); ov.insertBefore(stage, ov.querySelector('.big')); }
      else { stage.classList.remove('pt-full'); wrap.prepend(stage); }
      setTimeout(resize, 50);
    }).observe(ov, { attributes: true, attributeFilter: ['hidden'] });

    /* ---------- input ---------- */
const rc=new T.Raycaster(),nd=new T.Vector2();
cv.addEventListener('pointerdown',e=>{drag=true;lx=e.clientX;moved=0;cv.setPointerCapture(e.pointerId)});
cv.addEventListener('pointermove',e=>{const r=cv.getBoundingClientRect();px=(e.clientX-r.left)/r.width*2-1;py=(e.clientY-r.top)/r.height*2-1;
  if(drag){const dx=e.clientX-lx;yaw+=dx*.01;moved+=Math.abs(dx);lx=e.clientX}});
cv.addEventListener('pointerup',e=>{drag=false;if(moved<6){const r=cv.getBoundingClientRect();nd.set((e.clientX-r.left)/r.width*2-1,-((e.clientY-r.top)/r.height*2-1));rc.setFromCamera(nd,cam);
  if(rc.intersectObject(rig,true).length){if(sleepy){wake();say('أوه! صحيت 😺')}else{happy=1.2;jump(5.5);fl('💗');say(SND[kind][Math.random()*3|0],1400)}}}});
cv.addEventListener('pointerleave',()=>{px=0;py=0});

    /* ---------- loop ---------- */
    let last = performance.now();
    function loop() {
      const now = performance.now(); const dt = Math.max(0, Math.min((now - last) / 1000, .05)); last = now; t += dt;
      const s = rd();
      if (prev.mode === 'focus' && s.mode === 'break' && prev.run) focusDone();
      if (s.mode === 'focus' && s.run && !(prev.run && prev.mode === 'focus')) { wake(); say('أدرس معك 📖', 1600); }
      prev = s;
      const nowMs = Date.now(), reward = nowMs < rewardEnd, el = (nowMs - brStart) / 1000, sub = reward ? (el < 6 ? 'eat' : 'drink') : '';
      phase = reward ? 'break' : (s.mode === 'focus' && s.run ? 'focus' : 'idle');
      const rest = s.mode === 'break' && s.run && !reward;
      const rate = 100 / 14400;
      hunger = sub === 'eat' ? Math.min(100, hunger + dt * 20) : Math.max(0, hunger - dt * rate);
      thirst = sub === 'drink' ? Math.min(100, thirst + dt * 20) : Math.max(0, thirst - dt * rate);
      $hb.style.width = hunger + '%'; $wb.style.width = thirst + '%';
      if (!vis && stage.ownerDocument === document) return;
  sit+=((phase==='focus'?1:0)-sit)*dt*3;bowlS+=((phase==='break'?1:0)-bowlS)*dt*4;bookS+=((phase==='focus'?1:0)-bookS)*dt*4;
  bowls.visible=bowlS>.03;bowls.scale.setScalar(Math.max(.01,bowlS));book.visible=bookS>.03;book.scale.setScalar(Math.max(.01,bookS));
  const hungry=!sleepy&&phase==='idle'&&(hunger<25||thirst<25);
  if(hungry&&nowMs>nextCry){say(hunger<=thirst?(P.g?'جوعانة 🥺':'جوعان 🥺'):(P.g?'عطشانة 💧':'عطشان 💧'),2200);nextCry=nowMs+12000}
  body.position.y=P.by-sit*.2;body.rotation.x=-sit*.2;chest.position.y=P.cy-sit*.16;strp.forEach(m=>m.position.y=P.sy-sit*.2);
  bl.forEach(l=>{const k=1-sit*.55;l.scale.y=k;l.position.y=(.025+.425*k)*P.L});
  const tg=ST[stOf(sessions)];cs+=(tg.s-cs)*dt*3;ch+=(tg.h-ch)*dt*3;rig.scale.setScalar(cs);head.scale.setScalar(ch);
  const br=sleepy?1:2.2;body.scale.y=P.bsy*(1+Math.sin(t*br)*.03);
  if(vy>0||jy>0){vy-=18*dt;jy+=vy*dt;if(jy<=0){jy=0;vy=0}}cat.position.y=jy;
  const sw=sleepy?0:Math.sin(t*.5)*.12;cat.rotation.y=yaw+sw;
  sh.scale.setScalar(cs*(1-jy*.12)+.2);
  let tx=sleepy?0:px*.6,ty=sleepy?.38:py*.3,hp=[0,P.hy-sit*.15,P.hz];
  if(hungry)ty=.3;
  if(phase==='focus'){tx=0;ty=.4;hp=[0,P.f[0],P.f[1]]}
  if(sub==='eat'){tx=0;ty=.85+Math.sin(t*10)*.05;hp=[-.45,P.e[0],P.e[1]]}
  if(sub==='drink'){tx=0;ty=.85+Math.sin(t*8)*.04;hp=[.45,P.e[0],P.e[1]]}
  hy+=(tx-hy)*dt*5;hx+=(ty-hx)*dt*5;head.rotation.y=hy;head.rotation.x=hx;
  head.position.x+=(hp[0]-head.position.x)*dt*5;head.position.y+=(hp[1]-head.position.y)*dt*5;head.position.z+=(hp[2]-head.position.z)*dt*5;
  if(t>nb){blink=.14;nb=t+2.5+Math.random()*3}blink-=dt;const ey=blink>0?.1:(sleepy?.15:(sub==='eat'||sub==='drink')?.25:phase==='focus'?.55:(rest?.45:1));eyes.forEach(e=>e.scale.y=ey);
  if(happy>0)happy-=dt;const sp=happy>0?7:(sleepy?1:2.2);
  tail.forEach((m,i)=>P.tail(m,i,i/(N-1),t,sp,sit));
  if(sleepy&&Math.sin(t*1.2)>.97)fl('💤');
  renderer.render(scene,cam)}
    let tok = 0;
    function kick() {
      const me = ++tok;
      (function f() { if (me !== tok) return; (stage.ownerDocument.defaultView || window).requestAnimationFrame(f); loop(); })();
    }
    window.petKick = kick; window.petResize = resize; window.petTick = loop; kick();
    addEventListener('beforeunload', save);
  }
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', whenReady) : whenReady();
})();
