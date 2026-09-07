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
