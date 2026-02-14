const CACHE_NAME = 'vko-guide-v1';
const urlsToCache = [
  '/',
  '/index.html'
];

// Установка Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Кэш открыт');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Активация Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Удаление старого кэша:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch - стратегия Network First только для локальных файлов
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // НЕ кэшируем внешние домены (Google Maps, Mapillary, OpenStreetMap и т.д.)
  const isExternal = url.origin !== self.location.origin;
  
  // НЕ кэшируем API запросы и tile серверы
  const isApiOrTile = url.pathname.includes('/tile/') || 
                       url.pathname.includes('/api/') ||
                       url.hostname.includes('googleapis.com') ||
                       url.hostname.includes('google.com') ||
                       url.hostname.includes('mapillary.com') ||
                       url.hostname.includes('openstreetmap.org') ||
                       url.hostname.includes('yandex.ru') ||
                       url.hostname.includes('arcgisonline.com') ||
                       url.hostname.includes('cartocdn.com');
  
  // Если внешний ресурс или API - просто пропускаем через сеть БЕЗ кэширования
  if (isExternal || isApiOrTile) {
    event.respondWith(fetch(event.request));
    return;
  }
  
  // Для локальных файлов используем Network First с fallback на кэш
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Если запрос успешен, сохраняем в кэш
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Если сеть недоступна, используем кэш (только для локальных файлов)
        return caches.match(event.request);
      })
  );
});
