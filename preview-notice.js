/**
 * Nexbot Webdesign – Portfolio Preview & Legal Transparency Notice
 * Rechtssicherer Transparenzhinweis für inoffizielle Designentwürfe (§ 5 DDG, § 5 UWG, UrhG).
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'nexbot_preview_dismissed';

  const ICONS = {
    compass: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>`,
    close: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
    shield: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
    info: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`
  };

  function isDismissed() {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch (e) {
      return false;
    }
  }

  function setDismissed() {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch (e) {
      console.warn('LocalStorage not available', e);
    }
  }

  function openLegalModal() {
    let modal = document.getElementById('nexbot-legal-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'nexbot-legal-modal';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.innerHTML = `
        <div class="pn-modal-card">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
            <span class="pn-badge">
              <span class="pn-pulse"></span>
              <span>Rechtlicher Hinweis</span>
            </span>
            <button type="button" class="pn-close-btn" id="pn-modal-close" title="Schließen">${ICONS.close}</button>
          </div>

          <h3 class="pn-modal-title">Transparenz- & Urheberrechtshinweis</h3>

          <div class="pn-modal-section">
            <strong>1. Status als Portfolio- & Demonstrationsentwurf</strong>
            Diese Website ist ein freier, unverbindlicher Gestaltungs- und Technologieentwurf der Digitalagentur Nexbot Webdesign (Raphael Neumeier). Die Präsentation dient ausschließlich Anschauungs- und Portfoliozwecken. Es handelt sich ausdrücklich <em>nicht</em> um den offiziellen Webauftritt des benannten Betriebs; es besteht keine geschäftliche Verbindung oder Beauftragung.
          </div>

          <div class="pn-modal-section">
            <strong>2. Diensteanbieter & Hosting (§ 5 DDG)</strong>
            Verantwortlicher Betreiber für Bereitstellung und Hosting dieser Entwurfs-Instanz:<br>
            <strong>Nexbot Webdesign</strong> – Inhaber: Raphael Neumeier<br>
            Kontakt: <a href="mailto:neumeierraphael342@gmail.com" style="color:#60a5fa;text-decoration:underline;">neumeierraphael342@gmail.com</a>
          </div>

          <div class="pn-modal-section">
            <strong>3. Marken- & Namensrechte</strong>
            Sämtliche auf dieser Seite genannten Firmennamen, Marken, Logos und Warenzeichen stehen im Eigentum der jeweiligen Rechteinhaber und werden hier rein beispielhaft im Rahmen eines redaktionellen Design-Konzepts referenziert.
          </div>

          <div class="pn-modal-section">
            <strong>4. Bildnachweis & Urheberrechte</strong>
            Verwendete Medien, Fotografien und Grafiken dienen als visuelle Anschauungsbeispiele (lizenzfreie Medien via Unsplash / Pixabay, KI-gestützte Renderings oder öffentlich zugängliche Referenzabbildungen). Alle Urheberrechte verbleiben bei den jeweiligen Autoren.
          </div>

          <div class="pn-modal-section" style="background:rgba(59,130,246,0.1);padding:10px 14px;border-radius:10px;border:1px solid rgba(59,130,246,0.25);">
            <strong style="color:#93c5fd;">5. Direkter Take-Down-Kontakt für Rechteinhaber</strong>
            Sollten Sie Inhaber der Namens-, Marken- oder Bildrechte sein und eine Anpassung oder unverzügliche Deaktivierung dieser Portfolio-Demonstration wünschen, senden Sie bitte eine formlose E-Mail an: 
            <a href="mailto:neumeierraphael342@gmail.com" style="color:#ffffff;font-weight:bold;">neumeierraphael342@gmail.com</a>.<br>
            Wir nehmen den Entwurf nach Eingang Ihrer Nachricht binnen 24 Stunden offline.
          </div>

          <div class="pn-modal-footer">
            <button type="button" class="pn-btn-primary" id="pn-modal-ok">Verstanden & Schließen</button>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      const closeBtn = modal.querySelector('#pn-modal-close');
      const okBtn = modal.querySelector('#pn-modal-ok');

      function closeModal() {
        modal.classList.remove('pn-open');
      }

      closeBtn.addEventListener('click', closeModal);
      okBtn.addEventListener('click', closeModal);
      modal.addEventListener('click', function (e) {
        if (e.target === modal) closeModal();
      });
    }

    modal.classList.add('pn-open');
  }

  function renderFloatingPill() {
    if (document.getElementById('nexbot-preview-pill')) return;
    const pill = document.createElement('button');
    pill.type = 'button';
    pill.id = 'nexbot-preview-pill';
    pill.title = 'Rechtliche Hinweise & Entwurfs-Status einsehen';
    pill.innerHTML = `
      <span>${ICONS.compass}</span>
      <span>Portfolio-Entwurf</span>
    `;
    pill.addEventListener('click', openLegalModal);
    document.body.appendChild(pill);
  }

  function renderNoticeToast() {
    if (document.getElementById('nexbot-preview-toast')) return;

    const toast = document.createElement('div');
    toast.id = 'nexbot-preview-toast';
    toast.setAttribute('role', 'region');
    toast.setAttribute('aria-label', 'Entwurfshinweis');
    toast.innerHTML = `
      <div class="pn-header">
        <span class="pn-badge">
          <span class="pn-pulse"></span>
          <span>Nexbot Webdesign • Portfolio-Entwurf</span>
        </span>
        <button type="button" class="pn-close-btn" id="pn-toast-close" title="Hinweis schließen">
          ${ICONS.close}
        </button>
      </div>
      
      <div class="pn-title">Unverbindliche Design- & Technologie-Vorschau</div>
      <div class="pn-body">
        Dies ist ein freier Gestaltungsentwurf zu Demonstrationszwecken. Kein offizieller Webauftritt des Unternehmens. Marken- & Bildrechte liegen bei den Inhabern.
      </div>

      <div class="pn-actions">
        <button type="button" class="pn-btn-primary" id="pn-toast-ack">
          <span>Verstanden ✕</span>
        </button>
        <button type="button" class="pn-btn-secondary" id="pn-toast-details">
          Rechtliche Hinweise & Details
        </button>
      </div>
    `;

    document.body.appendChild(toast);

    function dismissToast() {
      toast.classList.remove('pn-visible');
      setDismissed();
      setTimeout(function () {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 400);
    }

    toast.querySelector('#pn-toast-close').addEventListener('click', dismissToast);
    toast.querySelector('#pn-toast-ack').addEventListener('click', dismissToast);
    toast.querySelector('#pn-toast-details').addEventListener('click', function () {
      openLegalModal();
    });

    // Slight delay for smooth entrance
    setTimeout(function () {
      toast.classList.add('pn-visible');
    }, 450);
  }

  function init() {
    renderFloatingPill();
    if (!isDismissed()) {
      renderNoticeToast();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
