const CACHE_NAME = 'putzplan-v4.7';
const ASSETS = ['/', '/index.html'];

// Install: cache core assets
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: network-first for API, cache-first for assets
self.addEventListener('fetch', (e) => {
  // Skip non-GET and Firebase requests
  if (e.request.method !== 'GET') return;
  if (e.request.url.includes('firebaseio.com')) return;
  if (e.request.url.includes('googleapis.com')) return;
  
  // Skip invalid schemes (chrome-extension, etc)
  try {
    const url = new URL(e.request.url);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return;
  } catch {
    return;
  }

  e.respondWith(
    fetch(e.request)
      .then((res) => {
        if (!res || !res.ok) return res;
        const clone = res.clone();
        try {
          caches.open(CACHE_NAME).then((cache) => {
            try {
              cache.put(e.request, clone);
            } catch (err) {
              console.debug('Cache put error:', err);
            }
          }).catch(err => console.debug('Cache open error:', err));
        } catch (err) {
          console.debug('Cache operation error:', err);
        }
        return res;
      })
      .catch(() => {
        return caches.match(e.request).catch(() => new Response('offline'));
      })
  );
});

// Push notification handler
self.addEventListener('push', (e) => {
  const data = e.data ? e.data.json() : {};
  const title = data.title || 'WG Putzplan';
  const options = {
    body: data.body || 'Du hast noch offene Aufgaben!',
    icon: '/icon-512.png',
    badge: '/icon-512.png',
    vibrate: [100, 50, 100],
    data: { url: '/' },
    actions: [
      { action: 'open', title: 'Öffnen' },
      { action: 'dismiss', title: 'Später' },
    ],
  };
  e.waitUntil(self.registration.showNotification(title, options));
});

// Notification click handler
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  if (e.action === 'dismiss') return;
  e.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      return self.clients.openWindow('/');
    })
  );
});

// Scheduled deadline check (triggered by periodic sync or message)
self.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'DEADLINE_CHECK') {
    const { hoursLeft, tasksOpen, lang } = e.data;
    if (tasksOpen > 0 && hoursLeft <= 24) {
      const title = lang === 'vi' ? '⏰ Sắp hết hạn!' : '⏰ Deadline naht!';
      const body =
        lang === 'vi'
          ? `Còn ${hoursLeft}h — ${tasksOpen} nhiệm vụ chưa xong`
          : `Noch ${hoursLeft}h — ${tasksOpen} Aufgaben offen`;
      self.registration.showNotification(title, {
        body,
        icon: '/icon-512.png',
        badge: '/icon-512.png',
        vibrate: [200, 100, 200],
        tag: 'deadline-reminder',
        renotify: true,
      });
    }
  }
  if (e.data && e.data.type === 'ANNOUNCEMENT') {
    const icons = { normal: '📢', important: '⚠️', urgent: '🚨' };
    self.registration.showNotification(`${icons[e.data.level] || '📢'} ${e.data.title}`, {
      body: e.data.body,
      icon: '/icon-512.png',
      badge: '/icon-512.png',
      vibrate: [200, 100, 200, 100, 200],
      tag: 'announcement',
      renotify: true,
    });
  }
});
