Apartment Guide PWA 🏡📱

A modern, offline-friendly apartment guide built with Next.js and PWA technology, designed for short-term rentals (Airbnb, Booking, serviced apartments).

Guests scan a QR code and instantly access everything they need — no app installation required.

Guests can quickly find:

    📶 Wi-Fi details

    🏠 House rules

    🚨 Emergency instructions

    🔎 Where things are located

    🧾 Checkout checklist

    🧭 Local recommendations

✨ Why This Exists

Most guests:

    Don't read printed manuals

    Lose Wi-Fi information

    Panic during emergencies

    Ask the same questions repeatedly

This project solves that by providing:

    One simple digital guide

    Offline access after first open

    Mobile-first UX with large touch targets

    Multi-language support (EN / NO)

🧠 Core Features
🏠 Apartment Guide

    House rules shown first (UX-driven)

    Checkout checklist

    Clean, readable layout

📶 Wi-Fi

    Network name & password

    One-tap copy

    Optional troubleshooting notes

🚨 Emergency

    Emergency contacts (phone / WhatsApp)

    Visual instructions with images

    Step-by-step actions

    STOP & CALL warnings for dangerous situations

🔎 Find Items

    Search tools, appliances, safety equipment

    Clear location descriptions

    Category grouping

    Image previews

🌍 Multi-Language

    English & Norwegian support

    Language toggle (no layout shift)

    Content driven entirely from JSON

⚡ Progressive Web App (PWA)

    Works offline after first visit

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

📁 Project Structure
text

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
bash

npm install
npm run dev

Runs locally at: http://localhost:3000
🏗 Production Build
bash

npm run build

✔ Successfully builds as:

    Static homepage

    Dynamic guide routes (/g/[slug])

    Fully PWA-ready

🧭 UX Principles Used

    House rules shown first to reduce friction

    Large touch targets for mobile users

    Minimal scrolling

    No layout shifts when switching language

    Clear visual hierarchy

    Emergency always one tap away

📌 Roadmap (Optional)

    Admin UI for editing guide.json

    QR code generator per apartment

    Anonymous usage analytics

    Additional language support

    Host dashboard for multi-property management