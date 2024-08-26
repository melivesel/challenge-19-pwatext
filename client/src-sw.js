const { offlineFallback, warmStrategyCache } = require('workbox-recipes');
const { CacheFirst } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');

precacheAndRoute(self.__WB_MANIFEST);

const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});

warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
});

registerRoute(({ request }) => request.mode === 'navigate', pageCache);

// TODO: Implement asset caching
registerRoute(    // Define the callback function that filters the requests you want to cache (e.g., JS and CSS files)
  ({ request }) => ['style', 'script', 'worker', 'image'].includes(request.destination),
  new CacheFirst({
      // Name of the cache storage.
      cacheName: 'asset-cache',
      plugins: [
          // Cache responses with these headers for a maximum age of 30 days
          new CacheableResponsePlugin({
              statuses: [0, 200],
          }),
          // Set an expiration for the cached assets
          new ExpirationPlugin({
              maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
          }),
      ],
  })
);
