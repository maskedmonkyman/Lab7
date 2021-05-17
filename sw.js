// sw.js - Service Worker
const CACHE_NAME = 'entrysCacheV1';
const urlsToCache = ['https://cse110lab6.herokuapp.com/entries'];

// You will need 3 event listeners:
//   - One for installation
self.addEventListener('install', event => {
  event.waitUntil(
    caches
    .open(CACHE_NAME)
    .then(cache => {
      console.log('creating cache entry')
      cache.addAll(urlsToCache);
    })
    .then(() => self.skipWaiting())
  );
});

//   - One for activation ( check out MDN's clients.claim() for this step )
self.addEventListener('activate', event => {
  event.waitUntil(
    clients.claim().then(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cache => {
            console.log("checking cache");
            if (cache !== CACHE_NAME)
            {
              return caches.delete(cache);
            }
          })
        );
      })
    )
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});