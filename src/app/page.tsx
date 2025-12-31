/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Lang = "en" | "no";

const COPY = {
    en: {
        badge: "Smart stay • Instant guide • Emergency ready",
        title: "Nordic Fjord View Apartment",
        sub:
            "Experience Northern Norway in modern comfort — with a digital guide that helps you instantly find Wi-Fi, tools, and emergency shutoffs.",
        ctaBook: "Book on Airbnb",
        ctaGuide: "Get Apartment Guide",
        trust1: "Works offline after first open",
        trust2: "1-tap emergency contacts",
        trust3: "Find tools + shutoffs fast",
        scroll: "Scroll",

        featuresTitle: "What Makes This Place Special",
        featuresSub: "Designed for comfort — and a smoother stay for guests.",
        f1Title: "Mountain Views",
        f1Desc: "Wake up to breathtaking views of the Norwegian mountains.",
        f2Title: "Prime Location",
        f2Desc: "5-minute walk to downtown Narvik, close to ski lifts.",
        f3Title: "Modern Comfort",
        f3Desc: "Fully equipped kitchen, fast Wi-Fi, and heated floors.",

        galleryTitle: "Inside the Apartment",
        gallerySub: "A clean, bright space with everything ready.",
        g1Title: "Modern Living Room",
        g1Sub: "Smart TV & cozy fireplace",
        g2Title: "Fully Equipped Kitchen",
        g2Sub: "Everything you need to cook",
        g3Title: "Comfortable Bedroom",
        g3Sub: "Queen bed with mountain view",

        guideTitle: "Your stay, simplified.",
        guideSub:
            "One tap to Wi-Fi. One tap to emergency contacts. Find shutoffs, tools, and house rules instantly.",
        cardBook: "Book Your Stay",
        cardBookDesc: "Reserve on Airbnb for the best rates.",
        cardGuide: "Apartment Guide",
        cardGuideDesc: "Wi-Fi, emergency info, house manual.",
        cardLocal: "Local Guide",
        cardLocalDesc: "Restaurants, hikes, and attractions.",
        open: "Open →",
        scan: "Scan the QR code in the apartment to access the guide anytime.",
        scanMe: "Scan Me",

        localTitle: "Explore Narvik & Surroundings",
        localSub: "A few highlights to start your trip.",
        activities: "Top Activities",
        a1Title: "Narvikfjellet Ski Resort",
        a1Desc: "10-minute drive. World-class skiing with fjord views.",
        a2Title: "Narvik Cable Car",
        a2Desc: "Panoramic views from 656m above sea level.",
        a3Title: "Fjord Kayaking",
        a3Desc: "Guided tours available. Northern Lights from the water (seasonal).",

        eats: "Local Eats",
        e1Title: "Fiskehallen",
        e1Desc: "Fresh local seafood. Try the Arctic char.",
        e2Title: "Kaffebrenneriet",
        e2Desc: "Great coffee + cozy atmosphere.",
        e3Title: "Peppes Pizza",
        e3Desc: "Family-friendly. Great after skiing.",

        finalTitle: "Start Your Northern Adventure",
        finalSub: "Book now and get the digital apartment guide for a seamless stay.",
        finalGuide: "View Apartment Guide",
        questions: "Questions? Contact host at",
        footer: "Narvik, Norway • Perfect for families, couples, and adventurers",
    },
    no: {
        badge: "Smart opphold • Digital guide • Klar for nødsituasjoner",
        title: "Nordisk Fjordutsikt Leilighet",
        sub:
            "Opplev Nord-Norge med moderne komfort — med en digital guide som hjelper deg å finne Wi-Fi, verktøy og stoppekraner raskt.",
        ctaBook: "Bestill på Airbnb",
        ctaGuide: "Åpne leilighetsguide",
        trust1: "Fungerer offline etter første åpning",
        trust2: "Nød-kontakter med 1 trykk",
        trust3: "Finn verktøy + stoppekraner raskt",
        scroll: "Rull",

        featuresTitle: "Hva gjør dette stedet spesielt",
        featuresSub: "Laget for komfort — og et enklere opphold for gjester.",
        f1Title: "Utsikt mot fjell",
        f1Desc: "Våkn opp til fantastisk utsikt over norske fjell.",
        f2Title: "Perfekt beliggenhet",
        f2Desc: "5 minutter til sentrum, nær skitrekk.",
        f3Title: "Moderne komfort",
        f3Desc: "Fullt utstyrt kjøkken, rask Wi-Fi og varme gulv.",

        galleryTitle: "Inne i leiligheten",
        gallerySub: "Ren, lys og klar for deg.",
        g1Title: "Moderne stue",
        g1Sub: "Smart-TV og koselig peis",
        g2Title: "Fullt utstyrt kjøkken",
        g2Sub: "Alt du trenger for å lage mat",
        g3Title: "Komfortabelt soverom",
        g3Sub: "Dobbeltseng med fjellutsikt",

        guideTitle: "Oppholdet ditt, gjort enkelt.",
        guideSub:
            "Ett trykk til Wi-Fi. Ett trykk til nødkontakter. Finn stoppekraner, verktøy og husregler med en gang.",
        cardBook: "Bestill opphold",
        cardBookDesc: "Reserver på Airbnb for beste priser.",
        cardGuide: "Leilighetsguide",
        cardGuideDesc: "Wi-Fi, nødinfo, husmanual.",
        cardLocal: "Lokale tips",
        cardLocalDesc: "Restauranter, turer og attraksjoner.",
        open: "Åpne →",
        scan: "Skann QR-koden i leiligheten for å åpne guiden når som helst.",
        scanMe: "Skann meg",

        localTitle: "Utforsk Narvik og området",
        localSub: "Noen høydepunkter for å komme i gang.",
        activities: "Topp aktiviteter",
        a1Title: "Narvikfjellet Skisenter",
        a1Desc: "10 minutter med bil. Ski i verdensklasse med fjordutsikt.",
        a2Title: "Narvik gondol",
        a2Desc: "Panoramautsikt fra 656 meter over havet.",
        a3Title: "Padling i fjorden",
        a3Desc: "Guidede turer. Nordlys fra vannet (sesong).",

        eats: "Lokale spisesteder",
        e1Title: "Fiskehallen",
        e1Desc: "Fersk sjømat. Prøv røye fra nord.",
        e2Title: "Kaffebrenneriet",
        e2Desc: "God kaffe og koselig atmosfære.",
        e3Title: "Peppes Pizza",
        e3Desc: "Familievennlig. Perfekt etter ski.",

        finalTitle: "Start ditt nordnorske eventyr",
        finalSub: "Bestill nå og få digital guide for et sømløst opphold.",
        finalGuide: "Se leilighetsguide",
        questions: "Spørsmål? Kontakt vert på",
        footer: "Narvik, Norge • Perfekt for familier, par og eventyrere",
    },
} as const;

function cx(...parts: Array<string | false | null | undefined>) {
    return parts.filter(Boolean).join(" ");
}

function Icon({
                  name,
                  className,
              }: {
    name:
        | "home"
        | "qr"
        | "spark"
        | "mountain"
        | "pin"
        | "shield"
        | "camera"
        | "utensils"
        | "ski"
        | "cable"
        | "kayak"
        | "coffee";
    className?: string;
}) {
    const common = "h-6 w-6";
    const cn = className ? `${common} ${className}` : common;

    switch (name) {
        case "home":
            return (
                <svg className={cn} viewBox="0 0 24 24" fill="none">
                    <path
                        d="M4 10.5 12 3l8 7.5V20a1 1 0 0 1-1 1h-5v-7H10v7H5a1 1 0 0 1-1-1v-9.5Z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinejoin="round"
                    />
                </svg>
            );
        case "qr":
            return (
                <svg className={cn} viewBox="0 0 24 24" fill="none">
                    <path d="M4 4h6v6H4V4Z" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M14 4h6v6h-6V4Z" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M4 14h6v6H4v-6Z" stroke="currentColor" strokeWidth="1.8" />
                    <path
                        d="M14 14h2v2h-2v-2Zm4 0h2v2h-2v-2Zm-4 4h2v2h-2v-2Zm4 4h2"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                    />
                </svg>
            );
        case "spark":
            return (
                <svg className={cn} viewBox="0 0 24 24" fill="none">
                    <path
                        d="M12 2l1.6 6.2L20 10l-6.4 1.8L12 18l-1.6-6.2L4 10l6.4-1.8L12 2Z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinejoin="round"
                    />
                </svg>
            );
        case "mountain":
            return (
                <svg className={cn} viewBox="0 0 24 24" fill="none">
                    <path
                        d="M3 20 10.5 6l3 5 1.5-2 6 11H3Z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinejoin="round"
                    />
                </svg>
            );
        case "pin":
            return (
                <svg className={cn} viewBox="0 0 24 24" fill="none">
                    <path
                        d="M12 21s7-4.4 7-11a7 7 0 1 0-14 0c0 6.6 7 11 7 11Z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinejoin="round"
                    />
                    <path d="M12 10.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" stroke="currentColor" strokeWidth="1.8" />
                </svg>
            );
        case "shield":
            return (
                <svg className={cn} viewBox="0 0 24 24" fill="none">
                    <path
                        d="M12 2 20 6v7c0 5-3.6 8.6-8 9-4.4-.4-8-4-8-9V6l8-4Z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinejoin="round"
                    />
                </svg>
            );
        case "camera":
            return (
                <svg className={cn} viewBox="0 0 24 24" fill="none">
                    <path
                        d="M4 7h3l2-2h6l2 2h3v13H4V7Z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinejoin="round"
                    />
                    <path d="M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" strokeWidth="1.8" />
                </svg>
            );
        case "utensils":
            return (
                <svg className={cn} viewBox="0 0 24 24" fill="none">
                    <path d="M6 2v8M9 2v8M6 6h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M14 2v10c0 2 1 3 3 3v7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
            );
        case "ski":
            return (
                <svg className={cn} viewBox="0 0 24 24" fill="none">
                    <path d="M6 3v7M10 3v7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M4 14c4 4 12 4 16 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M5 17c4 4 10 4 14 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
            );
        case "cable":
            return (
                <svg className={cn} viewBox="0 0 24 24" fill="none">
                    <path d="M6 20c0-8 12-8 12 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M9 12l3-8 3 8" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                </svg>
            );
        case "kayak":
            return (
                <svg className={cn} viewBox="0 0 24 24" fill="none">
                    <path d="M4 14c4-4 12-4 16 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M12 6v12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M9 8l3-2 3 2" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                </svg>
            );
        case "coffee":
            return (
                <svg className={cn} viewBox="0 0 24 24" fill="none">
                    <path d="M4 8h12v7a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8Z" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M16 9h2a2 2 0 0 1 0 4h-2" stroke="currentColor" strokeWidth="1.8" />
                    <path
                        d="M6 3c1 1 1 2 0 3M10 3c1 1 1 2 0 3M14 3c1 1 1 2 0 3"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                    />
                </svg>
            );
    }
}

export default function HomePage() {
    const [lang, setLang] = useState<Lang>("en");

    // Persist language choice
    useEffect(() => {
        try {
            const saved = window.localStorage.getItem("lang");
            if (saved === "en" || saved === "no") setLang(saved);
        } catch {
            // ignore
        }
    }, []);

    useEffect(() => {
        try {
            window.localStorage.setItem("lang", lang);
        } catch {
            // ignore
        }
    }, [lang]);

    const heroRef = useRef<HTMLDivElement | null>(null);
    const heroBgRef = useRef<HTMLDivElement | null>(null);
    const heroFgRef = useRef<HTMLDivElement | null>(null);

    const sectionsRef = useRef<Array<HTMLElement | null>>([]);
    sectionsRef.current = [];

    const registerSection = (el: HTMLElement | null) => {
        if (!el) return;
        sectionsRef.current.push(el);
    };

    const prefersReducedMotion = useMemo(() => {
        if (typeof window === "undefined") return false;
        return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    }, []);

    useEffect(() => {
        if (prefersReducedMotion) return;

        const ctx = gsap.context(() => {
            // HERO entrance
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
            tl.fromTo(".hero-badge", { y: 10, opacity: 0, filter: "blur(6px)" }, { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.7 })
                .fromTo(".hero-title", { y: 28, opacity: 0, filter: "blur(10px)" }, { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.9 }, "-=0.35")
                .fromTo(".hero-sub", { y: 18, opacity: 0, filter: "blur(8px)" }, { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.75 }, "-=0.55")
                .fromTo(".hero-cta", { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65, stagger: 0.08 }, "-=0.45")
                .fromTo(".scroll-indicator", { opacity: 0 }, { opacity: 1, duration: 0.5 }, "-=0.2");

            // HERO parallax (scroll)
            if (heroRef.current && heroBgRef.current && heroFgRef.current) {
                gsap.to(heroBgRef.current, {
                    yPercent: 10,
                    ease: "none",
                    scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: true },
                });

                gsap.to(heroFgRef.current, {
                    yPercent: -6,
                    ease: "none",
                    scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: true },
                });
            }

            // Section reveals
            sectionsRef.current.forEach((el) => {
                if (!el) return;
                const items = el.querySelectorAll(".reveal");
                gsap.fromTo(
                    items,
                    { y: 18, opacity: 0, filter: "blur(8px)" },
                    {
                        y: 0,
                        opacity: 1,
                        filter: "blur(0px)",
                        duration: 0.9,
                        stagger: 0.08,
                        ease: "power3.out",
                        scrollTrigger: { trigger: el, start: "top 78%", end: "bottom 55%", toggleActions: "play none none reverse" },
                    }
                );
            });

            // Gallery hover micro-motion
            gsap.utils.toArray<HTMLElement>(".gallery-card").forEach((card) => {
                const enter = () => gsap.to(card, { y: -6, duration: 0.25, ease: "power2.out" });
                const leave = () => { gsap.to(card, { y: 0, duration: 0.25, ease: "power2.out" }); };


                card.addEventListener("mouseenter", enter);
                card.addEventListener("mouseleave", leave);

                ScrollTrigger.addEventListener("refreshInit", leave);
            });
        }, heroRef);

        return () => ctx.revert();
    }, [prefersReducedMotion, lang]);

    const C = COPY[lang];

    return (
        <div className="min-h-screen bg-white text-gray-900">
            {/* HERO */}
            <section ref={heroRef} className="relative h-[100svh] overflow-hidden">
                {/* Language toggle */}
                <div className="absolute left-0 right-0 top-0 z-20 px-4 pt-4">
                    <div className="mx-auto max-w-6xl flex items-center justify-end">
                        <div className="overflow-hidden rounded-2xl border border-white/20 bg-white/10 backdrop-blur">
                            <button
                                onClick={() => setLang("en")}
                                className={cx(
                                    "px-4 py-2 text-xs font-semibold transition",
                                    lang === "en" ? "bg-white/20 text-white" : "text-white/80 hover:bg-white/10"
                                )}
                                aria-label="Switch language to English"
                            >
                                EN
                            </button>
                            <button
                                onClick={() => setLang("no")}
                                className={cx(
                                    "px-4 py-2 text-xs font-semibold transition",
                                    lang === "no" ? "bg-white/20 text-white" : "text-white/80 hover:bg-white/10"
                                )}
                                aria-label="Bytt språk til norsk"
                            >
                                NO
                            </button>
                        </div>
                    </div>
                </div>

                {/* Background image layer */}
                <div
                    ref={heroBgRef}
                    className="absolute inset-0 scale-[1.06]"
                    style={{
                        backgroundImage: "url(https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1920)",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                />

                {/* Contrast overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-black/70" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.25),transparent_55%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(244,63,94,0.18),transparent_60%)]" />

                {/* Foreground content */}
                <div ref={heroFgRef} className="relative z-10 flex h-full items-center justify-center px-4">
                    <div className="mx-auto w-full max-w-5xl text-center text-white">
                        <div className="hero-badge mx-auto inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs text-white/85 backdrop-blur">
                            <Icon name="spark" className="h-4 w-4 text-white/90" />
                            <span>{C.badge}</span>
                        </div>

                        <h1 className="hero-title mt-6 text-4xl font-semibold tracking-tight md:text-6xl">{C.title}</h1>

                        <p className="hero-sub mt-4 text-base text-white/80 md:text-xl">{C.sub}</p>

                        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                            <a
                                href="https://airbnb.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cx(
                                    "hero-cta group inline-flex items-center gap-3 rounded-2xl px-6 py-4 text-sm font-semibold shadow-xl",
                                    "bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700",
                                    "ring-1 ring-white/10 transition-transform hover:scale-[1.02] active:scale-[0.99]"
                                )}
                            >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/15">
                  <Icon name="home" className="h-5 w-5 text-white" />
                </span>
                                <span>{C.ctaBook}</span>
                                <span className="text-white/70">→</span>
                            </a>

                            <a
                                href="#guide"
                                className={cx(
                                    "hero-cta group inline-flex items-center gap-3 rounded-2xl px-6 py-4 text-sm font-semibold",
                                    "border border-white/25 bg-white/10 backdrop-blur hover:bg-white/15",
                                    "transition-transform hover:scale-[1.02] active:scale-[0.99]"
                                )}
                            >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
                  <Icon name="qr" className="h-5 w-5 text-white" />
                </span>
                                <span>{C.ctaGuide}</span>
                            </a>
                        </div>

                        <div className="mt-10 flex flex-wrap items-center justify-center gap-2 text-xs text-white/75">
                            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-2 backdrop-blur">{C.trust1}</span>
                            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-2 backdrop-blur">{C.trust2}</span>
                            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-2 backdrop-blur">{C.trust3}</span>
                        </div>
                    </div>
                </div>

                <div className="scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2">
                    <div className="flex flex-col items-center gap-2 text-white/70">
                        <div className="h-10 w-6 rounded-full border border-white/40 p-1">
                            <div className="mx-auto h-3 w-1 rounded-full bg-white/80 animate-[bounce_1.4s_infinite]" />
                        </div>
                        <div className="text-[11px] tracking-wide">{C.scroll}</div>
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section ref={registerSection} className="py-20">
                <div className="mx-auto max-w-6xl px-4">
                    <div className="reveal text-center">
                        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{C.featuresTitle}</h2>
                        <p className="mt-3 text-gray-600 md:text-lg">{C.featuresSub}</p>
                    </div>

                    <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
                        {[
                            { icon: "mountain", title: C.f1Title, desc: C.f1Desc, tone: "from-blue-50 to-blue-100 text-blue-700" },
                            { icon: "pin", title: C.f2Title, desc: C.f2Desc, tone: "from-emerald-50 to-emerald-100 text-emerald-700" },
                            { icon: "shield", title: C.f3Title, desc: C.f3Desc, tone: "from-violet-50 to-violet-100 text-violet-700" },
                        ].map((f, idx) => (
                            <div key={idx} className="reveal rounded-3xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className={cx("inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br", f.tone)}>
                                    <Icon name={f.icon as any} className="h-6 w-6" />
                                </div>
                                <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
                                <p className="mt-2 text-sm leading-6 text-gray-600">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* GALLERY */}
            <section ref={registerSection} className="bg-gray-50 py-16">
                <div className="mx-auto max-w-6xl px-4">
                    <div className="reveal text-center">
                        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{C.galleryTitle}</h2>
                        <p className="mt-3 text-gray-600 md:text-lg">{C.gallerySub}</p>
                    </div>

                    <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {[
                            {
                                img: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800",
                                title: C.g1Title,
                                sub: C.g1Sub,
                            },
                            {
                                img: "https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&w=800",
                                title: C.g2Title,
                                sub: C.g2Sub,
                            },
                            {
                                img: "https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg?auto=compress&cs=tinysrgb&w=800",
                                title: C.g3Title,
                                sub: C.g3Sub,
                            },
                        ].map((g, idx) => (
                            <div key={idx} className="reveal gallery-card overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
                                <div className="relative">
                                    <img src={g.img} alt={g.title} className="h-64 w-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent opacity-70" />
                                </div>
                                <div className="p-5">
                                    <h4 className="text-base font-semibold">{g.title}</h4>
                                    <p className="mt-1 text-sm text-gray-600">{g.sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* GUIDE CTA */}
            <section
                id="guide"
                ref={registerSection}
                className="relative overflow-hidden py-20"
                style={{
                    backgroundImage: "url(https://images.pexels.com/photos/189349/pexels-photo-189349.jpeg?auto=compress&cs=tinysrgb&w=1920)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundAttachment: "fixed",
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-950/80 via-indigo-950/75 to-purple-950/80" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.22),transparent_60%)]" />

                <div className="relative z-10 mx-auto max-w-6xl px-4 text-white">
                    <div className="reveal mx-auto max-w-3xl text-center">
                        <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">{C.guideTitle}</h2>
                        <p className="mt-4 text-base text-white/80 md:text-lg">{C.guideSub}</p>
                    </div>

                    <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
                        {[
                            { title: C.cardBook, desc: C.cardBookDesc, icon: "home", href: "https://airbnb.com", external: true },
                            { title: C.cardGuide, desc: C.cardGuideDesc, icon: "qr", href: "/g/narvik", external: false },
                            { title: C.cardLocal, desc: C.cardLocalDesc, icon: "pin", href: "#local-guide", external: false },
                        ].map((c, idx) => (
                            <a
                                key={idx}
                                href={c.href}
                                target={c.external ? "_blank" : undefined}
                                rel={c.external ? "noopener noreferrer" : undefined}
                                className={cx(
                                    "reveal group rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur",
                                    "hover:bg-white/14 hover:border-white/25 transition-transform hover:scale-[1.02] active:scale-[0.99]"
                                )}
                            >
                                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                                    <Icon name={c.icon as any} className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="mt-4 text-lg font-semibold">{c.title}</h3>
                                <p className="mt-2 text-sm text-white/75">{c.desc}</p>
                                <div className="mt-4 text-sm text-white/80">{C.open}</div>
                            </a>
                        ))}
                    </div>

                    <div className="reveal mt-12 text-center">
                        <p className="text-white/85">{C.scan}</p>
                        <div className="mt-5 inline-block rounded-3xl bg-white p-4 shadow-2xl">
                            <div className="grid h-52 w-52 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600">
                                <div className="text-center">
                                    <div className="mx-auto mb-2 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
                                        <Icon name="qr" className="h-7 w-7 text-white" />
                                    </div>
                                    <div className="font-semibold text-white">{C.scanMe}</div>
                                    <div className="mt-1 text-xs text-white/85">apartment.guide/narvik</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* LOCAL GUIDE */}
            <section id="local-guide" ref={registerSection} className="py-20">
                <div className="mx-auto max-w-6xl px-4">
                    <div className="reveal text-center">
                        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{C.localTitle}</h2>
                        <p className="mt-3 text-gray-600 md:text-lg">{C.localSub}</p>
                    </div>

                    <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-2">
                        <div className="reveal rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                                    <Icon name="ski" className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-semibold">{C.activities}</h3>
                            </div>

                            <div className="mt-6 space-y-5">
                                {[
                                    { icon: "mountain", title: C.a1Title, desc: C.a1Desc },
                                    { icon: "cable", title: C.a2Title, desc: C.a2Desc },
                                    { icon: "kayak", title: C.a3Title, desc: C.a3Desc },
                                ].map((a, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 text-gray-800">
                                            <Icon name={a.icon as any} className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <div className="font-semibold">{a.title}</div>
                                            <div className="mt-1 text-sm text-gray-600">{a.desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="reveal rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-700">
                                    <Icon name="utensils" className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-semibold">{C.eats}</h3>
                            </div>

                            <div className="mt-6 space-y-5">
                                {[
                                    { icon: "utensils", title: C.e1Title, desc: C.e1Desc },
                                    { icon: "coffee", title: C.e2Title, desc: C.e2Desc },
                                    { icon: "camera", title: C.e3Title, desc: C.e3Desc },
                                ].map((a, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 text-gray-800">
                                            <Icon name={a.icon as any} className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <div className="font-semibold">{a.title}</div>
                                            <div className="mt-1 text-sm text-gray-600">{a.desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16 text-white">
                <div className="mx-auto max-w-4xl px-4 text-center">
                    <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{C.finalTitle}</h2>
                    <p className="mt-4 text-base text-blue-100 md:text-lg">{C.finalSub}</p>

                    <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <a
                            href="https://airbnb.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 rounded-2xl bg-white px-6 py-4 text-sm font-semibold text-blue-700 shadow-xl transition-transform hover:scale-[1.02] active:scale-[0.99]"
                        >
                            <Icon name="home" className="h-5 w-5 text-blue-700" />
                            {C.ctaBook}
                        </a>
                        <a
                            href="/g/narvik"
                            className="inline-flex items-center gap-3 rounded-2xl border border-white/35 bg-white/10 px-6 py-4 text-sm font-semibold backdrop-blur transition-transform hover:scale-[1.02] active:scale-[0.99]"
                        >
                            <Icon name="qr" className="h-5 w-5 text-white" />
                            {C.finalGuide}
                        </a>
                    </div>

                    <div className="mt-12 border-t border-white/25 pt-8 text-sm text-blue-100">
                        {C.questions} <span className="font-semibold text-white">+47 123 45 678</span>
                        <div className="mt-2 text-xs text-blue-200">{C.footer}</div>
                    </div>
                </div>
            </section>
        </div>
    );
}
