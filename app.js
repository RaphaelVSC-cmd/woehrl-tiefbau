/**
 * Wöhrl Tiefbau GmbH – Core Application Script (2025)
 * Beinhaltet:
 * - Lenis Smooth Scroll mit GSAP Ticker Synchronisation (Touchpad-sicher)
 * - Interaktiver 4-Schritte Tiefbau- & Kubatur-Konfigurator mit Live-Berechnung
 * - Interaktiver Vorher/Nachher-Bildvergleich (Mouse & Touch-fähig)
 * - Rechtssichere Two-Click Google Maps (§ 25 TDDDG)
 * - TDDDG Cookie Consent Banner mit Footer-Re-Open
 * - Barrierefreie Modal-Steuerung mit Scroll-Lock & ESC-Handling
 */

document.addEventListener('DOMContentLoaded', () => {

  // ══════════════════════════════════════════════════════════════
  // 1. LENIS SMOOTH SCROLL & GSAP TICKER SYNC (§ 0C)
  // ══════════════════════════════════════════════════════════════
  let lenis = null;

  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 0.9,
      wheelMultiplier: 1.0,
      smoothTouch: false, // Natives Touch-Scroll auf Smartphones
    });

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  }

  // Helper für Modal Scroll-Lock
  function lockScroll() {
    if (lenis) lenis.stop();
    document.body.style.overflow = 'hidden';
  }

  function unlockScroll() {
    if (lenis) lenis.start();
    document.body.style.overflow = '';
  }

  // ══════════════════════════════════════════════════════════════
  // 2. MOBILE NAVIGATION (§ 0E: Genau EIN X-Mechanismus)
  // ══════════════════════════════════════════════════════════════
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNavOverlay = document.getElementById('mobileNavOverlay');
  const hamburgerIcon = document.getElementById('hamburgerIcon');
  const closeIcon = document.getElementById('closeIcon');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function toggleMobileMenu() {
    const isActive = mobileNavOverlay.classList.toggle('active');
    mobileMenuBtn.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    
    if (isActive) {
      hamburgerIcon.classList.add('hidden');
      closeIcon.classList.remove('hidden');
      lockScroll();
    } else {
      hamburgerIcon.classList.remove('hidden');
      closeIcon.classList.add('hidden');
      unlockScroll();
    }
  }

  if (mobileMenuBtn && mobileNavOverlay) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);

    // Klick auf Nav-Link schließt Overlay
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (mobileNavOverlay.classList.contains('active')) {
          toggleMobileMenu();
        }
      });
    });

    // Klick auf Hintergrund schließt Menü
    mobileNavOverlay.addEventListener('click', (e) => {
      if (e.target === mobileNavOverlay) {
        toggleMobileMenu();
      }
    });
  }

  // ══════════════════════════════════════════════════════════════
  // 3. INTERAKTIVER TIEFBAU- & KUBATUR-KONFIGURATOR (CORE-FEATURE)
  // ══════════════════════════════════════════════════════════════
  const configState = {
    step: 1,
    projectType: 'baugrube',
    projectTypeName: 'Baugruben- & Fundamentaushub',
    area: 180,
    depth: 2.5,
    soil: 'light', // light (1.8 t/m³), medium (1.9 t/m³), heavy (2.2 t/m³)
    soilName: 'Klasse 1–2 (Sand / Mutterboden)',
    addons: {
      entsorgung: true,
      verdichtung: true,
      dichtheit: false,
      sparten: false
    }
  };

  // DOM Elemente Konfigurator
  const stepPanels = {
    1: document.getElementById('step1Content'),
    2: document.getElementById('step2Content'),
    3: document.getElementById('step3Content'),
    4: document.getElementById('step4Content')
  };
  const stepNavBtns = document.querySelectorAll('.step-nav-btn');

  // Slider & Displays
  const areaSlider = document.getElementById('areaSlider');
  const depthSlider = document.getElementById('depthSlider');
  const areaValueDisplay = document.getElementById('areaValueDisplay');
  const depthValueDisplay = document.getElementById('depthValueDisplay');
  const calcCubicMeters = document.getElementById('calcCubicMeters');
  const calcLooseMeters = document.getElementById('calcLooseMeters');
  const calcWeight = document.getElementById('calcWeight');
  const calcTruckTrips = document.getElementById('calcTruckTrips');

  // Zusammenfassung Displays (Schritt 4)
  const summaryProjectType = document.getElementById('summaryProjectType');
  const summaryCubicMeters = document.getElementById('summaryCubicMeters');
  const summaryDimensions = document.getElementById('summaryDimensions');
  const summarySoil = document.getElementById('summarySoil');
  const summaryMachinery = document.getElementById('summaryMachinery');

  // Berechnungslogik
  function updateCalculations() {
    configState.area = parseFloat(areaSlider.value) || 20;
    configState.depth = parseFloat(depthSlider.value) || 0.3;

    const netCubic = Math.round(configState.area * configState.depth);
    const looseCubic = Math.round(netCubic * 1.25); // 25% Auflockerung im Tiefbau

    let density = 1.8;
    if (configState.soil === 'medium') density = 1.9;
    if (configState.soil === 'heavy') density = 2.2;

    const totalWeight = Math.round(netCubic * density);
    const truckCapacity = 14; // m³ Kapazität typischer 4-Achs-Kipper
    const trips = Math.max(1, Math.ceil(looseCubic / truckCapacity));

    // Displays aktualisieren
    if (areaValueDisplay) areaValueDisplay.textContent = `${configState.area} m²`;
    if (depthValueDisplay) depthValueDisplay.textContent = `${configState.depth.toFixed(2)} m`;
    if (calcCubicMeters) calcCubicMeters.textContent = `${netCubic} m³`;
    if (calcLooseMeters) calcLooseMeters.textContent = `${looseCubic} m³`;
    if (calcWeight) calcWeight.textContent = `ca. ${totalWeight} t`;
    if (calcTruckTrips) calcTruckTrips.textContent = `ca. ${trips} Fahrten`;

    // Zusammenfassung in Schritt 4
    if (summaryProjectType) summaryProjectType.textContent = configState.projectTypeName;
    if (summaryCubicMeters) summaryCubicMeters.textContent = `${netCubic} m³ (${looseCubic} m³ gelockert)`;
    if (summaryDimensions) summaryDimensions.textContent = `${configState.area} m² bei ${configState.depth.toFixed(2)} m Tiefe`;
    if (summarySoil) summarySoil.textContent = configState.soilName;

    // Maschinenempfehlung berechnen
    if (summaryMachinery) {
      if (netCubic <= 50) {
        summaryMachinery.textContent = 'Kompaktbagger 3.5t–6t + 2-Achs-Absetzkipper';
      } else if (netCubic <= 250) {
        summaryMachinery.textContent = 'Mobilbagger 15t + 3-Achs-Dreiseitenkipper';
      } else {
        summaryMachinery.textContent = '18t–22t Kettenbagger mit 3D-GPS-Steuerung + 4-Achs-Kipperflotte';
      }
    }
  }

  // Stepper Umschaltung
  function goToStep(targetStep) {
    if (targetStep < 1 || targetStep > 4) return;
    configState.step = targetStep;

    // Panels umschalten
    for (let i = 1; i <= 4; i++) {
      if (stepPanels[i]) {
        if (i === targetStep) {
          stepPanels[i].classList.remove('hidden');
        } else {
          stepPanels[i].classList.add('hidden');
        }
      }
    }

    // Nav-Buttons aktualisieren
    stepNavBtns.forEach(btn => {
      const btnStep = parseInt(btn.dataset.step, 10);
      if (btnStep === targetStep) {
        btn.classList.add('active', 'text-amber-400');
        btn.classList.remove('text-slate-400');
        btn.querySelector('span:first-child').className = 'w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center shrink-0';
      } else if (btnStep < targetStep) {
        btn.classList.remove('active', 'text-slate-400');
        btn.classList.add('text-amber-400');
        btn.querySelector('span:first-child').className = 'w-6 h-6 rounded-full bg-amber-500/30 text-amber-300 font-bold flex items-center justify-center shrink-0';
      } else {
        btn.classList.remove('active', 'text-amber-400');
        btn.classList.add('text-slate-400');
        btn.querySelector('span:first-child').className = 'w-6 h-6 rounded-full bg-slate-800 text-slate-300 font-bold flex items-center justify-center shrink-0';
      }
    });

    updateCalculations();
  }

  // Event Listener für Buttons & Tabs
  stepNavBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const step = parseInt(btn.dataset.step, 10);
      goToStep(step);
    });
  });

  const nextToStep2 = document.getElementById('nextToStep2');
  const backToStep1 = document.getElementById('backToStep1');
  const nextToStep3 = document.getElementById('nextToStep3');
  const backToStep2 = document.getElementById('backToStep2');
  const nextToStep4 = document.getElementById('nextToStep4');
  const backToStep3 = document.getElementById('backToStep3');

  if (nextToStep2) nextToStep2.addEventListener('click', () => goToStep(2));
  if (backToStep1) backToStep1.addEventListener('click', () => goToStep(1));
  if (nextToStep3) nextToStep3.addEventListener('click', () => goToStep(3));
  if (backToStep2) backToStep2.addEventListener('click', () => goToStep(2));
  if (nextToStep4) nextToStep4.addEventListener('click', () => goToStep(4));
  if (backToStep3) backToStep3.addEventListener('click', () => goToStep(3));

  // Projektart-Karten Selektion (Schritt 1)
  const projectCards = document.querySelectorAll('.option-card');
  projectCards.forEach(card => {
    card.addEventListener('click', () => {
      projectCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
      configState.projectType = card.dataset.category;
      configState.projectTypeName = card.querySelector('h4').textContent.trim();
      updateCalculations();
    });
  });

  // Bodenklasse Selektion (Schritt 2)
  const soilCards = document.querySelectorAll('.option-soil');
  soilCards.forEach(card => {
    card.addEventListener('click', () => {
      soilCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
      configState.soil = card.dataset.soil;
      configState.soilName = card.querySelector('div:first-child').textContent.trim() + ' (' + card.querySelector('div:last-child').textContent.trim() + ')';
      updateCalculations();
    });
  });

  // Sliders Input Events
  if (areaSlider) areaSlider.addEventListener('input', updateCalculations);
  if (depthSlider) depthSlider.addEventListener('input', updateCalculations);

  // Initial Calculation
  updateCalculations();

  // WhatsApp Share Button
  const whatsappShareBtn = document.getElementById('whatsappShareBtn');
  if (whatsappShareBtn) {
    whatsappShareBtn.addEventListener('click', () => {
      const netCubic = Math.round(configState.area * configState.depth);
      const text = `Hallo Wöhrl Tiefbau! Ich habe über Ihren Rechner folgendes Projekt vorkalkuliert:
- Maßnahme: ${configState.projectTypeName}
- Volumen: ca. ${netCubic} m³ (${configState.area} m² x ${configState.depth} m)
- Boden: ${configState.soilName}
Bitte um Rückmeldung bzgl. Machbarkeit und Kostenschätzung.`;
      
      const url = `https://wa.me/499417803769?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }

  // ══════════════════════════════════════════════════════════════
  // 4. INTERAKTIVER VORHER-NACHHER-SLIDER
  // ══════════════════════════════════════════════════════════════
  const baContainer = document.getElementById('baSliderContainer');
  const baBeforeImage = document.getElementById('baBeforeImage');
  const baHandle = document.getElementById('baSliderHandle');

  if (baContainer && baBeforeImage && baHandle) {
    let isSliding = false;

    function setSliderPosition(clientX) {
      const rect = baContainer.getBoundingClientRect();
      const x = clientX - rect.left;
      let percentage = (x / rect.width) * 100;

      if (percentage < 0) percentage = 0;
      if (percentage > 100) percentage = 100;

      baBeforeImage.style.width = `${percentage}%`;
      baHandle.style.left = `${percentage}%`;
    }

    // Mouse Events
    baContainer.addEventListener('mousedown', (e) => {
      isSliding = true;
      setSliderPosition(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (!isSliding) return;
      setSliderPosition(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      isSliding = false;
    });

    // Touch Events für Smartphones & Tablets
    baContainer.addEventListener('touchstart', (e) => {
      isSliding = true;
      if (e.touches.length > 0) {
        setSliderPosition(e.touches[0].clientX);
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isSliding) return;
      if (e.touches.length > 0) {
        setSliderPosition(e.touches[0].clientX);
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isSliding = false;
    });
  }

  // ══════════════════════════════════════════════════════════════
  // 5. TWO-CLICK GOOGLE MAPS AKTIVIERUNG (§ 25 TDDDG)
  // ══════════════════════════════════════════════════════════════
  const loadMapBtn = document.getElementById('loadMapBtn');
  const mapPlaceholder = document.getElementById('mapPlaceholder');
  const googleMapIframe = document.getElementById('googleMapIframe');

  function activateGoogleMaps() {
    if (googleMapIframe && googleMapIframe.dataset.src) {
      googleMapIframe.src = googleMapIframe.dataset.src;
      googleMapIframe.classList.remove('hidden');
      if (mapPlaceholder) mapPlaceholder.classList.add('hidden');
      localStorage.setItem('woehrl_maps_consent', 'true');
    }
  }

  if (loadMapBtn) {
    loadMapBtn.addEventListener('click', activateGoogleMaps);
  }

  // Bei vorab erteilter Cookie-Einwilligung direkt laden
  if (localStorage.getItem('woehrl_maps_consent') === 'true' || localStorage.getItem('woehrl_cookie_consent') === 'all') {
    activateGoogleMaps();
  }

  // ══════════════════════════════════════════════════════════════
  // 6. COOKIE-CONSENT BANNER (§ 1.3 Audit)
  // ══════════════════════════════════════════════════════════════
  const cookieBanner = document.getElementById('cookieBanner');
  const cookieAcceptBtn = document.getElementById('cookieAcceptBtn');
  const cookieRejectBtn = document.getElementById('cookieRejectBtn');
  const reopenCookieBtn = document.getElementById('reopenCookieBtn');

  function showCookieBanner() {
    if (cookieBanner) cookieBanner.classList.add('visible');
  }

  function hideCookieBanner() {
    if (cookieBanner) cookieBanner.classList.remove('visible');
  }

  const existingConsent = localStorage.getItem('woehrl_cookie_consent');
  if (!existingConsent) {
    setTimeout(showCookieBanner, 1200);
  }

  if (cookieAcceptBtn) {
    cookieAcceptBtn.addEventListener('click', () => {
      localStorage.setItem('woehrl_cookie_consent', 'all');
      hideCookieBanner();
      activateGoogleMaps();
    });
  }

  if (cookieRejectBtn) {
    cookieRejectBtn.addEventListener('click', () => {
      localStorage.setItem('woehrl_cookie_consent', 'essential');
      hideCookieBanner();
    });
  }

  if (reopenCookieBtn) {
    reopenCookieBtn.addEventListener('click', () => {
      showCookieBanner();
    });
  }

  // ══════════════════════════════════════════════════════════════
  // 7. RECHTS-MODALS: IMPRESSUM & DATENSCHUTZ (§ 5 DDG & DSGVO)
  // ══════════════════════════════════════════════════════════════
  const impressumModal = document.getElementById('impressumModal');
  const datenschutzModal = document.getElementById('datenschutzModal');
  const openImpressumBtns = document.querySelectorAll('.open-impressum-btn');
  const openDatenschutzBtns = document.querySelectorAll('.open-datenschutz-btn');
  const closeModalBtns = document.querySelectorAll('.close-modal-btn');

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('active');
    lockScroll();
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    unlockScroll();
  }

  openImpressumBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(impressumModal);
    });
  });

  openDatenschutzBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(datenschutzModal);
    });
  });

  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      closeModal(impressumModal);
      closeModal(datenschutzModal);
    });
  });

  // Klick auf Modal-Hintergrund schließt
  [impressumModal, datenschutzModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal(modal);
        }
      });
    }
  });

  // ESC-Taste schließt alle Modals & Menüs
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (impressumModal && impressumModal.classList.contains('active')) closeModal(impressumModal);
      if (datenschutzModal && datenschutzModal.classList.contains('active')) closeModal(datenschutzModal);
      if (mobileNavOverlay && mobileNavOverlay.classList.contains('active')) toggleMobileMenu();
      const aiChatWin = document.getElementById('aiChatWindow');
      if (aiChatWin && aiChatWin.classList.contains('active')) {
        aiChatWin.classList.remove('active');
        const trigger = document.getElementById('aiAssistantTrigger');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      }
    }
  });

  // ══════════════════════════════════════════════════════════════
  // 8. KI-ASSISTENT & INTELLIGENTE Q&A-ENGINE
  // ══════════════════════════════════════════════════════════════
  const aiAssistantTrigger = document.getElementById('aiAssistantTrigger');
  const aiChatWindow = document.getElementById('aiChatWindow');
  const aiChatCloseBtn = document.getElementById('aiChatCloseBtn');
  const aiFaqToggle = document.getElementById('aiFaqToggle');
  const aiFaqChips = document.getElementById('aiFaqChips');
  const aiFaqToggleIcon = document.getElementById('aiFaqToggleIcon');
  const aiChatMessages = document.getElementById('aiChatMessages');
  const aiChatInput = document.getElementById('aiChatInput');
  const aiFaqChipBtns = document.querySelectorAll('.ai-faq-chip');

  // Toggle Chatfenster
  function toggleAiChat() {
    if (!aiChatWindow) return;
    const isActive = aiChatWindow.classList.toggle('active');
    if (aiAssistantTrigger) aiAssistantTrigger.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    if (isActive && aiChatInput) {
      setTimeout(() => aiChatInput.focus(), 300);
    }
  }

  if (aiAssistantTrigger) aiAssistantTrigger.addEventListener('click', toggleAiChat);
  if (aiChatCloseBtn) aiChatCloseBtn.addEventListener('click', toggleAiChat);

  // Klick außerhalb schließt Chat auf Desktop
  document.addEventListener('click', (e) => {
    if (aiChatWindow && aiChatWindow.classList.contains('active')) {
      if (!aiChatWindow.contains(e.target) && !aiAssistantTrigger.contains(e.target)) {
        aiChatWindow.classList.remove('active');
        if (aiAssistantTrigger) aiAssistantTrigger.setAttribute('aria-expanded', 'false');
      }
    }
  });

  // Häufige Fragen Auf- / Zuklappen
  if (aiFaqToggle && aiFaqChips) {
    aiFaqToggle.addEventListener('click', () => {
      const isCollapsed = aiFaqChips.classList.toggle('collapsed');
      if (aiFaqToggleIcon) aiFaqToggleIcon.textContent = isCollapsed ? '▼' : '▲';
    });
  }

  // Klick auf FAQ-Chip
  aiFaqChipBtns.forEach(chip => {
    chip.addEventListener('click', () => {
      const question = chip.dataset.question || chip.textContent.trim();
      processUserQuery(question);
    });
  });

  // Chat-Verarbeitung
  window.handleAiChatSubmit = function(event) {
    event.preventDefault();
    if (!aiChatInput) return false;
    const query = aiChatInput.value.trim();
    if (!query) return false;
    aiChatInput.value = '';
    processUserQuery(query);
    return false;
  };

  function appendMessage(text, isUser = false, actions = []) {
    if (!aiChatMessages) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = `ai-msg ${isUser ? 'ai-msg-user' : 'ai-msg-assistant'}`;
    msgDiv.innerHTML = text;

    if (actions && actions.length > 0) {
      const actionContainer = document.createElement('div');
      actionContainer.className = 'ai-quick-actions';
      actions.forEach(act => {
        const btn = document.createElement('a');
        btn.className = 'ai-quick-action-btn';
        btn.href = act.href;
        btn.innerHTML = act.label;
        if (act.target) btn.target = act.target;
        if (act.rel) btn.rel = act.rel;
        btn.addEventListener('click', () => {
          if (act.href.startsWith('#')) {
            aiChatWindow.classList.remove('active');
            if (aiAssistantTrigger) aiAssistantTrigger.setAttribute('aria-expanded', 'false');
          }
        });
        actionContainer.appendChild(btn);
      });
      msgDiv.appendChild(actionContainer);
    }

    aiChatMessages.appendChild(msgDiv);
    aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
  }

  function showTypingIndicator() {
    if (!aiChatMessages) return null;
    const indicator = document.createElement('div');
    indicator.id = 'aiTypingIndicator';
    indicator.className = 'ai-typing-indicator';
    indicator.innerHTML = '<div class="ai-dot"></div><div class="ai-dot"></div><div class="ai-dot"></div>';
    aiChatMessages.appendChild(indicator);
    aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
    return indicator;
  }

  function removeTypingIndicator() {
    const indicator = document.getElementById('aiTypingIndicator');
    if (indicator) indicator.remove();
  }

  function processUserQuery(rawText) {
    appendMessage(rawText, true);
    showTypingIndicator();

    setTimeout(() => {
      removeTypingIndicator();
      const response = generateAiAnswer(rawText.toLowerCase());
      appendMessage(response.text, false, response.actions);
    }, 400);
  }

  // Intelligente NLP-Wissensdatenbank für Wöhrl Tiefbau GmbH
  function generateAiAnswer(q) {
    // 1. Leistungen & Schwerpunkte
    if (q.includes('leistung') || q.includes('angebot') || q.includes('was macht') || q.includes('portfolio')) {
      return {
        text: `Die <strong>Wöhrl Tiefbau GmbH</strong> deckt alle zentralen Tiefbau-Gewerke meisterhaft ab:<br>
• <strong>Baugruben &amp; Erdbewegungen:</strong> Lasergestützter Aushub für Keller, Häuser &amp; Hallen<br>
• <strong>Kanalbau &amp; Entwässerung:</strong> Hausanschlüsse, Schächte &amp; Zisternen nach DIN EN 1610<br>
• <strong>Straßen- &amp; Asphaltbau:</strong> Tragschichten, Walzasphalt, Rinnen- &amp; Bordsteine<br>
• <strong>Hof- &amp; Gewerbepflaster:</strong> Schwerlastverbundpflaster für Höfe, Parkplätze &amp; Einfahrten<br>
• <strong>Sparten- &amp; Leitungsbau:</strong> Trassen für Wasser, Strom, Gas &amp; Glasfaser`,
        actions: [
          { label: '📐 Zum Projekt-Rechner', href: '#konfigurator' },
          { label: '🛠️ Leistungen ansehen', href: '#leistungen' }
        ]
      };
    }

    // 2. Kubatur & Aushubberechnung
    if (q.includes('kubatur') || q.includes('aushub') || q.includes('volumen') || q.includes('m3') || q.includes('m²') || q.includes('berechnen') || q.includes('rechner')) {
      return {
        text: `Das Aushubvolumen berechnet sich nach der Formel:<br>
<strong>Grundfläche (m²) × Grabtiefe (m) = Netto-Kubatur (m³)</strong>.<br><br>
Beachten Sie bei der Entsorgung den <strong>Auflockerungsfaktor (+25%)</strong> sowie die Bodenklasse (Sand, Lehm oder Fels). Nutzen Sie direkt unseren interaktiven 4-Schritte-Rechner, um Aushubmenge, Tonnage und LKW-Fuhren live zu berechnen!`,
        actions: [
          { label: '🚜 Jetzt Kubatur berechnen', href: '#konfigurator' }
        ]
      };
    }

    // 3. Kosten & Preise
    if (q.includes('preis') || q.includes('kosten') || q.includes('kostenvoranschlag') || q.includes('teuer') || q.includes('angebot')) {
      return {
        text: `Die Kosten im Tiefbau hängen von <strong>Kubatur, Bodenklasse (1–7), Zugänglichkeit der Baustelle und Entsorgungsnachweisen</strong> ab.<br><br>
Wir erstellen Ihnen nach Prüfung Ihrer Daten ein transparentes, faires <strong>Festpreis-Angebot</strong> ohne versteckte Überraschungen. Nutzen Sie unseren Rechner für eine erste Bedarfsanalyse!`,
        actions: [
          { label: '📋 Angebot kalkulieren', href: '#konfigurator' },
          { label: '📞 0941 7803769 anrufen', href: 'tel:+499417803769' }
        ]
      };
    }

    // 4. Kanalbau & DIN EN 1610
    if (q.includes('kanal') || q.includes('din') || q.includes('1610') || q.includes('dichtheit') || q.includes('rohr') || q.includes('abwasser') || q.includes('zisterne')) {
      return {
        text: `Ja! Wir führen <strong>fachgerechten Kanal- und Leitungsbau nach DIN EN 1610</strong> durch.<br><br>
Inklusive normgerechter <strong>Druckprüfung mit Luft oder Wasser</strong> und offiziellem Prüfprotokoll für Kommunen, Stadtwerke und Bauabnahmen. Auch Regenwasserzisternen bis 15.000 Liter bauen wir fachgerecht ein.`,
        actions: [
          { label: '🚰 Zum Kanalbau', href: '#leistungen' },
          { label: '💬 Per WhatsApp fragen', href: 'https://wa.me/499417803769', target: '_blank', rel: 'noopener noreferrer' }
        ]
      };
    }

    // 5. Jobs, Baggerfahrer, Karriere
    if (q.includes('job') || q.includes('karriere') || q.includes('bewerb') || q.includes('baggerfahrer') || q.includes('fahrer') || q.includes('maschinist') || q.includes('straßenbauer') || q.includes('stelle')) {
      return {
        text: `Wir suchen aktuell Verstärkung in Regensburg!<br>
• <strong>Baugeräteführer / Baggerfahrer (m/w/d)</strong> für Ketten- &amp; Mobilbagger<br>
• <strong>Straßenbauer &amp; Vorarbeiter (m/w/d)</strong><br>
• <strong>LKW-Fahrer (Klasse CE, Kipper)</strong><br><br>
Kein Lebenslauf oder Anschreiben nötig – bewerben Sie sich einfach in 60 Sekunden direkt über unser Schnellbewerbungs-Portal!`,
        actions: [
          { label: '⚡ In 60s bewerben', href: '#karriere' }
        ]
      };
    }

    // 6. Standort & Öffnungszeiten
    if (q.includes('standort') || q.includes('adresse') || q.includes('wo') || q.includes('öffnungszeit') || q.includes('zeit') || q.includes('anfahrt') || q.includes('regensburg')) {
      return {
        text: `<strong>Firmensitz &amp; Betriebshof:</strong><br>
Auweg 25, 93055 Regensburg (verkehrsgünstig im Regensburger Osten).<br><br>
<strong>Betriebs- &amp; Bürozeiten:</strong><br>
• Montag bis Donnerstag: 07:00 – 17:00 Uhr<br>
• Freitag: 07:00 – 12:00 Uhr<br>
• Samstag &amp; Sonntag: Geschlossen`,
        actions: [
          { label: '🗺️ Anfahrt anzeigen', href: '#standort-kontakt' },
          { label: '📞 Direkt anrufen', href: 'tel:+499417803769' }
        ]
      };
    }

    // 7. Fuhrpark & Maschinen
    if (q.includes('fuhrpark') || q.includes('maschine') || q.includes('kettenbagger') || q.includes('mobilbagger') || q.includes('kipper') || q.includes('walze') || q.includes('technik')) {
      return {
        text: `Unser Fuhrpark umfasst ausschließlich moderne Hochleistungsgeräte:<br>
• <strong>Kettenbagger (18–24t):</strong> Bis 6,50 m Grabtiefe mit 3D-GPS-Steuerung<br>
• <strong>Allrad-Mobilbagger (14–16t):</strong> Wendig für Stadtbaustellen<br>
• <strong>Kipperflotte (3- &amp; 4-Achser):</strong> Bis 14 m³ / 22 Tonnen Schüttguttransport<br>
• <strong>Verdichtungstechnik:</strong> Tandem-Vibrationswalzen &amp; Rüttelplatten bis 100 kN`,
        actions: [
          { label: '🚜 Fuhrpark ansehen', href: '#fuhrpark' }
        ]
      };
    }

    // 8. Notfall / Sofortkontakt
    if (q.includes('not') || q.includes('kontakt') || q.includes('telefon') || q.includes('anruf') || q.includes('nummer') || q.includes('mail') || q.includes('brandl')) {
      return {
        text: `Sie erreichen uns werktags telefonisch unter <a href="tel:+499417803769" class="text-amber-400 font-bold underline">0941 / 780 37 69</a>.<br>
Oder schreiben Sie uns schnell und unkompliziert per WhatsApp – wir melden uns umgehend!`,
        actions: [
          { label: '📞 0941 7803769 anrufen', href: 'tel:+499417803769' },
          { label: '💬 WhatsApp Chat starten', href: 'https://wa.me/499417803769', target: '_blank', rel: 'noopener noreferrer' }
        ]
      };
    }

    // Standard / Intelligenter Fallback
    return {
      text: `Vielen Dank für Ihre Frage! Als spezialisierter Meisterbetrieb für Tief-, Straßen- und Kanalbau in Regensburg beraten wir Sie gerne individuell.<br><br>
Möchten Sie Ihr Projekt mit unserem <strong>4-Schritte-Konfigurator</strong> durchrechnen oder direkt mit Bauleiter Stefan Brandl sprechen?`,
      actions: [
        { label: '📐 Projekt online berechnen', href: '#konfigurator' },
        { label: '📞 0941 7803769 anrufen', href: 'tel:+499417803769' },
        { label: '💬 Per WhatsApp schreiben', href: 'https://wa.me/499417803769', target: '_blank', rel: 'noopener noreferrer' }
      ]
    };
  }

});

// Global form submit helpers
function handleFormSubmit(event) {
  event.preventDefault();
  const successMsg = document.getElementById('formSuccessMessage');
  if (successMsg) {
    successMsg.classList.remove('hidden');
    event.target.reset();
  }
  return false;
}

function handleJobSubmit(event) {
  event.preventDefault();
  const successMsg = document.getElementById('jobSuccessMessage');
  if (successMsg) {
    successMsg.classList.remove('hidden');
    event.target.reset();
  }
  return false;
}

