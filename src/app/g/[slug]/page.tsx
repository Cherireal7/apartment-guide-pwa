/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

// -------------------- i18n --------------------
type Lang = "en" | "no";
type I18nString = string | Record<Lang, string>;

const tr = (val: I18nString | undefined | null, lang: Lang, fallbackLang: Lang = "en") => {
    if (!val) return "";
    if (typeof val === "string") return val;
    return val[lang] ?? val[fallbackLang] ?? Object.values(val)[0] ?? "";
};

// -------------------- Types --------------------
type Guide = {
    apartmentId: string;
    name: I18nString;
    location?: I18nString;
    description?: I18nString;

    language?: {
        primary?: Lang;
        available?: Lang[];
    };

    emergency: {
        contacts: Array<{ label: I18nString; type: "phone" | "whatsapp"; value: string; icon?: string }>;
        safetyNotes?: Array<I18nString>;
        doNot?: Array<I18nString>;
        items: Array<{
            id: string;
            title: I18nString;
            locationText: I18nString;
            steps: Array<I18nString>;
            stopAndCall?: Array<I18nString>;
            imageUrl?: string;
        }>;
    };

    categories: Array<{
        id: string;
        name: I18nString;
        items: Array<{
            id: string;
            title: I18nString;
            locationText: I18nString;
            imageUrl?: string;
        }>;
    }>;

    wifi?: {
        name: string;
        password: string;
        troubleshooting?: Array<I18nString>;
    };

    rules?: Array<I18nString>;
    checkout?: Array<I18nString>;
};

type View = "home" | "emergency" | "find" | "wifi" | "rules" | "checkout";

// -------------------- Helpers --------------------
function normalizePhoneForWhatsApp(input: string) {
    return input.replace(/[^\d]/g, "");
}

function contactHref(c: Guide["emergency"]["contacts"][number]) {
    if (c.type === "whatsapp") return `https://wa.me/${normalizePhoneForWhatsApp(c.value)}`;
    return `tel:${c.value}`;
}

function clampText(s: string, max = 70) {
    if (!s) return "";
    return s.length > max ? s.slice(0, max - 1) + "…" : s;
}

// Detect online/offline (helps explain why images fail)
function useOnline() {
    const [online, setOnline] = useState(true);
    useEffect(() => {
        const update = () => setOnline(typeof navigator !== "undefined" ? navigator.onLine : true);
        update();
        window.addEventListener("online", update);
        window.addEventListener("offline", update);
        return () => {
            window.removeEventListener("online", update);
            window.removeEventListener("offline", update);
        };
    }, []);
    return online;
}

// -------------------- UI: SmartImage --------------------
function SmartImage({
                        src,
                        alt,
                        className,
                        heightClass = "h-44",
                    }: {
    src?: string;
    alt: string;
    className?: string;
    heightClass?: string;
}) {
    const online = useOnline();
    const [loaded, setLoaded] = useState(false);
    const [failed, setFailed] = useState(false);

    // Reset state when src changes
    useEffect(() => {
        setLoaded(false);
        setFailed(false);
    }, [src]);

    if (!src) return null;

    // If we’re offline, don't pretend it'll load
    if (!online) {
        return (
            <div className={`overflow-hidden rounded-xl border border-white/10 bg-black/20 ${heightClass} ${className ?? ""}`}>
                <div className="h-full w-full grid place-items-center">
                    <div className="text-center px-4">
                        <div className="text-sm font-semibold text-white/80">Photo unavailable offline</div>
                        <div className="mt-1 text-[11px] text-white/50">Connect to the internet to load images.</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`relative overflow-hidden rounded-xl border border-white/10 bg-black/20 ${heightClass} ${className ?? ""}`}>
            {/* Skeleton while loading */}
            {!loaded && !failed ? (
                <div className="absolute inset-0 animate-pulse">
                    <div className="h-full w-full bg-white/5" />
                </div>
            ) : null}

            {/* Fallback if failed */}
            {failed ? (
                <div className="absolute inset-0 grid place-items-center">
                    <div className="text-center px-4">
                        <div className="text-sm font-semibold text-white/80">Photo couldn’t load</div>
                        <div className="mt-1 text-[11px] text-white/50">
                            Might be blocked by network/adblock/referrer rules.
                        </div>
                    </div>
                </div>
            ) : null}

            {/* Real image */}
            <img
                src={src}
                alt={alt}
                className={`absolute inset-0 w-full h-full object-cover ${failed ? "opacity-0" : "opacity-100"} transition-opacity`}
                loading="lazy"
                referrerPolicy="no-referrer"
                onLoad={() => setLoaded(true)}
                onError={() => setFailed(true)}
            />
        </div>
    );
}

// -------------------- Page --------------------
export default function GuidePage() {
    const params = useParams<{ slug: string }>();
    const router = useRouter();
    const slug = params?.slug;

    const [guide, setGuide] = useState<Guide | null>(null);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<View>("home");
    const [query, setQuery] = useState("");

    const [lang, setLang] = useState<Lang>("en");
    const online = useOnline();

    // Load guide JSON
    useEffect(() => {
        let mounted = true;
        async function run() {
            try {
                setLoading(true);
                const res = await fetch(`/guides/${slug}/guide.json`, { cache: "no-store" });
                if (!res.ok) throw new Error(`Failed to load guide.json (${res.status})`);
                const data = (await res.json()) as Guide;
                if (!mounted) return;

                setGuide(data);

                const primary = data.language?.primary;
                const available = data.language?.available ?? ["en", "no"];
                const initial = (primary && available.includes(primary) ? primary : "en") as Lang;
                setLang(initial);
            } catch {
                if (mounted) setGuide(null);
            } finally {
                if (mounted) setLoading(false);
            }
        }
        if (slug) run();
        return () => {
            mounted = false;
        };
    }, [slug]);

    // Hash navigation
    useEffect(() => {
        const onHash = () => {
            const h = (window.location.hash || "").replace("#", "");
            const allowed: View[] = ["home", "emergency", "find", "wifi", "rules", "checkout"];
            if (allowed.includes(h as View)) setView(h as View);
        };
        onHash();
        window.addEventListener("hashchange", onHash);
        return () => window.removeEventListener("hashchange", onHash);
    }, []);

    const setRouteView = (v: View) => {
        setView(v);
        window.location.hash = v === "home" ? "" : `#${v}`;
    };

    const allItems = useMemo(() => {
        if (!guide) return [];
        return guide.categories.flatMap((c) =>
            c.items.map((it) => ({
                ...it,
                categoryId: c.id,
                categoryName: tr(c.name, lang),
            }))
        );
    }, [guide, lang]);

    const filteredItems = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return allItems;
        return allItems.filter((it) => {
            const title = tr(it.title, lang).toLowerCase();
            const loc = tr(it.locationText, lang).toLowerCase();
            const cat = (it.categoryName ?? "").toLowerCase();
            return title.includes(q) || loc.includes(q) || cat.includes(q);
        });
    }, [allItems, query, lang]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#070A10] text-white grid place-items-center">
                <div className="text-center space-y-3">
                    <div className="mx-auto h-10 w-10 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                    <div className="text-sm text-white/70">Loading guide…</div>
                </div>
            </div>
        );
    }

    if (!guide) {
        return (
            <div className="min-h-screen bg-[#070A10] text-white grid place-items-center p-6">
                <div className="max-w-md text-center space-y-3">
                    <div className="text-2xl font-semibold">Guide not found</div>
                    <div className="text-white/70 text-sm">The QR code may be wrong, or this guide hasn’t been uploaded yet.</div>
                    <button
                        className="mt-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
                        onClick={() => router.push("/")}
                    >
                        Go home
                    </button>
                </div>
            </div>
        );
    }

    const availableLangs = guide.language?.available ?? (["en", "no"] as Lang[]);

    // -------------------- UI primitives --------------------
    const Shell = ({ children }: { children: React.ReactNode }) => (
        <div className="min-h-screen bg-[#070A10] text-white">
            {/* Background glow */}
            <div className="pointer-events-none fixed inset-0 opacity-60">
                <div className="absolute -top-28 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl" />
                <div className="absolute bottom-[-180px] left-12 h-[520px] w-[520px] rounded-full bg-cyan-400/15 blur-3xl" />
                <div className="absolute bottom-[-220px] right-12 h-[520px] w-[520px] rounded-full bg-indigo-500/15 blur-3xl" />
            </div>

            {/* Stable header: fixed height, no wrap */}
            <header className="sticky top-0 z-20 border-b border-white/10 bg-[#070A10]/70 backdrop-blur">
                <div className="px-4">
                    <div className="mx-auto max-w-5xl">
                        <div className="h-[72px] flex items-center justify-between gap-3">
                            <div className="min-w-0">
                                <div className="text-xs tracking-widest uppercase text-white/55">
                                    {lang === "no" ? "Leilighetsguide" : "Apartment guide"}
                                </div>
                                <h1 className="truncate text-xl font-semibold leading-tight">{tr(guide.name, lang)}</h1>
                                {guide.location ? (
                                    <p className="truncate text-sm text-white/65 leading-tight">{tr(guide.location, lang)}</p>
                                ) : null}
                            </div>

                            <div className="flex items-center gap-2 shrink-0 flex-nowrap">
                                {availableLangs.length > 1 ? (
                                    <div className="flex overflow-hidden rounded-xl border border-white/15 bg-white/5">
                                        {availableLangs.map((l) => (
                                            <button
                                                key={l}
                                                onClick={() => setLang(l)}
                                                className={[
                                                    "px-3 py-2 text-xs transition",
                                                    "min-w-[44px]",
                                                    lang === l ? "bg-white/15" : "hover:bg-white/10",
                                                ].join(" ")}
                                                aria-label={`Switch language to ${l}`}
                                            >
                                                {l.toUpperCase()}
                                            </button>
                                        ))}
                                    </div>
                                ) : null}

                                {view !== "home" ? (
                                    <button
                                        onClick={() => setRouteView("home")}
                                        className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs hover:bg-white/10"
                                        aria-label="Back"
                                    >
                                        ← {lang === "no" ? "Meny" : "Menu"}
                                    </button>
                                ) : null}

                                <button
                                    onClick={() => setRouteView("emergency")}
                                    className="rounded-xl border border-red-400/30 bg-red-500/15 px-3 py-2 text-xs hover:bg-red-500/20"
                                    aria-label="Emergency"
                                >
                                    <span className="sm:hidden">🚨</span>
                                    <span className="hidden sm:inline">🚨 {lang === "no" ? "Nødhjelp" : "Emergency"}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="relative z-10 pt-4">{children}</main>

            <footer className="relative z-10 px-4 pb-6 pt-4">
                <div className="mx-auto max-w-5xl text-center text-[11px] text-white/45">
                    {lang === "no"
                        ? "Tips: åpne én gang mens du er online → guiden fungerer selv om Wi-Fi faller ut."
                        : "Tip: open once while online → the guide still works if Wi-Fi drops."}
                </div>
            </footer>
        </div>
    );

    const Panel = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
        <div className="mx-auto mt-4 max-w-5xl px-4">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] shadow-[0_0_0_1px_rgba(255,255,255,0.03)] backdrop-blur">
                <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
                    <div className="min-w-0">
                        <div className="text-lg font-semibold">{title}</div>
                        {subtitle ? <div className="mt-1 text-sm text-white/65">{subtitle}</div> : null}
                    </div>
                </div>
                <div className="max-h-[68vh] overflow-auto p-5">{children}</div>
            </div>
        </div>
    );

    const Hex = ({
                     label,
                     hint,
                     emoji,
                     tone,
                     onClick,
                 }: {
        label: string;
        hint: string;
        emoji: string;
        tone: "red" | "blue" | "cyan" | "violet" | "white";
        onClick: () => void;
    }) => {
        const toneClass =
            tone === "red"
                ? "bg-red-500/15 border-red-400/25 hover:bg-red-500/20"
                : tone === "cyan"
                    ? "bg-cyan-500/12 border-cyan-300/20 hover:bg-cyan-500/18"
                    : tone === "violet"
                        ? "bg-violet-500/12 border-violet-300/20 hover:bg-violet-500/18"
                        : tone === "blue"
                            ? "bg-blue-500/12 border-blue-300/20 hover:bg-blue-500/18"
                            : "bg-white/6 border-white/12 hover:bg-white/10";

        return (
            <button
                onClick={onClick}
                className={`group relative grid place-items-center px-5 py-6 text-center transition-all ${toneClass}`}
                style={{ clipPath: "polygon(25% 6%, 75% 6%, 100% 50%, 75% 94%, 25% 94%, 0% 50%)" }}
                aria-label={label}
            >
                <div className="space-y-2">
                    <div className="text-2xl">{emoji}</div>

                    {/* Clamp label to 1 line so EN/NO won't reflow */}
                    <div className="text-sm font-semibold leading-tight truncate w-[10ch] mx-auto">
                        {label}
                    </div>

                    {/* Clamp hint to 2 lines */}
                    <div
                        className="mx-auto w-[16ch] text-[11px] leading-4 text-white/65"
                        style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                        }}
                    >
                        {hint}
                    </div>
                </div>

                <div
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
                    style={{
                        clipPath: "polygon(25% 6%, 75% 6%, 100% 50%, 75% 94%, 25% 94%, 0% 50%)",
                        boxShadow: "0 0 0 1px rgba(255,255,255,0.10), 0 20px 60px rgba(0,0,0,0.40)",
                    }}
                />
            </button>
        );
    };

    // -------------------- Views --------------------
    return (
        <Shell>
            {/* HOME */}
            {view === "home" ? (
                <div className="mx-auto max-w-5xl px-4">
                    <div className="mt-10 grid place-items-center">
                        <div className="relative w-full max-w-[760px]">
                            <div className="text-center space-y-2">
                                <div className="text-white/70 text-sm">
                                    {lang === "no" ? "Trykk på en seksjon. Store knapper. Ingen leting." : "Tap a section. Big buttons. No hunting."}
                                </div>
                            </div>

                            {/* Hex ring */}
                            <div className="mt-8 grid place-items-center">
                                <div
                                    className="relative"
                                    style={{
                                        width: "min(92vw, 520px)",
                                        height: "min(92vw, 520px)",
                                    }}
                                >
                                    {/* CENTER */}
                                    <div
                                        className="absolute left-1/2 top-1/2"
                                        style={{
                                            transform: "translate(-50%, -50%)",
                                            width: "clamp(118px, 26vw, 170px)",
                                            height: "clamp(118px, 26vw, 170px)",
                                        }}
                                    >
                                        <Hex
                                            label="Wi-Fi"
                                            hint={lang === "no" ? "Nettverk + passord" : "Network + password"}
                                            emoji="📶"
                                            tone="blue"
                                            onClick={() => setRouteView("wifi")}
                                        />
                                    </div>

                                    {/* TOP = Rules */}
                                    <div
                                        className="absolute left-1/2 top-[3%]"
                                        style={{
                                            transform: "translate(-50%, 0)",
                                            width: "clamp(112px, 24vw, 165px)",
                                            height: "clamp(112px, 24vw, 165px)",
                                        }}
                                    >
                                        <Hex
                                            label={lang === "no" ? "Regler" : "House rules"}
                                            hint={lang === "no" ? "Les først" : "Read first"}
                                            emoji="🏠"
                                            tone="violet"
                                            onClick={() => setRouteView("rules")}
                                        />
                                    </div>

                                    {/* RIGHT = Emergency */}
                                    <div
                                        className="absolute right-[3%] top-1/2"
                                        style={{
                                            transform: "translate(0, -50%)",
                                            width: "clamp(112px, 24vw, 165px)",
                                            height: "clamp(112px, 24vw, 165px)",
                                        }}
                                    >
                                        <Hex
                                            label={lang === "no" ? "Nødhjelp" : "Emergency"}
                                            hint={lang === "no" ? "Vann • strøm" : "Water • power"}
                                            emoji="🚨"
                                            tone="red"
                                            onClick={() => setRouteView("emergency")}
                                        />
                                    </div>

                                    {/* BOTTOM = Checkout */}
                                    <div
                                        className="absolute left-1/2 bottom-[3%]"
                                        style={{
                                            transform: "translate(-50%, 0)",
                                            width: "clamp(112px, 24vw, 165px)",
                                            height: "clamp(112px, 24vw, 165px)",
                                        }}
                                    >
                                        <Hex
                                            label={lang === "no" ? "Utsjekk" : "Checkout"}
                                            hint={lang === "no" ? "Før du drar" : "Before you leave"}
                                            emoji="🧾"
                                            tone="white"
                                            onClick={() => setRouteView("checkout")}
                                        />
                                    </div>

                                    {/* LEFT = Find */}
                                    <div
                                        className="absolute left-[3%] top-1/2"
                                        style={{
                                            transform: "translate(0, -50%)",
                                            width: "clamp(112px, 24vw, 165px)",
                                            height: "clamp(112px, 24vw, 165px)",
                                        }}
                                    >
                                        <Hex
                                            label={lang === "no" ? "Hvor er…" : "Find items"}
                                            hint={lang === "no" ? "Ting • steder" : "Tools • locations"}
                                            emoji="🔎"
                                            tone="cyan"
                                            onClick={() => setRouteView("find")}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Quick contacts */}
                            <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="text-sm">
                    <span className="text-white/60">
                      {lang === "no" ? "Trenger du hjelp?" : "Need help fast?"}
                    </span>{" "}
                                        <span className="font-medium">
                      {lang === "no" ? "Kontakt verten." : "Contact the host."}
                    </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {guide.emergency.contacts.map((c) => (
                                            <a
                                                key={tr(c.label, "en") + c.value}
                                                href={contactHref(c)}
                                                className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs hover:bg-white/10"
                                            >
                                                {tr(c.label, lang)}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Honest note about photos */}
                            <div className="mt-3 text-center text-[11px] text-white/45">
                                {lang === "no"
                                    ? "Fungerer offline etter første åpning • Bilder krever internett"
                                    : "Works offline after first open • Photos require internet"}
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}

            {/* EMERGENCY */}
            {view === "emergency" ? (
                <Panel
                    title={lang === "no" ? "🚨 Nødhjelp" : "🚨 Emergency"}
                    subtitle={
                        lang === "no"
                            ? "Raske trinn + hvor ting er. Hvis det er farlig: gå ut og ring nødetatene."
                            : "Quick steps + where things are. If it’s dangerous, leave and call emergency services."
                    }
                >
                    {guide.emergency.safetyNotes?.length ? (
                        <div className="mb-4 space-y-2">
                            {guide.emergency.safetyNotes.map((n, i) => (
                                <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm text-white/75">
                                    {tr(n, lang)}
                                </div>
                            ))}
                        </div>
                    ) : null}

                    <div className="mb-5 flex flex-wrap gap-2">
                        {guide.emergency.contacts.map((c) => (
                            <a
                                key={tr(c.label, "en") + c.value}
                                href={contactHref(c)}
                                className="rounded-2xl border border-red-400/25 bg-red-500/10 px-3 py-2 text-xs hover:bg-red-500/15"
                            >
                                {tr(c.label, lang)} <span className="text-white/60">({c.value})</span>
                            </a>
                        ))}
                    </div>

                    {guide.emergency.doNot?.length ? (
                        <div className="mb-5 rounded-2xl border border-yellow-300/15 bg-yellow-500/10 p-4">
                            <div className="text-sm font-semibold">{lang === "no" ? "Ikke gjør dette" : "Do NOT do this"}</div>
                            <ul className="mt-2 list-disc pl-5 text-sm text-white/75 space-y-1">
                                {guide.emergency.doNot.map((d, i) => (
                                    <li key={i}>{tr(d, lang)}</li>
                                ))}
                            </ul>
                        </div>
                    ) : null}

                    <div className="grid gap-4 md:grid-cols-2">
                        {guide.emergency.items.map((item) => (
                            <div key={item.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                                <div className="min-w-0">
                                    <div className="font-semibold">{tr(item.title, lang)}</div>
                                    <div className="mt-1 text-sm text-white/65">
                                        <span className="text-white/80">📍</span> {tr(item.locationText, lang)}
                                    </div>
                                </div>

                                <div className="mt-3">
                                    <SmartImage src={item.imageUrl} alt={tr(item.title, lang)} heightClass="h-44" />
                                </div>

                                <ol className="mt-3 space-y-2 text-sm">
                                    {item.steps.map((s, idx) => (
                                        <li key={idx} className="flex gap-2">
                      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[11px]">
                        {idx + 1}
                      </span>
                                            <span className="text-white/80">{tr(s, lang)}</span>
                                        </li>
                                    ))}
                                </ol>

                                {item.stopAndCall?.length ? (
                                    <div className="mt-4 rounded-2xl border border-red-400/20 bg-red-500/10 p-3">
                                        <div className="text-xs font-semibold tracking-wide text-white/85">
                                            {lang === "no" ? "STOPP og ring hvis:" : "STOP and call if:"}
                                        </div>
                                        <ul className="mt-2 list-disc pl-5 text-sm text-white/75 space-y-1">
                                            {item.stopAndCall.map((x, i) => (
                                                <li key={i}>{tr(x, lang)}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : null}
                            </div>
                        ))}
                    </div>
                </Panel>
            ) : null}

            {/* FIND */}
            {view === "find" ? (
                <Panel
                    title={lang === "no" ? "🔎 Hvor er…" : "🔎 Find items"}
                    subtitle={lang === "no" ? "Søk etter navn, kategori eller sted." : "Search by name, category, or location."}
                >
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={lang === "no" ? 'Prøv "tang", "sikring", "under vask"...' : 'Try "pliers", "breaker", "under sink"...'}
                            className="w-full rounded-2xl border border-white/12 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/35 focus:border-white/20"
                        />
                        <button onClick={() => setQuery("")} className="rounded-2xl border border-white/12 bg-white/5 px-4 py-3 text-sm hover:bg-white/10">
                            {lang === "no" ? "Tøm" : "Clear"}
                        </button>
                    </div>

                    {/* Photos availability note */}
                    {!online ? (
                        <div className="mb-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm text-white/70">
                            {lang === "no"
                                ? "Du er offline — bilder lastes ikke inn. Teksten fungerer fortsatt."
                                : "You’re offline — photos won’t load. Text still works."}
                        </div>
                    ) : null}

                    <div className="grid gap-4 md:grid-cols-2">
                        {filteredItems.map((it) => (
                            <div key={it.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                                <div className="flex items-start gap-3">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="font-semibold">{tr(it.title, lang)}</div>
                                            <div className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-white/60">
                                                {it.categoryName}
                                            </div>
                                        </div>
                                        <div className="mt-1 text-sm text-white/65">
                                            <span className="text-white/80">📍</span> {clampText(tr(it.locationText, lang), 120)}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-3">
                                    <SmartImage src={it.imageUrl} alt={tr(it.title, lang)} heightClass="h-40" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredItems.length === 0 ? (
                        <div className="mt-6 text-center text-sm text-white/60">{lang === "no" ? "Ingen treff." : "No matches."}</div>
                    ) : null}
                </Panel>
            ) : null}

            {/* WIFI */}
            {view === "wifi" ? (
                <Panel title="📶 Wi-Fi" subtitle={lang === "no" ? "Trykk for å kopiere." : "Tap to copy."}>
                    {guide.wifi ? (
                        <div className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <CopyCard lang={lang} label={lang === "no" ? "Nettverk" : "Network"} value={guide.wifi.name} />
                                <CopyCard lang={lang} label={lang === "no" ? "Passord" : "Password"} value={guide.wifi.password} />
                            </div>

                            {guide.wifi.troubleshooting?.length ? (
                                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                                    <div className="text-sm font-semibold">{lang === "no" ? "Hvis det ikke virker" : "If it doesn’t work"}</div>
                                    <ul className="mt-2 list-disc pl-5 text-sm text-white/75 space-y-1">
                                        {guide.wifi.troubleshooting.map((x, i) => (
                                            <li key={i}>{tr(x, lang)}</li>
                                        ))}
                                    </ul>
                                </div>
                            ) : null}
                        </div>
                    ) : (
                        <div className="text-sm text-white/65">{lang === "no" ? "Wi-Fi er ikke satt." : "Wi-Fi info not set yet."}</div>
                    )}
                </Panel>
            ) : null}

            {/* RULES */}
            {view === "rules" ? (
                <Panel title={lang === "no" ? "🏠 Regler" : "🏠 House rules"} subtitle={lang === "no" ? "Vennligst følg dette." : "Please follow these to avoid issues."}>
                    {guide.rules?.length ? (
                        <div className="grid gap-3">
                            {guide.rules.map((r, i) => (
                                <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/80">
                                    <span className="mr-2 text-white/60">•</span>
                                    {tr(r, lang)}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-sm text-white/65">{lang === "no" ? "Ingen regler lagt inn." : "No rules listed yet."}</div>
                    )}
                </Panel>
            ) : null}

            {/* CHECKOUT */}
            {view === "checkout" ? (
                <Panel title={lang === "no" ? "🧾 Utsjekk" : "🧾 Checkout"} subtitle={lang === "no" ? "Gjør dette før du drar." : "Do these before leaving."}>
                    {guide.checkout?.length ? (
                        <div className="grid gap-3 md:grid-cols-2">
                            {guide.checkout.map((c, i) => (
                                <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[11px]">
                                            {i + 1}
                                        </div>
                                        <div className="text-white/80">{tr(c, lang)}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-sm text-white/65">{lang === "no" ? "Ingen sjekkliste lagt inn." : "No checkout checklist yet."}</div>
                    )}
                </Panel>
            ) : null}
        </Shell>
    );
}

// Inline component outside main return so it doesn't re-mount weirdly
function CopyCard({ label, value, lang }: { label: string; value: string; lang: "en" | "no" }) {
    const [copied, setCopied] = useState(false);

    const doCopy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1200);
        } catch {
            // ignore
        }
    };

    return (
        <button onClick={doCopy} className="group rounded-3xl border border-white/10 bg-white/[0.03] p-5 text-left hover:bg-white/[0.05]">
            <div className="text-xs uppercase tracking-widest text-white/55">{label}</div>
            <div className="mt-2 font-mono text-lg font-semibold text-white">{value}</div>
            <div className="mt-2 text-[11px] text-white/50">
                {copied ? (lang === "no" ? "Kopiert" : "Copied") : (lang === "no" ? "Trykk for å kopiere" : "Tap to copy")}
            </div>
        </button>
    );
}
