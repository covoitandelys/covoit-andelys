// Covoit' Andelys – service worker : notifications + installation
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {}); // nécessaire pour que l'appli soit installable (pas de cache : toujours la dernière version)

self.addEventListener('push', (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = { body: e.data && e.data.text() }; }
  const title = d.title || "Covoit' Andelys", body = d.body || 'Tu as du nouveau dans l\'appli';
  // même titre + même texte = même étiquette : un doublon remplace la 1re notification au lieu d'en afficher une 2e
  e.waitUntil(self.registration.showNotification(title, {
    body, icon: 'icon-192.png', badge: 'icon-192.png', tag: d.tag || ('m:' + title + '|' + body).slice(0, 200), renotify: false,
    data: { url: d.url || './' },
  }));
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const url = new URL((e.notification.data && e.notification.data.url) || './', self.location.href).href;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
    for (const c of list) if (c.url.startsWith(self.registration.scope)) { c.focus(); return c.navigate ? c.navigate(url) : null; }
    return self.clients.openWindow(url);
  }));
});
