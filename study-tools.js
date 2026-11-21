/* study-tools.js — أدوات الدراسة (مؤقّت، إحصائيات، مخطط، غيابات، تقدّم المساق، ملاحظات) */
let pip = null;
const $ = (s, r) => (r || document).querySelector(s) || (!r && pip ? pip.document.querySelector(s) : null);
const qa = (s) => [...document.querySelectorAll(s), ...(pip ? pip.document.querySelectorAll(s) : [])];
const all = (n) => qa(`[data-t="${n}"]`);
const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const ls = {
  get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
};
const uid = () => crypto.randomUUID();
const dkey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const icons = () => window.lucide && window.lucide.createIcons();
const BASE_TITLE = document.title;

/* ---------- CSS ---------- */
const style = document.createElement("style");
style.textContent = `
.tools-grid { transition: max-height 0.4s ease-in-out, opacity 0.4s ease-in-out, margin 0.4s ease-in-out; overflow: hidden; }
.tools-grid.collapsed { max-height: 0; opacity: 0; margin-top: 0; pointer-events: none; }
.tools-grid:not(.collapsed) { max-height: 2000px; opacity: 1; margin-top: 20px; }

.tools-grid>.tool-card{order:4}
.tools-grid>[data-st="timer"]{order:1;grid-column:span 2}
.tools-grid>[data-st="stats"]{order:2}
.tools-grid>[data-st="planner"]{order:3;grid-column:1/-1}
.tools-grid>[data-st="abs"]{order:5;grid-column:span 2}
@media(max-width:850px){.tools-grid>[data-st="timer"],.tools-grid>[data-st="planner"],.tools-grid>[data-st="abs"]{grid-column:1/-1}}
.st-chips{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px}
.st-chip{border:1px solid var(--line);background:var(--card-bg);color:var(--slate);padding:7px 12px;border-radius:999px;font-size:12px;font-weight:600}
.st-chip.on{background:var(--purple);border-color:var(--purple);color:#fff}
.st-row{display:flex;gap:8px;align-items:center;margin-top:10px}
.st-row[hidden]{display:none}
.st-quote{font-size:12px;color:var(--slate);line-height:1.8;margin:12px 0 0;min-height:36px}
.st-bar{height:8px;border-radius:99px;background:var(--btn-bg);overflow:hidden}
.st-bar u{display:block;height:100%;background:var(--purple);border-radius:99px;transition:width .4s}
.st-stat{display:flex;gap:22px;margin-bottom:16px}
.st-stat b{display:block;font:800 26px Manrope,sans-serif;color:var(--purple)}
.st-stat small{font-size:11px;color:var(--text-muted)}
.st-item{display:flex;align-items:center;gap:8px;padding:9px 0;border-bottom:1px solid var(--line);font-size:12px;color:var(--slate)}
.st-item b{color:var(--navy)}
.st-x{margin-inline-start:auto;border:0;background:none;color:var(--text-muted);padding:4px 6px}
.st-x:hover{color:#ef4444}
.st-goal{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--slate);margin-bottom:8px}
.st-goal input{width:56px;padding:6px 8px}
#focusOverlay{position:fixed;inset:0;z-index:300;background:#0b1120;color:#e0e5ed;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:22px;padding:24px;text-align:center}
#focusOverlay[hidden]{display:none}
#focusOverlay .big{font:800 clamp(72px,22vw,220px)/1 Manrope,sans-serif;direction:ltr}
#focusOverlay .st-quote{max-width:560px;color:#949daf;font-size:15px}
.pg-bar{margin-bottom:20px;font-size:12px;color:var(--slate)}
.pg-bar .st-bar{margin-top:8px}
.pg-chk{width:18px;height:18px;accent-color:var(--purple);flex:none}
.pg-mini{height:4px;border-radius:99px;background:var(--btn-bg);overflow:hidden;margin-top:10px}
.pg-mini u{display:block;height:100%;background:var(--gold)}
.pg-note{min-height:110px;resize:vertical}

/* زر إظهار الأدوات */
.toggle-tools-btn { display: inline-flex; align-items: center; gap: 8px; background: var(--btn-bg); border: 1px solid var(--line); padding: 10px 20px; border-radius: 12px; color: var(--purple); font-size: 13px; font-weight: 700; cursor: pointer; transition: 0.3s; margin-bottom: -15px; }
.toggle-tools-btn:hover { background: var(--card-bg); border-color: var(--purple); box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
.toggle-tools-btn svg { transition: transform 0.3s; }
.toggle-tools-btn.open svg { transform: rotate(180deg); }
`;
document.head.appendChild(style);

/* ---------- Stats (streak / weekly goal) ---------- */
const log = () => ls.get("vet_study_log", {});
function addMinutes(m) { const l = log(), k = dkey(); l[k] = (l[k] || 0) + m; ls.set("vet_study_log", l); renderStats(); }
function weekMinutes() {
  const l = log(), n = new Date(), s = new Date(n.getFullYear(), n.getMonth(), n.getDate() - n.getDay());
  let t = 0; for (let i = 0; i < 7; i++) t += l[dkey(new Date(s.getFullYear(), s.getMonth(), s.getDate() + i))] || 0;
  return t;
}
function streak() {
  const l = log(), d = new Date(); if (!l[dkey(d)]) d.setDate(d.getDate() - 1);
  let n = 0; while (l[dkey(d)] > 0) { n++; d.setDate(d.getDate() - 1); } return n;
}
function renderStats() {
  const goal = ls.get("vet_goal", 10), w = weekMinutes();
  $("#stStreak").textContent = streak();
  $("#stToday").textContent = log()[dkey()] || 0;
  $("#stWeek").textContent = (w / 60).toFixed(1);
  $("#stGoalIn").value = goal;
  $("#stGoalBar").style.width = Math.min(100, (w / (goal * 60)) * 100) + "%";
}

/* ---------- Cards ---------- */
const card = (st, ico, title, sub, body) => `
<article class="tool-card" data-st="${st}"><div class="tool-head"><div class="tool-heading">
<span class="tool-ico"><i data-lucide="${ico}" width="20"></i></span><div><strong>${title}</strong><small>${sub}</small></div></div></div>
<div class="tool-card-body">${body}</div></article>`;

const timerCard = card("timer", "timer", "مؤقّت التركيز", "اختر الأسلوب الذي يناسبك", `
<div class="st-chips" id="stPresets">
  <button class="st-chip" data-p="25-5">25 / 5</button>
  <button class="st-chip" data-p="50-10">50 / 10</button>
  <button class="st-chip" data-p="90-20">90 / 20</button>
  <button class="st-chip" data-p="custom">مخصّص</button>
</div>
<div class="st-row" id="stCustom" hidden>
  <input class="field" type="number" min="1" max="180" id="stCF" placeholder="تركيز (دقيقة)">
  <input class="field" type="number" min="1" max="60" id="stCB" placeholder="استراحة (دقيقة)">
  <button class="ghost-btn" data-a="apply">تطبيق</button>
</div>
<div class="timer" style="margin:16px 0">
  <div class="timer-ring" id="stRing"><span class="timer-readout" data-t="time">25:00</span></div>
  <div class="timer-controls">
    <div class="timer-mode" data-t="mode"></div>
    <button class="primary-btn" data-a="toggle"><span data-t="toggle">ابدأ</span></button>
    <button class="ghost-btn" data-a="reset">إعادة ضبط</button>
    <button class="ghost-btn" data-a="expand"><i data-lucide="maximize" width="14"></i>تكبير</button>
    <button class="ghost-btn" data-a="pip" id="stPipBtn"><i data-lucide="picture-in-picture-2" width="14"></i>عائم</button>
  </div>
</div>
<p class="st-quote" data-t="quote"></p>`);

const statsCard = card("stats", "flame", "تحدّي الأسبوع", "التزامك بالأرقام", `
<div class="st-stat">
  <div><b id="stStreak">0</b><small>يوم متواصل </small></div>
  <div><b id="stToday">0</b><small>دقيقة اليوم</small></div>
</div>
<div class="st-goal"><span><b id="stWeek">0</b> ساعة من</span><input class="field" type="number" min="1" max="100" id="stGoalIn"><span>هذا الأسبوع</span></div>
<div class="st-bar"><u id="stGoalBar" style="width:0"></u></div>`);

const plannerCard = card("planner", "calendar-days", "مخطط الأسبوع", "محاضراتك ودراستك بنظرة شاملة", `
<div class="st-chips" id="plTabs"></div>
<div class="st-row"><input class="field" type="time" id="plTime" style="max-width:130px"><input class="field" id="plText" maxlength="80" placeholder="محاضرة، دراسة، موعد…"><button class="primary-btn" data-a="padd">إضافة</button></div>
<div id="plList" style="margin-top:8px"></div>`);

const absCard = card("abs", "user-x", "عدّاد الغياب", "متابعة الحد المسموح للغيابات الأكاديمية", `
<div class="st-row"><input class="field" id="abName" maxlength="40" placeholder="اسم المساق"><input class="field" id="abMax" type="number" min="1" max="60" placeholder="الغيابات المسموحة" style="max-width:150px"><button class="primary-btn" data-a="absadd">إضافة</button></div>
<div id="abList" style="margin-top:8px"></div>`);

const overlay = document.createElement("div");
overlay.id = "focusOverlay"; overlay.hidden = true;
overlay.innerHTML = `
<div class="timer-mode" data-t="mode" style="font-size:16px"></div>
<div class="big" data-t="time">25:00</div>
<p class="st-quote" data-t="quote"></p>
<div style="display:flex;gap:10px">
  <button class="primary-btn" data-a="toggle"><span data-t="toggle">ابدأ</span></button>
  <button class="ghost-btn" data-a="close">إغلاق</button>
</div>`;
document.body.appendChild(overlay);

const grid = $("#mainToolsGrid");
grid.classList.add("collapsed");
grid.insertAdjacentHTML("afterbegin", timerCard + statsCard + plannerCard + absCard);
icons();

/* ---------- Toggle Button Setup ---------- */
const toolsSectionHead = grid.previousElementSibling;
const toggleBtn = document.createElement("button");
toggleBtn.className = "toggle-tools-btn";
toggleBtn.innerHTML = `<span>إظهار أدوات الدراسة</span> <i data-lucide="chevron-down" width="16"></i>`;
toolsSectionHead.appendChild(toggleBtn);
icons();

toggleBtn.addEventListener("click", () => {
  const isOpen = grid.classList.contains("collapsed");
  if (isOpen) {
    grid.classList.remove("collapsed");
    toggleBtn.classList.add("open");
    toggleBtn.querySelector("span").textContent = "إخفاء أدوات الدراسة";
  } else {
    grid.classList.add("collapsed");
    toggleBtn.classList.remove("open");
    toggleBtn.querySelector("span").textContent = "إظهار أدوات الدراسة";
  }
});


/* ---------- Quotes ---------- */
let quotes = [
  "ابدأ الآن، فالتركيز يأتي بعد البداية وليس قبلها.", "كل صفحة تنجزها تقربك خطوة نحو هدفك العظيم.",
  "ليس شرطاً أن تكون مثالياً، بل أن تكون مستمراً.", "تعب اليوم هو وقود لراحة غدٍ مشرق.",
  "الدقائق التي تقضيها في الدراسة الآن ستشكرك عليها في المستقبل.", "حافظ على تركيزك، العالم يمكنه الانتظار قليلاً.",
  "التقدم البسيط كل يوم يتراكم ليصبح إنجازاً ضخماً.", "أنت أقرب للنجاح مما تتخيل، فقط استمر.",
  "العقول العظيمة تُبنى بالصبر والالتزام اليومي.", "لا تنتظر الشغف لتبدأ، ابدأ ليأتيك الشغف.",
  "المسافة بين الحلم والواقع تسمى العمل الجاد.", "كل دقيقة استثمار في عقلك تعود بأرباح مضاعفة.",
  "الأشياء العظيمة تستغرق وقتاً، لا تستعجل النتائج.", "النجاح لا يأتي لمن ينتظره، بل لمن يسعى إليه.",
  "تركيزك الحالي يحدد مستقبلك القادم.", "لا تقاس المسافة بالأميال، بل بالعزيمة.",
  "العثرات هي جزء من رحلة التعلم، لا تتوقف عندها.", "الطريق طويل، لكن الخطوة الواحدة تلو الأخرى تصنع الفارق.",
  "تعلم شيئاً جديداً اليوم، ليكون غدك أفضل.", "أنت تبني مستقبلك الآن، اجعله أساساً متيناً.",
  "لا تقارن بدايتك بموسم حصاد الآخرين.", "الصعوبات التي تواجهها اليوم هي قوتك غداً.",
  "العقل كالعضلة، كلما دربته أكثر زادت قوته.", "اجعل من كل تحدٍ فرصة للنمو والتطور.",
  "الاستمرارية هي السر الذي يفصل بين النجاح والفشل.", "لا تدع المشتتات تسرق منك وقتك الثمين.",
  "انغمس في التعلم، ودع النتائج تتحدث عن نفسها.", "كل لحظة تركيز تبني جسراً نحو أحلامك.",
  "النجاح الأكاديمي ليس صدفة، بل خطة وعمل مستمر.", "كن فخوراً بكل محاولة تبذلها، مهما كانت النتيجة."
];
const setQuote = () => { const q = quotes[Math.floor(Math.random() * quotes.length)]; all("quote").forEach((e) => (e.textContent = "“" + q + "”")); };

/* ---------- Timer ---------- */
const cfg = ls.get("vet_timer_cfg", { preset: "25-5", focus: 25, brk: 5 });
const T = { focus: cfg.focus, brk: cfg.brk, preset: cfg.preset, mode: "focus", running: false, left: cfg.focus * 60, endAt: 0, tick: null };
let wl = null;
const lock = async () => { try { wl = await navigator.wakeLock?.request("screen"); } catch {} };
const unlock = () => { try { wl?.release(); } catch {} wl = null; };

function paint() {
  const m = String(Math.floor(T.left / 60)).padStart(2, "0"), s = String(T.left % 60).padStart(2, "0");
  const total = (T.mode === "focus" ? T.focus : T.brk) * 60;
  all("time").forEach((e) => (e.textContent = `${m}:${s}`));
  all("mode").forEach((e) => (e.textContent = T.mode === "focus" ? `جلسة تركيز · ${T.focus} د` : `استراحة · ${T.brk} د`));
  all("toggle").forEach((e) => (e.textContent = T.running ? "إيقاف" : "ابدأ"));
  $("#stRing").style.setProperty("--p", Math.round(((total - T.left) / total) * 100));
  document.title = T.running ? `⏱ ${m}:${s} · ${BASE_TITLE}` : BASE_TITLE;
  qa("#stPresets .st-chip").forEach((b) => b.classList.toggle("on", b.dataset.p === T.preset));
  $("#stCustom").hidden = T.preset !== "custom";
  if (inV()) drawV();
}

function beep() {
  try {
    const c = new (window.AudioContext || window.webkitAudioContext)();
    [0, 0.25, 0.5].forEach((t) => { const o = c.createOscillator(), g = c.createGain(); o.frequency.value = 880; g.gain.value = 0.15; o.connect(g); g.connect(c.destination); o.start(c.currentTime + t); o.stop(c.currentTime + t + 0.15); });
  } catch {}
  navigator.vibrate?.([200, 100, 200]);
}
function sync() {
  if (!T.running) return;
  T.left = Math.max(0, Math.round((T.endAt - Date.now()) / 1000));
  if (T.left === 0) return finish();
  paint();
}
function start() {
  T.endAt = Date.now() + T.left * 1000; T.running = true;
  clearInterval(T.tick); T.tick = setInterval(sync, 500);
  lock(); paint();
}
function pause() {
  sync(); clearInterval(T.tick); T.running = false;
  if (overlay.hidden) unlock(); paint();
}
function finish() {
  clearInterval(T.tick); T.running = false;
  if (T.mode === "focus") { addMinutes(T.focus); window.feedPet?.(); }

  beep(); window.UI?.toast?.(T.mode === "focus" ? "خلّصت جلسة التركيز 🎉 خذ استراحة" : "انتهت الاستراحة، يلا نكمل");
  T.mode = T.mode === "focus" ? "break" : "focus";
  T.left = (T.mode === "focus" ? T.focus : T.brk) * 60;
  if (overlay.hidden) unlock();
  setQuote(); paint();
}
function reset() {
  clearInterval(T.tick); T.running = false; T.mode = "focus"; T.left = T.focus * 60;
  if (overlay.hidden) unlock(); paint();
}
function setDur(f, b, preset) {
  T.focus = f; T.brk = b; T.preset = preset;
  ls.set("vet_timer_cfg", { preset, focus: f, brk: b });
  reset();
}
function openFS() { overlay.hidden = false; document.body.style.overflow = "hidden"; lock(); try { overlay.requestFullscreen?.()?.catch(() => {}); } catch {} }
function closeFS() { overlay.hidden = true; document.body.style.overflow = ""; if (document.fullscreenElement) document.exitFullscreen().catch(() => {}); if (!T.running) unlock(); }

document.addEventListener("visibilitychange", () => { if (!document.hidden && T.running) { sync(); lock(); } });
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !overlay.hidden) closeFS(); });

$("#stPresets").addEventListener("click", (e) => {
  const b = e.target.closest("[data-p]"); if (!b) return;
  if (b.dataset.p === "custom") { T.preset = "custom"; $("#stCF").value = T.focus; $("#stCB").value = T.brk; paint(); }
  else { const [f, br] = b.dataset.p.split("-").map(Number); setDur(f, br, b.dataset.p); }
});

/* ---------- Picture in Picture ---------- */
const hasDoc = "documentPictureInPicture" in window;
const probe = document.createElement("video");
const wk = typeof probe.webkitSetPresentationMode === "function";
const hasVid = (!!document.pictureInPictureEnabled || wk) && typeof HTMLCanvasElement.prototype.captureStream === "function";
if (!hasDoc && !hasVid) $("#stPipBtn").style.display = "none";

/* يعرض الأخطاء على الشاشة (الآيباد ما فيه Console) */
const pipErr = (e) => {
  const m = "PiP: " + (e?.name || "") + " " + (e?.message || e);
  try { window.UI?.toast ? window.UI.toast(m) : alert(m); } catch { alert(m); }
};

let pipCard = null, pipHold = null, vCv = null, vVid = null;
const togglePiP = () => {
  try {
    if (hasDoc) { pip ? pip.close() : openDocPiP(); }
    else if (hasVid) openVidPiP();
    else pipErr("المتصفح لا يدعم النافذة العائمة");
  } catch (e) { pipErr(e); }
};
const pipBtns = (v) => pipCard && pipCard.querySelectorAll('[data-a="expand"],[data-a="pip"]').forEach((b) => (b.style.display = v));

/* كمبيوتر (Chrome/Edge): ننقل الكرت الحقيقي بكل أزراره */
async function openDocPiP() {
  const card = $('[data-st="timer"]'); if (!card) return pipErr("ما لقيت كرت المؤقّت");
  let w;
  try { w = await documentPictureInPicture.requestWindow({ width: 400, height: 660 }); }
  catch (e) { return pipErr(e); }
  try {
    pip = w; pipCard = card; const d = w.document;
    [...document.styleSheets].forEach((ss) => {
      try { const st = d.createElement("style"); st.textContent = [...ss.cssRules].map((r) => r.cssText).join(""); d.head.appendChild(st); }
      catch { if (ss.href) { const l = d.createElement("link"); l.rel = "stylesheet"; l.href = ss.href; d.head.appendChild(l); } }
    });
    d.documentElement.dir = "rtl";
    const th = document.documentElement.getAttribute("data-theme");
    if (th) d.documentElement.setAttribute("data-theme", th);
    d.body.style.cssText = "margin:0;padding:12px;background:var(--paper);color:var(--ink);font-family:'IBM Plex Sans Arabic',sans-serif";
    pipHold = document.createElement("article");
    pipHold.className = "tool-card"; pipHold.style.cssText = "order:1;grid-column:span 2";
    pipHold.innerHTML = `<div style="text-align:center;font-size:13px;color:var(--slate)">المؤقّت يعمل في النافذة العائمة<br><button class="ghost-btn" data-a="pipback" style="margin-top:10px">أعده هنا</button></div>`;
    card.replaceWith(pipHold); d.body.appendChild(card); pipBtns("none");
    d.addEventListener("click", onAction);
    w.setInterval(sync, 500);            /* نافذة ظاهرة = بدون تباطؤ */
    w.addEventListener("pagehide", restorePiP);
    paint(); window.petKick?.(); setTimeout(() => window.petResize?.(), 150);
  } catch (e) { pipErr(e); try { restorePiP(); w.close(); } catch {} }
}
function restorePiP() {
  if (!pipCard) return;
  pipBtns(""); pipHold.replaceWith(pipCard);
  pipCard = pipHold = pip = null;
  paint(); window.petKick?.(); setTimeout(() => window.petResize?.(), 150);
}

/* آيباد / Safari: فيديو عائم يعرض القطة والوقت، وتشغيل/إيقاف يتحكم بالمؤقّت */
const inV = () => !!vVid && (document.pictureInPictureElement === vVid || vVid.webkitPresentationMode === "picture-in-picture");
let vWorker = null, vGuard = false;

function drawV() {
  if (!vCv) return;
  const x = vCv.getContext("2d"), m = String(Math.floor(T.left / 60)).padStart(2, "0"), s = String(T.left % 60).padStart(2, "0");
  x.fillStyle = "#0b1120"; x.fillRect(0, 0, 480, 270);
  const pc = document.getElementById("ptCv");
  if (pc && pc.width && pc.height) {
    const side = Math.min(pc.width, pc.height);
    try { x.drawImage(pc, (pc.width - side) / 2, 0, side, side, 0, 0, 270, 270); } catch {}
  }
  x.fillStyle = "#e0e5ed"; x.textAlign = "center"; x.direction = "ltr";
  const t = `${m}:${s}`; let fs = 90;
  x.font = `800 ${fs}px Manrope, sans-serif`;
  const w = x.measureText(t).width;
  if (w > 190) { fs = Math.floor(fs * 190 / w); x.font = `800 ${fs}px Manrope, sans-serif`; }
  x.fillText(t, 375, 135 + fs * 0.1);
  x.font = "600 22px 'IBM Plex Sans Arabic', sans-serif";
  x.fillText(T.mode === "focus" ? "جلسة تركيز" : "استراحة", 375, 135 + fs * 0.1 + 42);
}
/* عامل (Worker) يحدّث الرسم حتى لو الصفحة بالخلفية */
function vTick(on) {
  if (on && !vWorker) {
    vWorker = new Worker(URL.createObjectURL(new Blob(["setInterval(()=>postMessage(0),400)"])));
    vWorker.onmessage = () => { window.petTick?.(); if (T.running) sync(); else drawV(); };
  } else if (!on && vWorker) { vWorker.terminate(); vWorker = null; }
}
/* نجهّز الفيديو مسبقاً عشان Safari يقبل الدخول لـ PiP مباشرة عند النقرة */
function prepV() {
  if (vVid) return;
  vCv = document.createElement("canvas"); vCv.width = 480; vCv.height = 270;
  vVid = document.createElement("video"); vVid.muted = true; vVid.playsInline = true;
  vVid.setAttribute("playsinline", ""); vVid.setAttribute("muted", "");
  vVid.style.cssText = "position:fixed;right:8px;bottom:8px;width:64px;height:36px;opacity:.01;pointer-events:none;z-index:-1";
  document.body.appendChild(vVid);
  const left = () => { if (!inV()) vTick(false); };
  vVid.addEventListener("leavepictureinpicture", left);
  vVid.addEventListener("webkitpresentationmodechanged", left);
  vVid.addEventListener("pause", () => { if (!vGuard && inV() && T.running) pause(); });
  vVid.addEventListener("play", () => { if (!vGuard && inV() && !T.running) start(); });
  drawV();
  vVid.srcObject = vCv.captureStream(8);
  vGuard = true;
  vVid.play().catch(() => {}).finally(() => { vGuard = false; });
}
function openVidPiP() {
  prepV();
  if (inV()) { document.exitPictureInPicture ? document.exitPictureInPicture().catch(() => {}) : vVid.webkitSetPresentationMode("inline"); return; }
  drawV(); vGuard = true;
  try {
    if (vVid.paused) vVid.play().catch(() => {});
    if (vVid.requestPictureInPicture) vVid.requestPictureInPicture().then(() => { vGuard = false; vTick(true); }).catch((e) => { vGuard = false; pipErr(e); });
    else { vVid.webkitSetPresentationMode("picture-in-picture"); vGuard = false; vTick(true); }
  } catch (e) { vGuard = false; pipErr(e); }
}
if (!hasDoc && hasVid) prepV();

/* ---------- Planner ---------- */
const DAYS = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
let pDay = new Date().getDay();
function renderPlanner() {
  const items = ls.get("vet_planner", []), today = new Date().getDay();
  $("#plTabs").innerHTML = DAYS.map((d, i) => `<button class="st-chip ${i === pDay ? "on" : ""}" data-a="pday" data-d="${i}">${d}${i === today ? " •" : ""}</button>`).join("");
  const list = items.filter((x) => x.day === pDay).sort((a, b) => (a.time || "").localeCompare(b.time || ""));
  $("#plList").innerHTML = list.length
    ? list.map((x) => `<div class="st-item"><b class="latin">${esc(x.time || "--:--")}</b><span>${esc(x.text)}</span><button class="st-x" data-a="pdel" data-id="${x.id}" aria-label="حذف">✕</button></div>`).join("")
    : `<div class="st-item">لا شيء مجدول لهذا اليوم</div>`;
}

/* ---------- Absences ---------- */
function renderAbs() {
  const a = ls.get("vet_absences", []);
  $("#abList").innerHTML = a.length ? a.map((x) => {
    const c = x.count >= x.max ? "#e5484d" : x.count >= x.max - 1 ? "var(--gold)" : "var(--purple)";
    return `<div class="st-item" style="flex-wrap:wrap"><b>${esc(x.name)}</b>
      <span class="latin" style="margin-inline-start:auto;color:${c};font-weight:700">${x.count} / ${x.max}</span>
      <button class="ghost-btn" data-a="abm" data-id="${x.id}">−</button><button class="ghost-btn" data-a="abp" data-id="${x.id}">+</button>
      <button class="st-x" data-a="abd" data-id="${x.id}" aria-label="حذف">✕</button>
      <div class="st-bar" style="width:100%"><u style="width:${Math.min(100, (x.count / x.max) * 100)}%;background:${c}"></u></div></div>`;
  }).join("") : `<div class="st-item">أضف مساقاً وحدّد عدد الغيابات المسموحة</div>`;
}

/* ---------- Actions ---------- */
function addPlan() {
  const text = $("#plText").value.trim(); if (!text) return;
  const items = ls.get("vet_planner", []); items.push({ id: uid(), day: pDay, time: $("#plTime").value, text });
  ls.set("vet_planner", items); $("#plText").value = ""; renderPlanner();
}
function addAbs() {
  const name = $("#abName").value.trim(), max = Number($("#abMax").value);
  if (!name || !(max > 0)) return;
  const a = ls.get("vet_absences", []); a.push({ id: uid(), name, max, count: 0 });
  ls.set("vet_absences", a); $("#abName").value = ""; $("#abMax").value = ""; renderAbs();
}
function bumpAbs(id, d) {
  ls.set("vet_absences", ls.get("vet_absences", []).map((x) => (x.id === id ? { ...x, count: Math.max(0, x.count + d) } : x)));
  renderAbs();
}
function onAction(e) {
  const b = e.target.closest("[data-a]"); if (!b) return;
  const id = b.dataset.id;
  switch (b.dataset.a) {
    case "toggle": T.running ? pause() : start(); break;
    case "reset": reset(); break;
    case "expand": openFS(); break;
    case "close": closeFS(); break;
    case "pip": togglePiP(); break;
    case "pipback": pip?.close(); break;
    case "apply": {
      const f = Math.min(180, Math.max(1, Number($("#stCF").value) || 0)), br = Math.min(60, Math.max(1, Number($("#stCB").value) || 0));
      if (f && br) setDur(f, br, "custom"); break;
    }
    case "pday": pDay = Number(b.dataset.d); renderPlanner(); break;
    case "padd": addPlan(); break;
    case "pdel": ls.set("vet_planner", ls.get("vet_planner", []).filter((x) => x.id !== id)); renderPlanner(); break;
    case "absadd": addAbs(); break;
    case "abp": bumpAbs(id, 1); break;
    case "abm": bumpAbs(id, -1); break;
    case "abd": ls.set("vet_absences", ls.get("vet_absences", []).filter((x) => x.id !== id)); renderAbs(); break;
  }
}
document.addEventListener("click", onAction);
$("#plText").addEventListener("keydown", (e) => { if (e.key === "Enter") addPlan(); });
$("#abName").addEventListener("keydown", (e) => { if (e.key === "Enter") addAbs(); });
$("#stGoalIn").addEventListener("change", (e) => { ls.set("vet_goal", Math.max(1, Number(e.target.value) || 10)); renderStats(); });

/* ---------- Course progress + notes (inside the course modal) ---------- */
const prog = () => ls.get("vet_progress", {});
function decorateCards() {
  const p = prog();
  document.querySelectorAll("#courseGrid .course-card").forEach((c) => {
    c.querySelector(".pg-mini")?.remove();
    const r = p[c.dataset.courseId]; if (!r || !r.total) return;
    c.insertAdjacentHTML("beforeend", `<div class="pg-mini"><u style="width:${Math.round((r.done.length / r.total) * 100)}%"></u></div>`);
  });
}
const UI = window.UI;
if (UI) {
  const origOpen = UI.openResources;
  UI.openResources = async function (id) {
    await origOpen.call(this, id);
    try {
      const body = $("#resourceBody"), items = [...body.querySelectorAll(".resource-item")];
      const p = prog(), rec = p[id] || { done: [], total: 0 };
      rec.total = items.length; p[id] = rec;
      const bar = document.createElement("div"); bar.className = "pg-bar";
      const paintBar = () => {
        const n = rec.done.length, t = rec.total;
        bar.innerHTML = `إنجازك بالمساق: <b>${n} / ${t}</b><div class="st-bar"><u style="width:${t ? Math.round((n / t) * 100) : 0}%"></u></div>`;
      };
      items.forEach((it) => {
        const url = it.querySelector("a")?.getAttribute("href") || "";
        const cb = document.createElement("input"); cb.type = "checkbox"; cb.className = "pg-chk";
        cb.checked = rec.done.includes(url); cb.title = "علّم كمنجز";
        cb.addEventListener("change", () => {
          rec.done = cb.checked ? [...new Set([...rec.done, url])] : rec.done.filter((u) => u !== url);
          const all2 = prog(); all2[id] = rec; ls.set("vet_progress", all2); paintBar(); decorateCards();
        });
        it.prepend(cb);
      });
      if (items.length) { paintBar(); body.prepend(bar); ls.set("vet_progress", p); decorateCards(); }
      const note = document.createElement("section"); note.className = "resource-group";
      note.innerHTML = `<h3>📝 ملاحظاتي</h3><textarea class="textarea pg-note" placeholder="اكتب ملاحظاتك عن هذا المساق… يتم حفظها تلقائياً على جهازك"></textarea>`;
      const ta = note.querySelector("textarea"); ta.value = ls.get("vet_note_" + id, "");
      ta.addEventListener("input", () => ls.set("vet_note_" + id, ta.value));
      body.append(note);
    } catch (err) { console.error(err); }
  };
  const origRender = UI.renderCourses;
  UI.renderCourses = function () { origRender.call(this); decorateCards(); };
}

/* ---------- Admin content: quotes (Firestore) ---------- */
const waitDb = () => new Promise((r) => { let n = 0; const i = setInterval(() => { if (window.App?.db || ++n > 40) { clearInterval(i); r(); } }, 250); });
(async () => {
  await waitDb(); if (!window.DB) return;
  try {
    const q = (await window.DB.list("acad_quotes")).map((x) => x.text).filter(Boolean);
    if (q.length) { quotes = q; setQuote(); }
  } catch {}
})();

/* ---------- Init ---------- */
setQuote(); paint(); renderStats(); renderPlanner(); renderAbs(); decorateCards();
