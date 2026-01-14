import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

// Cache app shell and assets from the manifest
precacheAndRoute(self.__WB_MANIFEST);

// Cache API responses
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new StaleWhileRevalidate({
    cacheName: 'api-cache',
    plugins: [
      {
        cacheKeyWillBeUsed: async ({ request }) => {
          return `${request.url}-${request.headers.get('Authorization') || 'anonymous'}`;
        },
      },
    ],
  })
);

// Cache images and assets
registerRoute(
  ({ request }) => request.destination === 'image',
  new StaleWhileRevalidate({
    cacheName: 'images-cache',
    cacheKeyWillBeUsed: async ({ request }) => request.url,
  })
);

// Offline fallback page
registerRoute(
  ({ url }) => url.pathname === '/offline',
  () => {
    return new Response(
      `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Offline - OffWeGo</title>
          <style>
            body {
              font-family: 'Dancing Script', cursive;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              text-align: center;
            }
            .offline-container {
              padding: 2rem;
              text-align: center;
            }
            .offline-icon {
              font-size: 4rem;
              margin-bottom: 1rem;
            }
            h1 {
              font-size: 2rem;
              margin-bottom: 1rem;
            }
            p {
              font-size: 1.2rem;
              margin-bottom: 2rem;
              opacity: 0.9;
            }
            .retry-btn {
              background: #E50914;
              color: white;
              border: none;
              padding: 1rem 2rem;
              border-radius: 0.5rem;
              font-size: 1rem;
              cursor: pointer;
              text-decoration: none;
              display: inline-block;
              transition: all 0.3s ease;
            }
            .retry-btn:hover {
              background: #d60f13;
              transform: translateY(-2px);
            }
          </style>
        </head>
        <body>
          <div class="offline-container">
            <div class="offline-icon">✈️</div>
            <h1>You're Offline</h1>
            <p>Please check your internet connection and try again.</p>
            <a href="/" class="retry-btn">Try Again</a>
          </div>
        </body>
      </html>`,
      {
        headers: { 'Content-Type': 'text/html' },
        status: 200
      }
    );
  }
);

// Push notification handling
self.addEventListener('push', (event) => {
  if (event.data) {
    const options = {
      body: event.data.body,
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      },
      actions: [
        {
          action: 'explore',
          title: 'Explore OffWeGo',
          icon: '/pwa-192x192.png'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(event.data.title, options)
    );
  }
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Handle background sync here
      console.log('Background sync triggered')
    );
  }
});

// Install and activate events
self.addEventListener('install', (event) => {
  self.skipWaiting();
  console.log('Service Worker installed');
});

self.addEventListener('activate', (event) => {
  if (self.clients && self.clients.claim) {
    self.clients.claim();
  }
  console.log('Service Worker activated');
});
