// Meridian service worker. Base-path aware: works at "/" and at "/meridian/".
// Network-first for navigations (offline fallback to cached app shell), cache-first for assets.
const CACHE = "meridian-v5";
const BASE = new URL(self.registration.scope).pathname; // e.g. "/meridian/"
const SHELL = BASE; // index.html served at the base path
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll([SHELL, `${BASE}manifest.webmanifest`, `${BASE}icons/icon-192.png`])));
  self.skipWaiting();
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", (e) => {
  const r = e.request;
  const u = new URL(r.url);
  if (r.method !== "GET" || u.origin !== location.origin || !u.pathname.startsWith(BASE)) return;
  if (r.mode === "navigate") {
    e.respondWith(fetch(r).then((res) => { if (res.ok) { const cp = res.clone(); caches.open(CACHE).then((c) => c.put(SHELL, cp)); } return res; })
      .catch(() => caches.match(SHELL)));
    return;
  }
  e.respondWith(caches.match(r).then((hit) => hit || fetch(r).then((res) => {
    if (res.ok) { const cp = res.clone(); caches.open(CACHE).then((c) => c.put(r, cp)); }
    return res;
  })));
});
