"use client";

import { useEffect } from "react";

export default function SWRegister() {
    useEffect(() => {
        if (!("serviceWorker" in navigator)) return;

        // Register after load so it doesn't slow initial render
        const onLoad = () => {
            navigator.serviceWorker.register("/sw.js").catch(() => {
                // ignore
            });
        };

        window.addEventListener("load", onLoad);
        return () => window.removeEventListener("load", onLoad);
    }, []);

    return null;
}
