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
    }
  });

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

// ══════════════════════════════════════════════════════════════
// KI-ASSISTENT & SMARTE DEEP-SCRAPING Q&A-ENGINE (Wöhrl Tiefbau)
// ══════════════════════════════════════════════════════════════
(function() {
  function initSmartAiAssistant() {
    const aiTrigger = document.getElementById('aiAssistantTrigger');
    const aiWindow = document.getElementById('aiChatWindow');
    const aiCloseBtn = document.getElementById('aiChatCloseBtn');
    const aiMinimizeBtn = document.getElementById('aiChatMinimizeBtn');
    const aiFaqToggle = document.getElementById('aiFaqToggle');
    const aiFaqChips = document.getElementById('aiFaqChips');
    const aiFaqToggleIcon = document.getElementById('aiFaqToggleIcon');
    const aiChatMessages = document.getElementById('aiChatMessages');
    const aiChatInput = document.getElementById('aiChatInput');
    const aiFaqChipBtns = document.querySelectorAll('.ai-faq-chip');

    if (!aiTrigger || !aiWindow) return;

    // 1. LIVE DOM SCRAPER: Extrahiert reale Fakten, Sektionen, Leistungsbeschreibungen & Kontaktdaten
    const siteData = (function scrapeSite() {
      const sections = {};
      document.querySelectorAll('section[id], footer, header').forEach(sec => {
        const id = sec.id || sec.tagName.toLowerCase();
        const text = sec.innerText.replace(/\s+/g, ' ').trim();
        sections[id] = text;
      });
      return {
        company: 'Wöhrl Tiefbau GmbH',
        city: 'Regensburg',
        address: 'Auweg 25, 93055 Regensburg',
        phone: '0941 7803769',
        phoneInt: '+499417803769',
        hours: 'Mo–Do: 07:00 – 17:00 Uhr | Fr: 07:00 – 12:00 Uhr',
        leader: 'Stefan Brandl (Bauleiter)',
        founded: '1998 in Regensburg',
        rating: '4.3 / 5.0 (Google Rezensionen)',
        sections: sections
      };
    })();

    // 2. UI-Steuerung: Ruckelfrei, kein Flackern, Outside-Click & Escape
    function openAiChat() {
      aiWindow.classList.add('active');
      aiTrigger.setAttribute('aria-expanded', 'true');
      if (aiChatInput) {
        setTimeout(() => aiChatInput.focus(), 250);
      }
    }

    function closeAiChat() {
      aiWindow.classList.remove('active');
      aiTrigger.setAttribute('aria-expanded', 'false');
    }

    function toggleAiChat() {
      if (aiWindow.classList.contains('active')) {
        closeAiChat();
      } else {
        openAiChat();
      }
    }

    aiTrigger.addEventListener('click', toggleAiChat);
    if (aiCloseBtn) aiCloseBtn.addEventListener('click', closeAiChat);
    if (aiMinimizeBtn) aiMinimizeBtn.addEventListener('click', closeAiChat);

    // Klick außerhalb schließt
    document.addEventListener('click', (e) => {
      if (aiWindow.classList.contains('active')) {
        if (!aiWindow.contains(e.target) && !aiTrigger.contains(e.target)) {
          closeAiChat();
        }
      }
    });

    // ESC-Taste schließt
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && aiWindow.classList.contains('active')) {
        closeAiChat();
      }
    });

    // FAQ Toggle (Akkordeon)
    if (aiFaqToggle && aiFaqChips) {
      aiFaqToggle.addEventListener('click', () => {
        const isCollapsed = aiFaqChips.classList.toggle('collapsed');
        aiFaqToggle.setAttribute('aria-expanded', isCollapsed ? 'false' : 'true');
        if (aiFaqToggleIcon) aiFaqToggleIcon.textContent = isCollapsed ? '▼' : '▲';
      });
    }

    // Klick auf FAQ Chips
    aiFaqChipBtns.forEach(chip => {
      chip.addEventListener('click', () => {
        const q = chip.dataset.question || chip.textContent.trim();
        processQuery(q);
      });
    });

    // Formular-Submit
    window.handleAiChatSubmit = function(e) {
      e.preventDefault();
      if (!aiChatInput) return false;
      const text = aiChatInput.value.trim();
      if (!text) return false;
      aiChatInput.value = '';
      processQuery(text);
      return false;
    };

    // Message Rendering
    function appendMsg(html, isUser = false, actions = []) {
      if (!aiChatMessages) return;
      const div = document.createElement('div');
      div.className = `ai-msg ${isUser ? 'ai-msg-user' : 'ai-msg-assistant'}`;
      div.innerHTML = html;

      if (actions && actions.length > 0) {
        const actDiv = document.createElement('div');
        actDiv.className = 'ai-quick-actions';
        actions.forEach(act => {
          const btn = document.createElement('a');
          btn.className = 'ai-quick-action-btn';
          btn.href = act.href;
          btn.innerHTML = act.label;
          if (act.target) btn.target = act.target;
          if (act.rel) btn.rel = act.rel;
          btn.addEventListener('click', () => {
            if (act.href.startsWith('#')) {
              closeAiChat();
            }
          });
          actDiv.appendChild(btn);
        });
        div.appendChild(actDiv);
      }

      aiChatMessages.appendChild(div);
      aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
    }

    function showTyping() {
      if (!aiChatMessages) return null;
      const ind = document.createElement('div');
      ind.id = 'aiTypingIndicator';
      ind.className = 'ai-typing-indicator';
      ind.innerHTML = '<div class="ai-dot"></div><div class="ai-dot"></div><div class="ai-dot"></div>';
      aiChatMessages.appendChild(ind);
      aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
      return ind;
    }

    function hideTyping() {
      const ind = document.getElementById('aiTypingIndicator');
      if (ind) ind.remove();
    }

    function processQuery(rawText) {
      appendMsg(rawText, true);
      showTyping();

      setTimeout(() => {
        hideTyping();
        const res = generateSmartAnswer(rawText);
        appendMsg(res.text, false, res.actions);
      }, 350);
    }

    // 3. INTELLIGENTE BERECHNUNGS- & NLP-ENGINE
    function generateSmartAnswer(input) {
      const q = input.toLowerCase();

      // A. ERKENNUNG VON MASSSEN & BERECHNUNGEN (z.B. "10x12m und 2.5m tief" oder "8x10" oder "150 qm")
      const dimMatch = input.match(/(\d+[\.,]?\d*)\s*(?:m|meter)?\s*[xX*]\s*(\d+[\.,]?\d*)\s*(?:m|meter)?(?:\s*(?:und|mit|bei|,)?\s*(\d+[\.,]?\d*)\s*(?:m|meter)?\s*(?:tief|tiefe|höhe)?)?/i);
      const areaMatch = input.match(/(\d+[\.,]?\d*)\s*(?:qm|m2|m²|quadratmeter)/i);

      if (dimMatch) {
        const l = parseFloat(dimMatch[1].replace(',', '.'));
        const w = parseFloat(dimMatch[2].replace(',', '.'));
        const d = dimMatch[3] ? parseFloat(dimMatch[3].replace(',', '.')) : 2.5;
        const area = Math.round(l * w * 10) / 10;
        const netM3 = Math.round(area * d);
        const grossM3 = Math.round(netM3 * 1.25); // +25% Auflockerung gem. Bodenmechanik
        const trucks = Math.max(1, Math.round(grossM3 / 13)); // 13 m³ je 4-Achser Kipper
        const minCost = (grossM3 * 28).toLocaleString('de-DE');
        const maxCost = (grossM3 * 42).toLocaleString('de-DE');

        return {
          text: `Hier ist die exakte <strong>Kubatur- &amp; Kostenkalkulation</strong> für Ihr Vorhaben:<br><br>
• <strong>Grundfläche:</strong> ${l} m × ${w} m = <strong>${area} m²</strong><br>
• <strong>Grabtiefe:</strong> ${d} m<br>
• <strong>Netto-Aushubvolumen:</strong> ca. <strong>${netM3} m³</strong><br>
• <strong>Brutto-Volumen (+25% Auflockerung):</strong> ca. <strong>${grossM3} m³</strong><br>
• <strong>Transportlogistik:</strong> ca. <strong>${trucks} LKW-Fuhren</strong> (4-Achser Kipper bis 22t)<br>
• <strong>Geschätzter Richtpreis (Bodenkl. 3–4):</strong> ca. <strong>${minCost} € – ${maxCost} €</strong> netto<br>
<em>(Inklusive laser-/GPS-gestütztem Aushub, Abtransport, zertifiziertem Deponienachweis &amp; Feinplanum)</em>.<br><br>
Nutzen Sie unseren 4-Schritte-Rechner, um Ihr Vorhaben millimetergenau zu spezifizieren!`,
          actions: [
            { label: '🚜 Zum 3D-Kubatur-Rechner', href: '#konfigurator' },
            { label: '📞 0941 7803769 anrufen', href: 'tel:+499417803769' },
            { label: '💬 Per WhatsApp senden', href: `https://wa.me/499417803769?text=${encodeURIComponent('Hallo Herr Brandl, ich habe ein Projekt: ' + l + 'x' + w + 'm, ' + d + 'm tief (ca. ' + grossM3 + ' m³ Aushub). Bitte um Festpreis-Angebot.')}`, target: '_blank', rel: 'noopener noreferrer' }
          ]
        };
      }

      if (areaMatch && (q.includes('pflaster') || q.includes('hof') || q.includes('einfahrt') || q.includes('parkplatz') || q.includes('teer') || q.includes('asphalt'))) {
        const area = parseFloat(areaMatch[1].replace(',', '.'));
        const minPflaster = Math.round(area * 85).toLocaleString('de-DE');
        const maxPflaster = Math.round(area * 130).toLocaleString('de-DE');
        const gravelTons = Math.round(area * 0.35 * 1.8);

        return {
          text: `Für Ihre Befestigungsfläche von <strong>${area} m²</strong> kalkulieren wir wie folgt:<br><br>
• <strong>Unterbau / Frostschutz:</strong> ca. ${gravelTons} Tonnen Schottertragschicht (0/32 bzw. 0/45), dynamisch mit Tandemwalze verdichtet (100 kN)<br>
• <strong>Pflasterbettung &amp; Verlegung:</strong> Schwerlast-Verbundsteinpflaster für PKW- &amp; LKW-Befahrung<br>
• <strong>Richtwert inkl. Erdabtrag, Unterbau &amp; Pflasterung:</strong> ca. <strong>${minPflaster} € – ${maxPflaster} €</strong> netto.<br><br>
Für ein verbindliches Festpreisangebot besichtigen wir Ihr Grundstück in Regensburg gerne vor Ort.`,
          actions: [
            { label: '📋 Pflasterprojekt anfragen', href: '#konfigurator' },
            { label: '📞 Direkt beraten lassen', href: 'tel:+499417803769' }
          ]
        };
      }

      // B. JOBS & KARRIERE (Hohe Priorität vor Fuhrpark/Bagger)
      if (q.includes('job') || q.includes('karriere') || q.includes('bewerb') || q.includes('stelle') || q.includes('einstellung') || q.includes('mitarbeiter') || (q.includes('sucht') && (q.includes('fahrer') || q.includes('bagger') || q.includes('leute')))) {
        return {
          text: `Wir suchen aktuell tatkräftige Verstärkung für unser Team in Regensburg!<br><br>
• <strong>Baugeräteführer / Baggerfahrer (m/w/d)</strong> für Ketten- &amp; Mobilbagger mit 3D-GPS<br>
• <strong>Straßenbauer &amp; Vorarbeiter (m/w/d)</strong> für Erd- und Pflasterbau<br>
• <strong>LKW-Fahrer CE (m/w/d)</strong> für 3- &amp; 4-Achser Kipper<br><br>
<strong>Vorteile bei Wöhrl:</strong> Übertarifliche Bezahlung, 30 Tage Urlaub, modernste Maschinen mit Klimakabine und familiäres Betriebsklima.<br>
<strong>Kein Anschreiben oder Lebenslauf nötig!</strong> Bewerben Sie sich in 60 Sekunden direkt über unser Schnellbewerbungsportal.`,
          actions: [
            { label: '⚡ In 60 Sek. bewerben', href: '#karriere' },
            { label: '📞 Stefan Brandl anrufen', href: 'tel:+499417803769' }
          ]
        };
      }

      // C. STANDORT, BETRIEBSHOF & EINSATZGEBIET (Vor Pflaster/Hof)
      if (q.includes('betriebshof') || q.includes('standort') || q.includes('adresse') || q.includes('wo ist') || q.includes('wo seid') || q.includes('anfahrt') || q.includes('einsatzgebiet') || q.includes('umkreis')) {
        return {
          text: `<strong>Firmensitz &amp; Betriebshof:</strong><br>
<strong>Auweg 25, 93055 Regensburg</strong> (Gewerbegebiet Regensburg-Ost, verkehrsgünstig an der A 3 / B 8).<br><br>
<strong>Unser Einsatzgebiet:</strong><br>
Stadt Regensburg sowie der gesamte Landkreis Regensburg, Kelheim, Schwandorf, Cham und Straubing-Bogen (ca. 40–50 km Umkreis). Wir führen sowohl innerstädtische Bauprojekte als auch Vorhaben im gesamten Umland aus!`,
          actions: [
            { label: '🗺️ In Google Maps öffnen', href: 'https://www.google.com/maps/search/?api=1&query=W%C3%B6hrl%20Tiefbau%20GmbH&query_place_id=ChIJp-lMZIPBn0cR9aOFzpOlcyE', target: '_blank', rel: 'noopener noreferrer' },
            { label: '📞 Betriebshof anrufen', href: 'tel:+499417803769' }
          ]
        };
      }

      // D. FOTOS, PLÄNE & WHATSAPP
      if (q.includes('whatsapp') || q.includes('foto') || q.includes('bild') || q.includes('plan') || q.includes('zeichnung') || q.includes('skizze') || q.includes('hochladen') || q.includes('schicken')) {
        return {
          text: `Ja, sehr gerne! Sie können uns Pläne, Entwässerungsskizzen, Grundstücksfotos oder Bodengutachten direkt und unkompliziert per WhatsApp senden.<br><br>
Unser Bauleiter Stefan Brandl sichtet Ihre Unterlagen und gibt Ihnen meist noch am selben Tag eine qualifizierte Rückmeldung!`,
          actions: [
            { label: '💬 Fotos via WhatsApp senden', href: 'https://wa.me/499417803769?text=Guten%20Tag%2C%20ich%20m%C3%B6chte%20Ihnen%20einige%20Fotos%20und%20Pl%C3%A4ne%20zu%20meinem%20Tiefbauprojekt%20senden.', target: '_blank', rel: 'noopener noreferrer' },
            { label: '📞 0941 7803769 anrufen', href: 'tel:+499417803769' }
          ]
        };
      }

      // E. NOTFALL, ROHRBRUCH & DRINGEND
      if (q.includes('notfall') || q.includes('rohrbruch') || q.includes('wasserrohr') || q.includes('dringend') || q.includes('notdienst') || q.includes('akut') || q.includes('soforthilfe')) {
        return {
          text: `<strong>Dringender Rohrbruch oder akuter Bodeneinbruch?</strong><br><br>
Bei akuten Tiefbau-Notfällen in Regensburg erreichen Sie uns am schnellsten telefonisch oder mit Standort-Übermittlung per WhatsApp. Wir können kurzfristig mit Mobilbagger und Notdienst-Equipment anrücken!`,
          actions: [
            { label: '📞 SOFORTRUF: 0941 7803769', href: 'tel:+499417803769' },
            { label: '💬 Sofort per WhatsApp melden', href: 'https://wa.me/499417803769?text=Dringender%20Notfall%20in%20Regensburg!', target: '_blank', rel: 'noopener noreferrer' }
          ]
        };
      }

      // F. KANALBAU & DIN EN 1610
      if (q.includes('kanal') || q.includes('din') || q.includes('1610') || q.includes('dichtheit') || q.includes('abwasser') || q.includes('zisterne') || q.includes('rohr') || q.includes('regenwasser') || q.includes('schacht')) {
        return {
          text: `Ja! Wir sind spezialisiert auf <strong>Kanalbau &amp; Entwässerung nach DIN EN 1610</strong>:<br><br>
• <strong>Hausanschlüsse &amp; Schmutzwasser:</strong> Zertifizierte Verlegung robuster KG2000-Rohre (DN 150/200)<br>
• <strong>Druckprüfung:</strong> Normgerechte Dichtheitsprüfung mit Luft oder Wasser inkl. offiziellem Prüfprotokoll für Kommunen &amp; Stadtwerke Regensburg<br>
• <strong>Zisternenbau:</strong> Einbau von Monolith-Betonzisternen von 3.000 bis 15.000 Liter Nutzvolumen inkl. Filtertechnik<br>
• <strong>Schachtbauwerke:</strong> Setzen von Kontroll- und Revisionsschächten aus Beton`,
          actions: [
            { label: '🚰 Mehr zum Kanalbau', href: '#leistungen' },
            { label: '📞 Kanalexperten anrufen', href: 'tel:+499417803769' },
            { label: '💬 Skizze per WhatsApp senden', href: 'https://wa.me/499417803769', target: '_blank', rel: 'noopener noreferrer' }
          ]
        };
      }

      // G. FUHRPARK & BAGGER
      if (q.includes('fuhrpark') || q.includes('bagger') || q.includes('maschine') || q.includes('kettenbagger') || q.includes('mobilbagger') || q.includes('kipper') || q.includes('walze') || q.includes('gps') || q.includes('trimble') || q.includes('leica') || q.includes('technik')) {
        return {
          text: `Unser eigener moderner Maschinenpark garantiert höchste Termintreue und Präzision:<br><br>
• <strong>22-Tonnen Kettenbagger:</strong> Mit 3D-GPS-Steuerung (Leica/Trimble), Schwenklöffel, Abbruchmeißel und bis zu <strong>6,50 m Grabtiefe</strong><br>
• <strong>15-Tonnen Allrad-Mobilbagger:</strong> Äußerst wendig für enge innerstädtische Baustellen und Leitungsgräben<br>
• <strong>Kipper-Flotte (3- &amp; 4-Achser):</strong> Bis 14 m³ Ladevolumen bzw. 22 Tonnen Nutzlast für zügigen Erdstofftransport<br>
• <strong>Verdichtungstechnik:</strong> Tandem-Vibrationswalzen &amp; schwere Rüttelplatten bis 100 kN für setzungsfreie Tragschichten`,
          actions: [
            { label: '🚜 Fuhrpark-Galerie ansehen', href: '#fuhrpark' },
            { label: '📞 Bagger mit Fahrer anfragen', href: 'tel:+499417803769' }
          ]
        };
      }

      // H. STRAßENBAU, PFLASTER & ASPHALT
      if (q.includes('straße') || q.includes('asphalt') || q.includes('teer') || q.includes('pflaster') || (q.includes('hof') && !q.includes('betriebshof')) || q.includes('einfahrt') || q.includes('parkplatz') || q.includes('bordstein') || q.includes('rinne')) {
        return {
          text: `Im Straßen- und Pflasterbau bieten wir meisterhafte Komplettlösungen:<br><br>
• <strong>Asphaltbau:</strong> Deckschichten, Tragdeckschichten und Walzasphalt für Straßen, Betriebshöfe und Zufahrten<br>
• <strong>Schwerlast-Pflaster:</strong> Verbundsteinpflaster mit hoher Scherfestigkeit für LKWs und Gewerbefahrzeuge<br>
• <strong>Randeinfassungen:</strong> Tiefbordsteine, Granit-Zweizeiler, Gussasphalt- und Entwässerungsrinnen<br>
• <strong>Vorbereitung:</strong> Bodenaustausch, Schottertragschichten (0/32 &amp; 0/45) mit Laser-Feinplanum`,
          actions: [
            { label: '🛠️ Straßen- & Pflasterbau ansehen', href: '#leistungen' },
            { label: '📋 Jetzt Projekt anfragen', href: '#konfigurator' }
          ]
        };
      }

      // I. SPARTENBAU & LEITUNGEN
      if (q.includes('sparte') || q.includes('leitung') || q.includes('rohr') || q.includes('wasser') || q.includes('strom') || q.includes('gas') || q.includes('glasfaser') || q.includes('ftth') || q.includes('graben')) {
        return {
          text: `Wir verlegen alle Versorgungsleitungen fachgerecht im offenen Grabenbau:<br><br>
• Hausanschlussgräben für Wasser, Abwasser, Strom, Gas und Fernwärme<br>
• Grabenaushub und fachgerechte Sandbettung zum Schutz der Leitungen<br>
• Leerrohrtrassen für Telekommunikation &amp; Glasfaser (FTTH)<br>
• Warnbänder, Ortungsdrähte und vorschriftsmäßige Verfüllung nach ZTV A-StB`,
          actions: [
            { label: '📞 Leitungstrasse anfragen', href: 'tel:+499417803769' },
            { label: '💬 Trassenplan per WhatsApp', href: 'https://wa.me/499417803769', target: '_blank', rel: 'noopener noreferrer' }
          ]
        };
      }

      // J. BODENKLASSEN & ENTSORGUNG
      if (q.includes('bodenklasse') || q.includes('fels') || q.includes('lehm') || q.includes('sand') || q.includes('entsorgung') || q.includes('z0') || q.includes('z1') || q.includes('z2') || q.includes('schutt') || q.includes('abfall') || q.includes('deponie')) {
        return {
          text: `In Regensburg und Umgebung kennen wir die Bodenverhältnisse (Bodenklassen 1 bis 7) genau:<br><br>
• <strong>Bodenklasse 3–5 (Kies, Sand, Ton/Lehm):</strong> Schneller Abtrag mit 22t Kettenbagger<br>
• <strong>Bodenklasse 6–7 (Fels, Mergel, Jura-Kalkstein):</strong> Meißeleinsatz mit Hydraulikhammer am Bagger<br>
• <strong>Deklaration &amp; Entsorgung:</strong> Saubere Einstufung nach LAGA Z0, Z1.1, Z1.2 und Transport zu zertifizierten Deponien mit lückenlosem Entsorgungsnachweis`,
          actions: [
            { label: '🚜 Boden im Rechner wählen', href: '#konfigurator' },
            { label: '📞 Fragen zur Bodenklasse?', href: 'tel:+499417803769' }
          ]
        };
      }

      // K. ÖFFNUNGSZEITEN & ERREICHBARKEIT
      if (q.includes('öffnungszeit') || q.includes('zeit') || q.includes('wann') || q.includes('uhr') || q.includes('samstag') || q.includes('sonntag') || q.includes('wochenende') || q.includes('geöffnet')) {
        return {
          text: `<strong>Büro- und Betriebszeiten:</strong><br>
• <strong>Montag bis Donnerstag:</strong> 07:00 – 17:00 Uhr<br>
• <strong>Freitag:</strong> 07:00 – 12:00 Uhr<br>
• <strong>Samstag &amp; Sonntag:</strong> Geschlossen (Baustellenbetrieb nach Sondervereinbarung)<br><br>
Außerhalb der Bürozeiten erreichen Sie uns jederzeit per WhatsApp oder E-Mail.`,
          actions: [
            { label: '📞 0941 7803769', href: 'tel:+499417803769' },
            { label: '💬 Per WhatsApp schreiben', href: 'https://wa.me/499417803769', target: '_blank', rel: 'noopener noreferrer' }
          ]
        };
      }

      // L. DAUER, ABLAUF & TERMINVERGABE
      if (q.includes('dauer') || q.includes('wie lange') || q.includes('ablauf') || q.includes('vorlaufzeit') || q.includes('termin') || q.includes('schnell') || q.includes('starten') || q.includes('beginn')) {
        return {
          text: `So läuft die Zusammenarbeit mit der Wöhrl Tiefbau GmbH ab:<br><br>
1. <strong>Anfrage &amp; Ersteinschätzung:</strong> Sofort online oder telefonisch (Kostenkalkulation in 60s)<br>
2. <strong>Vor-Ort-Besichtigung:</strong> Innerhalb von 24–48 Stunden in Regensburg<br>
3. <strong>Verbindliches Festpreisangebot:</strong> Innerhalb von 2–3 Werktagen<br>
4. <strong>Baustart:</strong> Je nach Saison meist innerhalb von 1 bis 3 Wochen möglich<br>
5. <strong>Abnahme:</strong> Pünktlich, sauber und besenrein mit amtlichem Aufmaß nach VOB`,
          actions: [
            { label: '📐 Jetzt Vorhaben anfragen', href: '#konfigurator' },
            { label: '📞 Termin abstimmen: 0941 7803769', href: 'tel:+499417803769' }
          ]
        };
      }

      // M. KOSTEN & PREISE ALLGEMEIN
      if (q.includes('preis') || q.includes('kosten') || q.includes('kostenvoranschlag') || q.includes('stundensatz') || q.includes('teuer') || q.includes('angebot') || q.includes('festpreis') || q.includes('rechner')) {
        return {
          text: `Bei der <strong>Wöhrl Tiefbau GmbH</strong> erhalten Sie garantierte Festpreise nach transparenter VOB-Abrechnung:<br><br>
• <strong>Baugrubenaushub Bodenkl. 3–5:</strong> ca. 24 – 38 € / m³ inkl. 3D-GPS-Bagger<br>
• <strong>Bodenentsorgung Z0 / Z1.1:</strong> ca. 18 – 35 € / Tonne nach LAGA-Nachweis<br>
• <strong>Kanalhausanschluss (DIN 1610):</strong> ca. 2.800 – 5.500 € je nach Trassenlänge &amp; Tiefe<br>
• <strong>Hof- &amp; Schwerlastpflaster:</strong> ca. 85 – 130 € / m² inkl. Schotterunterbau<br>
• <strong>Baggerstundensatz (15t Mobil / 22t Kettenbagger inkl. Fachmaschinist):</strong> 95 – 145 € / Std.<br><br>
Berechnen Sie Ihr Vorhaben in unserem Rechner oder fordern Sie ein kostenloses Angebot innerhalb von 48h an!`,
          actions: [
            { label: '🚜 Jetzt im Rechner kalkulieren', href: '#konfigurator' },
            { label: '📞 0941 7803769 anrufen', href: 'tel:+499417803769' },
            { label: '💬 Angebot via WhatsApp', href: 'https://wa.me/499417803769', target: '_blank', rel: 'noopener noreferrer' }
          ]
        };
      }

      // N. ANSCHRIFT, INHABER & KONTAKT
      if (q.includes('inhaber') || q.includes('brandl') || q.includes('chef') || q.includes('kontakt') || q.includes('telefon') || q.includes('anruf') || q.includes('nummer') || q.includes('mail') || q.includes('email') || q.includes('geschäftsführer')) {
        return {
          text: `<strong>Wöhrl Tiefbau GmbH</strong><br>
Geschäftsführer &amp; Bauleiter: <strong>Stefan Brandl</strong><br>
Adresse: <strong>Auweg 25, 93055 Regensburg</strong><br>
Telefon: <a href="tel:+499417803769" class="text-amber-400 font-bold underline">0941 / 780 37 69</a><br>
WhatsApp: <a href="https://wa.me/499417803769" target="_blank" rel="noopener noreferrer" class="text-emerald-400 font-bold underline">0941 7803769</a><br>
Eingetragen im Handelsregister des Amtsgerichts Regensburg.`,
          actions: [
            { label: '📞 Direkt anrufen', href: 'tel:+499417803769' },
            { label: '💬 WhatsApp Chat starten', href: 'https://wa.me/499417803769', target: '_blank', rel: 'noopener noreferrer' }
          ]
        };
      }

      // O. SEMANTISCHER FALLBACK DURCH DIE ECHTEN WEBSITE-TEXTE
      let bestSnippet = '';
      let bestScore = 0;
      const terms = q.replace(/[^\w\säöüß]/g, '').split(/\s+/).filter(w => w.length > 2);

      Object.entries(siteData.sections).forEach(([secId, text]) => {
        const sentences = text.split(/[.!?]\s+/);
        sentences.forEach(s => {
          let score = 0;
          const sLower = s.toLowerCase();
          terms.forEach(t => {
            if (sLower.includes(t)) score += 1;
          });
          if (score > bestScore && s.length > 25 && s.length < 240) {
            bestScore = score;
            bestSnippet = s.trim();
          }
        });
      });

      if (bestScore >= 2 && bestSnippet) {
        return {
          text: `Auf unserer Website heißt es dazu:<br><br>
<em>„${bestSnippet}.“</em><br><br>
Haben Sie hierzu weitere Fragen oder wünschen Sie eine konkrete Prüfung Ihres Vorhabens durch Bauleiter Stefan Brandl?`,
          actions: [
            { label: '🚜 Vorhaben berechnen', href: '#konfigurator' },
            { label: '📞 0941 7803769 anrufen', href: 'tel:+499417803769' },
            { label: '💬 Per WhatsApp fragen', href: 'https://wa.me/499417803769', target: '_blank', rel: 'noopener noreferrer' }
          ]
        };
      }

      // Default intelligenter Fallback mit Kontext zu Wöhrl Tiefbau
      return {
        text: `Vielen Dank für Ihre Frage an die <strong>Wöhrl Tiefbau GmbH</strong> in Regensburg!<br><br>
Als Fachbetrieb für <strong>Baugrubenaushub, Kanalbau (DIN 1610), Straßenbau &amp; Schwerlastpflaster</strong> finden wir für jedes Vorhaben die passende wirtschaftliche Lösung.<br><br>
Geben Sie gerne Ihre ungefähren Maße ein (z. B. <em>„Was kostet Aushub für 10x12m?“</em>) oder sprechen Sie direkt mit unserem Bauleiter!`,
        actions: [
          { label: '🚜 Projekt online berechnen', href: '#konfigurator' },
          { label: '📞 0941 7803769 anrufen', href: 'tel:+499417803769' },
          { label: '💬 Per WhatsApp anfragen', href: 'https://wa.me/499417803769', target: '_blank', rel: 'noopener noreferrer' }
        ]
      };
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSmartAiAssistant);
  } else {
    initSmartAiAssistant();
  }
})();
