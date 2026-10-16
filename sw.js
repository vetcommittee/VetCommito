const CACHE_NAME = 'vetcommitto-cache-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/tree.html',
  '/gpa.html',
  '/exams.html',
  '/Qsbank.html',
  '/guide.html',
  '/rules.html',
  '/about.html',
  '/manifest.json',
  '/logo.jpeg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
