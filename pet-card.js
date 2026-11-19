/* يضيف "حيوانك الرفيق" لصفحة index.html: عنصر بالقائمة الجانبية + بطاقة بقسم الأدوات.
   الاستخدام: أضف السطر <script src="pet-card.js"></script> قبل </body> */
(function () {
  const KINDS = { cat: ['🐱', ['قطتك الصغيرة', 'قطتك الشابة', 'قطتك الكبيرة'], 'قطة'], dog: ['🐶', ['جروك الصغير', 'كلبك الشاب', 'كلبك الكبير'], 'كلب'], horse: ['🐴', ['مهرك الصغير', 'حصانك الشاب', 'حصانك الكبير'], 'حصان'], parrot: ['🦜', ['فرخك الصغير', 'ببغاؤك الشاب', 'ببغاؤك الكبير'], 'ببغاء'] };
  const STAGES = [0, 3, 8];

  function state() {
    let o = {};
    try { o = JSON.parse(localStorage.getItem('vet_pet') || '{}'); } catch (e) {}
    const kind = KINDS[o.kind] ? o.kind : 'cat';
    const p = (o.pets && o.pets[kind]) || (o.sessions !== undefined && kind === 'cat' ? o : {});
    const sessions = +p.sessions || 0;
    let h = p.h ?? 70, w = p.w ?? 70;
    if (p.ts) { const d = (Date.now() - p.ts) / 14400000 * 100; h = Math.max(0, h - d); w = Math.max(0, w - d); }
    return { kind, sessions, pending: +p.pending > 0, needy: h < 25 || w < 25 };
  }

  function cardHTML() {
    const s = state(), k = KINDS[s.kind];
    let i = 0; STAGES.forEach((m, n) => { if (s.sessions >= m) i = n; });
    const nx = STAGES[i + 1];
    const pct = nx ? Math.round((s.sessions - STAGES[i]) / (nx - STAGES[i]) * 100) : 100;
    const sub = s.pending ? 'انحسبت جلستك، ادخل ليأكل 🍗' : s.needy ? 'محتاج أكل وماء، ادخل أطعمه 🥺' : nx ? 'باقي ' + (nx - s.sessions) + ' جلسات ليكبر' : 'وصل لأقصى نمو 🎉';
    return '<div class="tool-head"><div class="tool-heading"><span class="tool-ico"><i data-lucide="paw-print" width="20"></i></span>' +
      '<div><strong>حيوانك الرفيق</strong><small>يكبر مع جلسات تركيزك</small></div></div></div>' +
      '<div class="tool-card-body"><div style="display:flex;align-items:center;gap:14px">' +
      '<span style="font-size:44px;line-height:1">' + k[0] + '</span>' +
      '<div style="flex:1;min-width:0"><b style="font-size:14px;color:var(--navy)">' + k[1][i] + '</b>' +
      '<div style="height:8px;border-radius:99px;background:var(--btn-bg);margin:8px 0 6px;overflow:hidden"><i style="display:block;height:100%;width:' + pct + '%;background:var(--gold);border-radius:99px"></i></div>' +
      '<small style="font-size:11px;color:var(--slate)">' + sub + '</small></div></div>' +
      '<a href="pet.html" class="primary-btn" style="width:100%;margin-top:16px"><i data-lucide="play" width="14"></i>افتح حيوانك</a></div>';
  }

  /* تستدعيها study-tools.js لما تخلص جلسة تركيز */
  window.feedPet = function () {
    let o = {}; try { o = JSON.parse(localStorage.getItem('vet_pet') || '{}'); } catch (e) {}
    const kind = KINDS[o.kind] ? o.kind : 'cat';
    const pets = o.pets || (o.sessions !== undefined ? { cat: o } : {});
    const p = pets[kind] || {}; p.sessions = (+p.sessions || 0) + 1; p.pending = (+p.pending || 0) + 1; pets[kind] = p;
    try { localStorage.setItem('vet_pet', JSON.stringify({ kind, pets })); } catch (e) {}
    const c = document.getElementById('petCard'); if (c) { c.innerHTML = cardHTML(); if (window.lucide) window.lucide.createIcons(); }
    if (window.UI && UI.toast) UI.toast('انحسبت الجلسة لحيوانك 🐾 افتحه ليأكل');
  };

  function ensure() {
    const drawer = document.querySelector('.drawer-nav');
    if (drawer && !document.getElementById('petLink')) {
      const a = document.createElement('a');
      a.id = 'petLink'; a.href = 'pet.html'; a.className = 'drawer-item';
      a.innerHTML = '<i data-lucide="paw-print" width="18"></i>حيوانك الرفيق';
      const after = drawer.querySelector('a[href="gpa.html"]');
      after ? after.after(a) : drawer.append(a);
    }
    const grid = document.getElementById('mainToolsGrid');
    if (grid && !document.getElementById('petCard')) {
      const c = document.createElement('article');
      c.id = 'petCard'; c.className = 'tool-card'; c.innerHTML = cardHTML();
      grid.append(c);
    }
    if (window.lucide) window.lucide.createIcons();
  }

  function start() {
    ensure();
    const grid = document.getElementById('mainToolsGrid');
    if (grid) new MutationObserver(ensure).observe(grid, { childList: true });
  }
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', start) : start();
  window.addEventListener('pageshow', () => { const c = document.getElementById('petCard'); if (c) c.innerHTML = cardHTML(); if (window.lucide) window.lucide.createIcons(); });
})();
