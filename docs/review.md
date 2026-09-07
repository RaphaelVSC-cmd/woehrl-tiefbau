# Code-Review & Qualitätsprüfung: Wöhrl Tiefbau GmbH

## 1. Problem-Solving & Geschäftsmodell-Passung
* [x] **Maßgeschneiderte Lösungsfunktion:** Der 4-Schritte-Tiefbau-Konfigurator berechnet in Echtzeit Netto-Kubatur ($m^3$), Auflockerungsvolumen (+25%), Bodengewicht in Tonnen anhand der gewählten Bodenklasse (1–2 Sand, 3–4 Lehm/Kies, 5–6 Fels) und empfiehlt automatisch den passenden Maschinentyp (Kompaktbagger, 15t-Mobilbagger oder 18–22t-Kettenbagger mit 3D-GPS).
* [x] **Fachkräfte-Radar:** 60-Sekunden-Expressbewerbung ohne Lebenslauf zur Gewinnung von Baggerfahrern und Straßenbauern im Raum Regensburg.
* [x] **Vorher-Nachher-Demonstrator:** Interaktiver Schieberegler zwischen roher Baugrube und fertig planiertem/gepflastertem Gewerbeareal.

## 2. Visuelle Eigenständigkeit & Design-System
* [x] **Eigenständige Farb- & Markenwelt:** Industrial Asphalt (`#0c1017`), Heavy Slate (`#141a24`), Baustellen-Amber (`#f59e0b`), Vermessungs-Laser-Cyan (`#38bdf8`) und DIN-Zertifizierungs-Grün (`#22c55e`).
* [x] **Typografie:** `Outfit` (Headings mit meisterlicher Wucht), `Inter` (hoher Kontrast und Lesbarkeit), `JetBrains Mono` (technische Daten, DIN-Normen, Kubatur-Zahlen).
* [x] **Kein Einheits-Look:** Keine austauschbare Kachel-Optik, sondern haptisches Baustellen-Feeling mit echten Liebherr- und Baustellen-Fotografien in 16:9.
* [x] **Favicon & App-Icons:** Individuelle Vektor-`favicon.svg` mit dem Firmen-Emblem und Baustellen-Amber erstellt und im `<head>` für Browser und iOS verlinkt.

## 3. Responsive & Touchpad-Sicherheit
* [x] **Kein `scroll-behavior: smooth` im CSS:** Lenis Physik-Engine läuft ruckelfrei auf Mac-Trackpads und Windows Precision Touchpads.
* [x] **Lenis & GSAP Synchronisation:** `gsap.ticker.add((time) => lenis.raf(time * 1000))` und `gsap.ticker.lagSmoothing(0)`.
* [x] **Mobile Responsiveness (375px bis 1440px):** Buttons mit `max-width: 100%; word-break: break-word;` und `white-space: normal` auf Mobilgeräten.
* [x] **Header:** Genau EIN schwebender Header (`.unified-header`) – kein Doppelbalken-Effekt.

## 4. Daten-Integrität & Fakten-Check
* [x] Firmenname: Wöhrl Tiefbau GmbH
* [x] Geschäftsführer: Stefan Brandl (alleinvertretungsberechtigt)
* [x] Handelsregister: Amtsgericht Regensburg, HRB 6977
* [x] Anschrift: Auweg 25, 93055 Regensburg
* [x] Telefon: 0941 / 780 37 69
* [x] Kammer: Handwerkskammer Niederbayern-Oberpfalz
* [x] 0 halluzinierte Fakten, alle Platzhalter deklariert.
