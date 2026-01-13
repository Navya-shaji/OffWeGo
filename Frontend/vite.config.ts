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
            srcDir: 'src',
            filename: 'sw.js',
            strategies: 'injectManifest',
            injectRegister: 'auto',

            // Service Worker Configuration
            injectManifest: {
                globPatterns: [
                    '**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp}',
                    'manifest.json'
                ],
                maximumFileSizeToCacheInBytes: 30 * 1024 * 1024, // 30MB
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
        }),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
