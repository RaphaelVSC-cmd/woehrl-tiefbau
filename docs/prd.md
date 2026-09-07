# Product Requirements Document (PRD): Wöhrl Tiefbau GmbH

## 1. Strategisches Problem-Solving

### Identifizierter Schmerzpunkt
Die **Wöhrl Tiefbau GmbH** ist ein etablierter Meisterbetrieb im Tief- und Straßenbau in Regensburg (seit 1998, HRB 6977), verfügt jedoch über **keinerlei Website**. 
In der heutigen Baubranche bringt dies drei gravierende Probleme mit sich:
1. **Verlust von High-Ticket-Aufträgen (15.000 € – 250.000 €+):** Bauträger, Gewerbeunternehmen, Architekten und private Bauherren suchen Baugrubenaushub, Kanalanschlüsse und Pflasterungen online. Ohne Webauftritt fällt Wöhrl Tiefbau durch jedes Vorab-Screening.
2. **Zeitraubende telefonische Bedarfsermittlung:** Ohne strukturierte Vorab-Parameter (Kubatur, Bodenklasse, Zufahrt, Leitungspläne) binden Anrufer die Bauleitung unnötig lang am Telefon.
3. **Akuter Fachkräftemangel bei Maschinisten:** Baggerfahrer und Straßenbauer bewerben sich nicht per Post. Es fehlt ein niederschwelliges 60-Sekunden-Bewerbungsportal.

### Die maßgeschneiderte Lösungsfunktion
1. **Der Wöhrl Tiefbau- & Kubatur-Konfigurator:**
   Ein haptischer, taktiler 4-Schritte-Projektkalkulator für Bauherren und Bauleiter:
   - **Schritt 1:** Leistungsauswahl (Baugrubenaushub, Kanalbau & Entwässerung, Hof- & Parkflächenpflasterung, Straßen- & Wegebau, Spartenbau).
   - **Schritt 2:** Dynamische Kubatur-Berechnung (Fläche in m² × Tiefe in m = m³ Erdaushub, Tonnage-Schätzung, Bodenklassen-Selektion).
   - **Schritt 3:** Technische Zusatzoptionen (Bodenentsorgungsnachweis, Verdichtungsprüfung mit Plattendruckversuch, Kanaldichtheitsprüfung DIN EN 1610, Spartenabfrage).
   - **Schritt 4:** Live-Zusammenfassung mit technischer Empfehlung des Maschinentyps (z.B. 16t-Kettenbagger + 4-Achs-Kipper) und 1-Klick-Anfrage mit Rückrufgarantie innerhalb von 24 Stunden.
2. **Express-Bewerber-Radar für Maschinisten & Fachkräfte:**
   Bewerbung in 60 Sekunden ohne Lebenslauf: Auswahl der bevorzugten Baumaschine (Kettenbagger, Mobilbagger, Radlader, Straßenfertiger), Erfahrung und Kontaktaufnahme per WhatsApp/Telefon.

### Individuelle UX- & Interaktions-Idee
- **Industrial Precision UI:** Dunkles Asphalt-Anthrazit mit Baustellen-Sicherheits-Bernstein/Gold (`hsl(42, 98%, 52%)`).
- **Taktile Live-Schieberegler:** Beim Verstellen von Fläche und Tiefe berechnet die UI in Echtzeit m³ und LKW-Fuhren.
- **Interaktiver Vorher/Nachher-Bildvergleich:** Vorher (roher Erdaushub / steinige Baugrube) vs. Nachher (präzise planierte und gepflasterte Industrieanlage).
- **Two-Click Google Maps Integration:** DSGVO-konforme Anfahrt zum Auweg 25 in 93055 Regensburg.

### Der Akquise-Hebel für Raphael
*„Guten Tag Herr Brandl, mein Name ist Raphael Neumeier. Ich rufe Sie an, weil die Wöhrl Tiefbau GmbH seit 1998 in Regensburg für solide Tiefbau- und Straßenbauarbeiten steht – aber online bisher überhaupt nicht sichtbar ist. Wenn ein Bauherr oder Bauträger in Regensburg nach Erdarbeiten oder Kanalbau sucht, landen die Anfragen bei Mitbewerbern. Ich habe nicht nur eine gewöhnliche Website entworfen, sondern für Sie einen voll funktionsfähigen digitalen Baugruben- und Kubatur-Rechner entwickelt, mit dem Kunden ihr Projekt in 60 Sekunden vorkonfigurieren, sowie ein Express-Bewerbungsportal für Baggerfahrer. Ich habe den fertigen Entwurf online gestellt – darf ich Ihnen den Link kurz per WhatsApp oder SMS rüberschicken?“*

---

## 2. Individuelle Farb- & Design-Welt

### Farbklima (Heavy Civil Engineering & Technical Precision)
* **Hintergrund Primär:** `--bg-dark: #0e1117` (Deep Heavy Asphalt Charcoal)
* **Hintergrund Sekundär:** `--bg-surface: #161b24` (Subtle Industrial Slate)
* **Hintergrund Tertiär:** `--bg-elevated: #1f2633` (Card Slate mit feinen 1px Borders)
* **Sicherheits- & Akzentfarbe:** `--accent-amber: #f59e0b` (CAT / Baumaschinen-Sicherheitsgelb / Gold)
* **Akzent Glow:** `--accent-amber-glow: rgba(245, 158, 11, 0.25)`
* **Text Primär:** `--text-primary: #f1f5f9` (Off-White, WCAG AAA 12:1 Kontrast)
* **Text Sekundär:** `--text-secondary: #94a3b8` (Muted Slate, WCAG AA 5.2:1 Kontrast)
* **Technisches Signal-Cyan:** `--accent-cyan: #38bdf8` (Präzisions-Vermessung & Lasertechnik)
* **Erfolg / Verifiziert:** `--accent-green: #22c55e` (DIN EN 1610 Gütesiegel)

### Typografie
* **Überschriften (Display / Headings):** `'Outfit', sans-serif` (Gewichte: 600, 700, 800) – moderne, kraftvolle, industrielle Ästhetik.
* **Fließtext (Body):** `'Inter', sans-serif` (Gewichte: 400, 500, 600) – maximale Lesbarkeit, optimierte Bildschirm-Typografie.
* **Kennzahlen & DIN-Daten:** `'JetBrains Mono', monospace` (Gewichte: 500, 700) – technische Präzision für Kubatur-Zahlen, Koordinaten, DIN-Normen und Tonnagen.

### Layout-Dramaturgie
1. **Header & Notfall-Direktkontakt:** Schwebende, hochmoderne Pill-Navigation mit Auweg 25 Regensburg, 0941 7803769 und CTA "Projekt kalkulieren".
2. **Hero-Sektion:** Hero-Bild mit Großbaustelle / Kettenbagger, starker Claim ("Fundamente für Regensburg. Meisterhafte Erdarbeiten, Straßen- & Kanalbau seit 1998"), Vertrauens-Badges (27 Jahre Erfahrung, 4.3 Sterne Google, Eigener moderner Maschinenpark).
3. **Live Kapazitäts-Radar:** "Aktuelle Baukapazitäten im Raum Regensburg & Oberpfalz: Projekte ab Quartal 2/2025 terminierbar".
4. **Hero Feature: Der Wöhrl Tiefbau- & Kubatur-Konfigurator:** 4 interaktive Schritte mit Live-Berechnung von m³, geschätzten LKW-Fuhren und Maschinenvorschlag.
5. **Leistungs-Bento-Grid (5 Kernbereiche):**
   - 01. Erdarbeiten & Baugrubenaushub
   - 02. Kanalbau & Entwässerung (DIN EN 1610)
   - 03. Straßen- & Asphaltbau
   - 04. Gewerbe- & Hofpflasterung
   - 05. Sparten- & Leitungsverlegung
6. **Interaktiver Vorher/Nachher-Slider:** Von der Rohbau-Aushubgrube zur perfekten Außenanlage.
7. **Maschinenpark & Fuhrpark-Spezifikationen:** Transparente Vorstellung der technischen Kapazitäten (Kettenbagger, Mobilbagger, Radlader, Verdichtungstechnik).
8. **Express-Bewerbungsportal:** Baggerfahrer & Straßenbauer gesucht – Schnellkontakt in 60 Sekunden.
9. **Kundenstimmen & Regionale Referenzen:** Google-Bewertungen, Baustellen-Historie in Regensburg.
10. **DSGVO Two-Click Google Maps & Kontakt:** Auweg 25, 93055 Regensburg mit Öffnungszeiten und Routing.
11. **Rechts-Modals & TDDDG Consent:** Impressum gem. § 5 DDG (Stefan Brandl, HRB 6977 Amtsgericht Regensburg) & DSGVO Art. 13 Datenschutzerklärung.
