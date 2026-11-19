// Vamos Ler! — funciona sem internet depois da primeira visita
const CACHE = 'vamos-ler-f403a827d0';
const ASSETS = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "fonts/andika-400.woff2",
  "fonts/andika-700.woff2",
  "fonts/fredoka-500.woff2",
  "fonts/fredoka-600.woff2",
  "fonts/fredoka-700.woff2",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-maskable-512.png",
  "audio/en.json",
  "audio/pt.json"
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
// Página: tenta a rede primeiro (para apanhar atualizações), senão usa a cópia guardada.
// Restantes ficheiros: cópia guardada primeiro.
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put('index.html', copy)); return r; })
      .catch(() => caches.match('index.html')));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req)));
});
