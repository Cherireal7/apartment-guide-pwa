Apartment Guide PWA 🏡📱

A modern, offline-friendly apartment guide built with Next.js and PWA technology, designed for short-term rentals (Airbnb, Booking, serviced apartments).

Guests scan a QR code and instantly get:

Wi-Fi details

House rules

Emergency instructions

Where things are located

Checkout checklist

Local recommendations

All without installing an app.

✨ Why This Exists

Most guests:

Don’t read printed manuals

Lose Wi-Fi info

Panic in emergencies

Ask the same questions repeatedly

This project solves that by providing:

One simple digital guide

Works offline after first open

Mobile-first, big buttons, zero friction

Supports multiple languages (EN / NO)

🧠 Core Features
🏠 Apartment Guide

House rules (shown first for UX)

Checkout checklist

Clear, readable layout

📶 Wi-Fi

Network name & password

One-tap copy

Optional troubleshooting notes

🚨 Emergency

Emergency contacts (phone / WhatsApp)

Visual instructions (images)

Step-by-step actions

“STOP & CALL” warnings for dangerous situations

🔎 Find Items

Search tools, appliances, safety equipment

Location descriptions

Category grouping

Image previews

🌍 Multi-Language

English & Norwegian support

Language toggle (no layout jump)

Content driven from JSON

⚡ PWA (Progressive Web App)

Offline access after first visit

Add to home screen

Fast loading

QR-code friendly

🛠 Tech Stack

Next.js 16 (App Router)

TypeScript

Tailwind CSS

PWA (Serwist / Service Worker)

Static + Dynamic Rendering

JSON-driven content



src/
 ├─ app/
 │   ├─ page.tsx              # Landing page
 │   ├─ g/[slug]/page.tsx     # Apartment guide page
 │   ├─ layout.tsx
 │   └─ globals.css
 │
 ├─ lib/
 │   └─ guide/
 │       ├─ loadGuide.ts
 │       └─ types.ts
 │
public/
 ├─ guides/
 │   └─ narvik/
 │       ├─ guide.json        # Apartment content (EN / NO)
 │       └─ images/           # Apartment images
 │
 ├─ manifest.webmanifest
 └─ icons/


🚀 Development
npm install
npm run dev


Runs locally at:

http://localhost:3000

🏗 Production Build
npm run build


✔ Successfully builds as:

Static homepage

Dynamic guide routes (/g/[slug])

PWA-ready


🧭 UX Principles Used

House rules shown first (reduce friction)

Large touch targets

Minimal scrolling

No layout shifts when changing language

Clear visual hierarchy

Emergency always one tap away

📌 Roadmap (Optional)

Admin UI for editing guide.json

QR code generator per apartment

Analytics (anonymous usage)

More language support

Host dashboard (multi-property)

👤 Author

Built for real-world hospitality use — not a demo toy.

If you want this adapted for:

Hotels

Guesthouses

Serviced apartments

Resorts

…the architecture already supports it.
