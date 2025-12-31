/// <reference lib="webworker" />

import { Serwist } from "serwist";
import { defaultCache } from "@serwist/next/worker";
import { NetworkFirst, StaleWhileRevalidate, ExpirationPlugin } from "serwist";

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
    runtimeCaching: [
        ...defaultCache,

        // 1) Cache your guide JSON for offline use
        {
            matcher: ({ url }) =>
                url.origin === self.location.origin &&
                url.pathname.startsWith("/guides/") &&
                url.pathname.endsWith("/guide.json"),
            handler: new NetworkFirst({
                cacheName: "guide-json",
                networkTimeoutSeconds: 3,
                plugins: [
                    new ExpirationPlugin({
                        maxEntries: 50,
                        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                    }),
                ],
            }),
        },

        // 2) Cache SAME-ORIGIN images (perfect once you switch to /public images)
        {
            matcher: ({ request, url }) =>
                request.destination === "image" && url.origin === self.location.origin,
            handler: new StaleWhileRevalidate({
                cacheName: "local-images",
                plugins: [
                    new ExpirationPlugin({
                        maxEntries: 200,
                        maxAgeSeconds: 60 * 60 * 24 * 30,
                    }),
                ],
            }),
        },

        // Optional (for now): cache Pexels images too (until you replace them)
        {
            matcher: ({ request, url }) =>
                request.destination === "image" &&
                (url.hostname.includes("pexels.com") || url.hostname.includes("images.pexels.com")),
            handler: new StaleWhileRevalidate({
                cacheName: "pexels-images",
                plugins: [
                    new ExpirationPlugin({
                        maxEntries: 200,
                        maxAgeSeconds: 60 * 60 * 24 * 14, // 14 days
                    }),
                ],
            }),
        },
    ],
    skipWaiting: true,
    clientsClaim: true,
});

serwist.addEventListeners();
