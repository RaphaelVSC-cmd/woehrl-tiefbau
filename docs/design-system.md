# Design-System & Technische Architektur: Wöhrl Tiefbau GmbH

## 1. Design Tokens (Industrial Precision & Civil Engineering)

```css
:root {
  /* Farbklima: Industrial Slate, Asphalt & Baustellen-Amber */
  --bg-dark: #0d1117;
  --bg-surface: #151b24;
  --bg-elevated: #1e2532;
  --bg-card: rgba(22, 27, 36, 0.85);
  --bg-card-hover: rgba(30, 37, 50, 0.95);
  
  /* Akzentfarben */
  --accent-amber: #f59e0b;
  --accent-amber-hover: #d97706;
  --accent-amber-light: #fbbf24;
  --accent-amber-glow: rgba(245, 158, 11, 0.25);
  --accent-amber-subtle: rgba(245, 158, 11, 0.1);
  
  /* Technische Präzision / Laser / Vermessung */
  --accent-cyan: #38bdf8;
  --accent-cyan-subtle: rgba(56, 189, 248, 0.12);
  --accent-green: #22c55e;
  --accent-green-glow: rgba(34, 197, 94, 0.25);

  /* Typografie-Farben mit WCAG AAA / AA Konformität */
  --text-primary: #f8fafc;        /* 15.8:1 Kontrast zu #0d1117 */
  --text-secondary: #94a3b8;      /* 5.4:1 Kontrast zu #0d1117 */
  --text-muted: #64748b;          /* 3.1:1 Kontrast (nur Hilfstexte/Labels) */
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-amber: rgba(245, 158, 11, 0.35);

  /* Typografie */
  --font-display: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Container & Spacing */
  --container-max: 1440px;
  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 20px;
  --radius-full: 9999px;
  
  /* Animation Dynamics */
  --transition-fast: 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  --transition-smooth: 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
```

---

## 2. Technische Architektur & Script-Libraries
* **Smooth-Scrolling:** Studio Freight Lenis v1.0.42
  - Konfiguration: `duration: 0.9`, `wheelMultiplier: 1.0`, `smoothTouch: false` (natives Touch auf Smartphones).
  - Synchronisation: GSAP Ticker `gsap.ticker.add((time) => lenis.raf(time * 1000)); gsap.ticker.lagSmoothing(0);`
* **Animations-Engine:** GSAP 3.12.5 + ScrollTrigger
* **TailwindCSS CDN:** v3.4.x für standardisierte Layout-Klassen
* **Icons:** Lucide Icons (inline SVG für 0-Latenz und perfekte Performance)
* **Fonts:** Google Fonts Preconnect (`Outfit`, `Inter`, `JetBrains Mono`)

---

## 3. Responsive & Touchpad-Sicherheitsregeln
1. **Kein `scroll-behavior: smooth` im CSS:** Wird strikt vermieden, um Konflikte mit Lenis zu verhindern.
2. **Buttons Mobile-Safe:** `max-width: 100%; word-break: break-word;` und `white-space: normal;` auf Mobilgeräten.
3. **Container:** Alle Sektionen nutzen `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` (1280px–1440px) für beeindruckende Wide-Canvas-Wirkung ohne Säuleneffekt.
4. **Modals & Scroll-Lock:** Beim Öffnen von Impressum, Datenschutz oder Konfigurator-Details wird Lenis via `lenis.stop()` pausiert und `document.body.style.overflow = 'hidden'` gesetzt. Beim Schließen wird `lenis.start()` reaktiviert.

---

## 4. Sektions-Architektur
1. **Header:** Einzeilige, schwebende Glassmorphism-Pill mit Firmen-Logo, Rufnummer `0941 7803769`, Öffnungszeiten und CTA-Button.
2. **Hero-Stage:** Heavy-Duty Industrial Hero mit Großflächen-Visual, Social-Proof-Rating (4.3 Google Sterne), Vertrauens-Badges und Live-Kapazitätsstatus.
3. **Core Feature:** Interaktiver 4-Schritte-Tiefbau-Konfigurator mit Schiebereglern für m² und Grabtiefe, automatischer m³- & Tonnageberechnung, Maschinenempfehlung und Direktanfrage.
4. **Bento-Grid:** 5 Leistungsfelder (Baugruben, Kanalbau nach DIN EN 1610, Straßen- & Asphaltbau, Hofpflasterung, Spartenbau).
5. **Projekt-Vergleich:** Interaktiver Vorher-Nachher-Slider (Rohbaugrube vs. asphaltierte/gepflasterte Gewerbefläche).
6. **Maschinen-Showcase:** Technische Daten der Schlüsselgeräte (z.B. Kettenbagger 18t, Mobilbagger 15t, Radlader, Rüttelplatten).
7. **Express-Bewerbung:** 60-Sekunden-Formular für Baggerfahrer & Straßenbauer.
8. **Kundenstimmen & Regionale Verankerung:** 4.3 Sterne, Referenzen in Regensburg.
9. **Kontakt & Two-Click Maps:** Standort Auweg 25, 93055 Regensburg.
10. **Rechts-Modals & TDDDG Consent:** Impressum (§ 5 DDG), Datenschutz (DSGVO Art. 13), Cookie-Banner mit Widerrufs-Link im Footer.
