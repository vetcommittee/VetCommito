const CACHE_NAME = 'vetcommitto-cache-v4';
const THREE_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
/* مسارات نسبية: تشتغل سواء الموقع على جذر الدومين أو داخل مجلد (github.io/VetCommito/) */
const urlsToCache = [
  './',
  'index.html',
  'tree.html',
  'gpa.html',
  'exams.html',
  'Qsbank.html',
  'guide.html',
  'rules.html',
  'about.html',
  'doctors.html',
  'pet-timer.js',
  'study-tools.js',
  'hero.mp4',
  'manifest.json',
  'logo.jpeg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => Promise.all([
      /* ملف مفقود ما بيخرّب التثبيت كله */
      ...urlsToCache.map(u => cache.add(u).catch(() => {})),
      cache.add(new Request(THREE_CDN, { mode: 'no-cors' })).catch(() => {})
    ])).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* الشبكة أولاً (عشان التعديلات تظهر فوراً)، وإذا ما في نت نرجع للكاش */
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const sameOrigin = new URL(req.url).origin === self.location.origin;
  if (!sameOrigin && req.url !== THREE_CDN) return;

  event.respondWith(
    fetch(req).then(res => {
      if (res && (res.status === 200 || res.type === 'opaque')) {
        const copy = res.clone();
        caches.open(CACHE_NAME).then(c => c.put(req, copy)).catch(() => {});
      }
      return res;
    }).catch(() =>
      caches.match(req, { ignoreSearch: true }).then(hit => hit || (req.mode === 'navigate' ? caches.match('index.html') : undefined))
    )
  );
});
