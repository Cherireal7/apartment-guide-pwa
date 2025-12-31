import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Apartment Guide",
        short_name: "Guide",
        description: "Offline-ready apartment guide",
        start_url: "/",
        display: "standalone",
        background_color: "#070A10",
        theme_color: "#070A10",
        icons: [
            { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
            { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
            { src: "/icons/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
    };
}
