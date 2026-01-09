import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from 'url';
import { VitePWA } from "vite-plugin-pwa";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      
      // Service Worker Configuration
      workbox: {
        globPatterns: [
          '**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp}',
          'manifest.json'
        ],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
          {
            urlPattern: /^https:\/\/.*\.(png|jpg|jpeg|svg|webp)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
        ],
        navigationPreload: true,
        skipWaiting: true,
        cleanupOutdatedCaches: true,
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
      },

      // Manifest Configuration
      includeAssets: [
        'apple-touch-icon.png',
        'favicon-16x16.png',
        'favicon-32x32.png',
        'favicon.ico',
        'pwa-192x192.png',
        'pwa-512x512.png',
        'pwa-maskable-192x192.png',
        'pwa-maskable-512x512.png',
        'screenshot-desktop.png',
        'screenshot-mobile.png'
      ],
      manifest: {
        name: "OffWeGo - Find Your Next Adventure",
        short_name: "OffWeGo",
        description: "Discover amazing destinations and create unforgettable memories with OffWeGo - Your gateway to extraordinary travel experiences.",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#E50914",
        orientation: "portrait",
        scope: "/",
        lang: "en",
        categories: ["travel", "booking", "lifestyle"],
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "pwa-maskable-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable"
          },
          {
            src: "pwa-maskable-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          }
        ],
        shortcuts: [
          {
            name: "Search Packages",
            short_name: "Search",
            description: "Find travel packages",
            url: "/packages",
            icons: [
              {
                src: "pwa-192x192.png",
                sizes: "192x192"
              }
            ]
          },
          {
            name: "My Bookings",
            short_name: "Bookings",
            description: "View your bookings",
            url: "/user/bookings",
            icons: [
              {
                src: "pwa-192x192.png",
                sizes: "192x192"
              }
            ]
          }
        ],
        screenshots: [
          {
            src: "screenshot-desktop.png",
            sizes: "1280x720",
            type: "image/png",
            form_factor: "wide",
            label: "OffWeGo Desktop View"
          },
          {
            src: "screenshot-mobile.png",
            sizes: "375x667",
            type: "image/png",
            form_factor: "narrow",
            label: "OffWeGo Mobile View"
          }
        ]
      },

      // Development Options
      devOptions: {
        enabled: true,
        type: 'module',
        navigateFallback: '/fallback'
      },

      // PWA Configuration
      strategies: 'injectManifest',
      injectRegister: 'auto',
      
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
