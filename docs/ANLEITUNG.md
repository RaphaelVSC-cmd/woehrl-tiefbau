# Kundenanleitung & Dokumentation: Wöhrl Tiefbau GmbH

## 1. Projektübersicht
* **Unternehmen:** Wöhrl Tiefbau GmbH
* **Sitz:** Auweg 25, 93055 Regensburg
* **Telefon:** 0941 / 780 37 69
* **Geschäftsführer:** Stefan Brandl
* **Technologie-Stack:** HTML5, Vanilla CSS3 (Custom Design System), JavaScript (ES6+), TailwindCSS (CDN), Studio Freight Lenis (Smooth Scroll), GSAP 3.12 (ScrollTrigger).

---

## 2. Struktur & Hauptbestandteile

### 2.1 Der interaktive Tiefbau-Konfigurator
* **Funktionsweise:**
  1. Der Nutzer wählt in Schritt 1 die Projektart (Baugrube, Kanalbau, Pflasterung, Straßenbau, Spartenbau).
  2. In Schritt 2 werden über intuitive Schieberegler die Quadratmeter und die Grabtiefe eingestellt. Über Radio-Buttons wird die Bodenklasse festgelegt.
  3. Die JavaScript-Engine in `app.js` berechnet simultan:
     - Netto-Aushubvolumen ($m^3$)
     - Gelockertes Schüttvolumen ($m^3$)
     - Tonnage ($t$)
     - Benötigte LKW-Fuhren (4-Achser Kipper à $14\,m^3$)
  4. In Schritt 3 können DIN-Prüfungen und Entsorgungsnachweise ausgewählt werden.
  5. In Schritt 4 wird das Ergebnis zusammengefasst und kann per Formular oder direkt mit 1 Klick via WhatsApp an Wöhrl Tiefbau übermittelt werden.

### 2.2 Der Vorher/Nachher-Slider
* Ermöglicht Interessenten die intuitive visuelle Gegenüberstellung von unwegsamem Erdreich und fertiger Gewerbeanlage per Maus-Drag oder Finger-Wischgeste.

### 2.3 Express-Bewerberportal
* Richtet sich an Baumaschinenführer und Straßenbauer im Raum Regensburg. Ermöglicht eine Bewerbung in 60 Sekunden ohne Papier oder Lebenslauf.

### 2.4 Rechts- und Datenschutzkonformität
* **Impressum gem. § 5 DDG:** Vollständig mit Registergericht Regensburg (HRB 6977), Handwerkskammer Niederbayern-Oberpfalz und Berufsbezeichnung.
* **Datenschutz gem. DSGVO Art. 13:** Alle Betroffenenrechte, Rechtsgrundlagen und Aufsichtsbehörde (BayLDA).
* **Two-Click Maps:** Google Maps wird erst geladen, wenn der Nutzer im Placeholder auf „Karte laden“ klickt oder im Cookie-Banner zustimmt (§ 25 TDDDG).
* **Cookie-Banner:** Gleichwertige Buttons („Nur essenzielle“ und „Alle akzeptieren“) plus jederzeitiger Wiederöffnungs-Link im Footer.

---

## 3. Wartung & Anpassungen
* **Telefonnummer / Kontaktdaten anpassen:** In `index.html` nach `tel:` und `0941` suchen.
* **E-Mail-Adresse:** Aktuell ist `info@woehrl-tiefbau.de` als Platzhalter hinterlegt. Sobald der Kunde eine spezifische Zieladresse nennt, in `index.html` und `docs/lead-data.md` anpassen.
* **Bilder austauschen:** Eigene Baustellenbilder können direkt im Ordner `assets/images/` hinterlegt werden.
