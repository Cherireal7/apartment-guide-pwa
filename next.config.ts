import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
    swSrc: "src/sw.ts",
    swDest: "public/sw.js",

    // ✅ disable in dev (Turbopack), enable only in production
    disable: process.env.NODE_ENV !== "production",
});

const nextConfig: NextConfig = {
    // ✅ silence Next's turbopack warning cleanly
    turbopack: {},
};

export default withSerwist(nextConfig);
