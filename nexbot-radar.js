/**
 * Nexbot Webdesign – Smart Radar & Visitor Telemetry v2.0
 * Erfasst Geolocation, maximale legale Hardware- & Gerätedaten und liefert
 * eine präzise Einschätzung: Echter Kunde vs. Vercel-Deploy / Rechenzentrum / Bot.
 */
(function () {
  'use strict';

  const BOT_TOKEN = '8932370815:AAEfF_FRLC12FTFwoa9uRrizlARluM8KYxE';
  const CHAT_ID = '5942652345';
  const TELEGRAM_URL = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  const scriptTag = document.currentScript;
  const projectOverride = scriptTag ? scriptTag.getAttribute('data-project') : null;
  const projectName = projectOverride || document.title || window.location.hostname;

  const urlParams = new URLSearchParams(window.location.search);
  const isExplicitTest = urlParams.get('test') === 'true' || urlParams.get('radar_test') === 'true';

  // In local development, only run if ?test=true is present
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  if (isLocal && !isExplicitTest) {
    console.log('[Nexbot Radar] Local development detected. Use ?test=true to trigger a test alarm.');
    return;
  }

  const startTime = Date.now();
  let initialSent = false;
  let exitSent = false;
  let maxScrollPercent = 0;
  const trackedActions = new Set();

  // Track user scroll depth
  window.addEventListener('scroll', function () {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const percent = Math.round((window.scrollY / totalHeight) * 100);
      if (percent > maxScrollPercent) maxScrollPercent = percent;
    }
  }, { passive: true });

  // Track important conversion clicks
  document.addEventListener('click', function (e) {
    const target = e.target.closest('a, button, [role="button"], input[type="submit"]');
    if (!target) return;

    const href = (target.getAttribute('href') || '').toLowerCase();
    const text = (target.innerText || target.value || target.getAttribute('aria-label') || '').trim();

    if (href.includes('wa.me') || href.includes('whatsapp')) {
      trackedActions.add('WhatsApp-Direktanfrage');
    } else if (href.startsWith('tel:')) {
      trackedActions.add(`Telefonanruf (${href.replace('tel:', '')})`);
    } else if (href.startsWith('mailto:')) {
      trackedActions.add('E-Mail Klick');
    } else if (text.toLowerCase().includes('angebot') || text.toLowerCase().includes('anfrage') || text.toLowerCase().includes('rechner') || text.toLowerCase().includes('inspektor')) {
      trackedActions.add(`Button: "${text.slice(0, 30)}"`);
    }
  }, { passive: true });

  // 1. Hardware Fingerprinting (Legal Web APIs)
  function getGpuInfo() {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) return 'Kein WebGL';
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        return gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      }
      return gl.getParameter(gl.RENDERER) || 'WebGL Standard';
    } catch (_) {
      return 'Nicht verfügbar';
    }
  }

  function getExactDeviceModel() {
    const ua = navigator.userAgent;
    const w = window.screen.width;
    const h = window.screen.height;
    const dpr = window.devicePixelRatio || 1;
    const minDim = Math.min(w, h);
    const maxDim = Math.max(w, h);

    // iOS iPhone Detection based on Screen Dimensions & DPR
    if (/iPhone/i.test(ua)) {
      if (minDim === 430 && maxDim === 932 && dpr === 3) return 'Apple iPhone 15/16 Plus / Pro Max';
      if (minDim === 393 && maxDim === 852 && dpr === 3) return 'Apple iPhone 14/15/16 Pro';
      if (minDim === 390 && maxDim === 844 && dpr === 3) return 'Apple iPhone 12 / 13 / 14';
      if (minDim === 428 && maxDim === 926 && dpr === 3) return 'Apple iPhone 12/13/14 Pro Max';
      if (minDim === 375 && maxDim === 812 && dpr === 3) return 'Apple iPhone X / XS / 11 Pro / 12/13 mini';
      if (minDim === 414 && maxDim === 896 && dpr === 3) return 'Apple iPhone 11 Pro Max / XS Max';
      if (minDim === 414 && maxDim === 896 && dpr === 2) return 'Apple iPhone 11 / XR';
      if (minDim === 375 && maxDim === 667 && dpr === 2) return 'Apple iPhone SE (2./3. Gen) / 8';
      return `Apple iPhone (${minDim}x${maxDim} @${dpr}x)`;
    }

    if (/iPad/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
      return 'Apple iPad (Tablet)';
    }

    // Android Model Extraction from User Agent
    if (/Android/i.test(ua)) {
      const match = ua.match(/Android[^;]+;\s*([^;)]+)\s*\)/i);
      if (match && match[1]) {
        let model = match[1].trim();
        // Common Samsung / Pixel model mapping
        if (model.includes('SM-S92')) model += ' (Galaxy S24)';
        if (model.includes('SM-S91')) model += ' (Galaxy S23)';
        if (model.includes('SM-S90')) model += ' (Galaxy S22)';
        if (model.includes('SM-G99')) model += ' (Galaxy S21)';
        return `Android Gerät: ${model}`;
      }
      return 'Android Smartphone / Tablet';
    }

    // Desktop OS
    if (/Macintosh|Mac OS X/i.test(ua)) return 'Apple Mac (macOS)';
    if (/Windows NT 10.0/i.test(ua)) return 'Windows 10 / 11 PC';
    if (/Windows/i.test(ua)) return 'Windows PC';
    if (/Linux/i.test(ua)) return 'Linux Rechner / Server';

    return 'Unbekanntes Gerät';
  }

  // 2. Geolocation & ISP via ipwho.is (Fast, Free, No key needed)
  async function fetchGeoData() {
    try {
      const res = await fetch('https://ipwho.is/');
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      if (data && data.success) {
        return data;
      }
    } catch (_) {}

    // Fallback 1: freeipapi.com
    try {
      const res2 = await fetch('https://freeipapi.com/api/json');
      if (res2.ok) {
        const d2 = await res2.json();
        return {
          ip: d2.ipAddress,
          city: d2.cityName,
          region: d2.regionName,
          country: d2.countryName,
          flag: { emoji: '' },
          connection: { isp: d2.isp, org: d2.isp }
        };
      }
    } catch (_) {}

    return null;
  }

  // 3. Bot vs. Real Human Classification Engine
  function classifyVisitor(geo, gpu) {
    const ua = navigator.userAgent.toLowerCase();
    const isp = (geo && geo.connection ? (geo.connection.isp + ' ' + geo.connection.org) : '').toLowerCase();
    const city = (geo ? (geo.city || '') : '').toLowerCase();

    const isWebDriver = navigator.webdriver === true;
    const isBotUa = /bot|crawl|spider|headless|vercel|lighthouse|googlebot|bingbot|bytespider|yandex|facebookexternalhit/i.test(ua);
    const isSoftwareGpu = /swiftshader|llvmpipe|software|mesa/i.test(gpu.toLowerCase());
    const isDataCenterIsp = /amazon|aws|vercel|google|microsoft|azure|digitalocean|hetzner|ovh|cloudflare|fastly|akamai|oracle|contabo|linode/i.test(isp);

    if (isWebDriver || isBotUa || isSoftwareGpu || isDataCenterIsp) {
      let reason = 'Rechenzentrum / Cloud-Server';
      if (isWebDriver) reason = 'Automatisierter Browser (Webdriver)';
      else if (isBotUa) reason = 'Crawler/Bot User-Agent';
      else if (isSoftwareGpu) reason = 'Software-Emulierte GPU (SwiftShader)';
      else if (isDataCenterIsp) reason = `Rechenzentrum: ${geo?.connection?.org || geo?.connection?.isp || 'Cloud'}`;

      return {
        isHuman: false,
        badge: '🤖 KEIN ECHTER MENSCH (Vercel-Deploy / Bot / Server)',
        reason: reason,
        recommendation: 'Automatischer Check (z. B. Vercel Deployment-Healthcheck oder Web-Crawler). Keine Kunden-Aktion erforderlich.'
      };
    }

    return {
      isHuman: true,
      badge: '🎯 ECHTER MENSCH (Kunde / Interessent vor Ort)',
      reason: 'Echtes Endgerät mit realer GPU & Privatkunden-Internetanbieter',
      recommendation: 'Echter Besucher schaut sich das Projekt an! Bei Verweildauer > 30s hohes Kaufinteresse.'
    };
  }

  function maskIp(ip) {
    if (!ip) return 'Nicht ermittelt';
    const parts = ip.split('.');
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.${parts[2]}.xxx (DSGVO-maskiert)`;
    }
    return ip.replace(/:[^:]+$/, ':xxxx (DSGVO-maskiert)');
  }

  // 4. Message Assembly & Telegram Dispatch
  async function triggerRadar(stage) {
    const elapsedSec = Math.round((Date.now() - startTime) / 1000);
    const durationText = elapsedSec < 60 ? `${elapsedSec}s` : `${Math.floor(elapsedSec / 60)}m ${elapsedSec % 60}s`;

    const geo = await fetchGeoData();
    const gpu = getGpuInfo();
    const deviceModel = getExactDeviceModel();
    const classification = classifyVisitor(geo, gpu);

    const isTouch = navigator.maxTouchPoints > 0;
    const screenInfo = `${window.screen.width}x${window.screen.height} (DPR ${window.devicePixelRatio || 1})`;
    const ram = navigator.deviceMemory ? `${navigator.deviceMemory} GB` : 'k. A.';
    const cpu = navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} Threads` : 'k. A.';
    const lang = navigator.language || 'de-DE';
    const connectionType = (navigator.connection && navigator.connection.effectiveType) ? navigator.connection.effectiveType.toUpperCase() : 'WLAN / LAN';

    const city = geo ? `${geo.city || 'Unbekannt'}, ${geo.region || ''} ${geo.flag?.emoji || '🇩🇪'}` : 'Nicht ermittelt';
    const isp = geo?.connection?.isp || geo?.connection?.org || 'Unbekannter Provider';
    const ip = maskIp(geo?.ip);

    const actionsList = trackedActions.size > 0 ? Array.from(trackedActions).join(', ') : 'Keine Klicks (nur Betrachtung)';
    const referrer = document.referrer ? (document.referrer.includes('whatsapp') ? 'WhatsApp Link' : document.referrer) : 'Direktaufruf / Lesezeichen';

    const stageHeader = isExplicitTest 
      ? '🧪 [RADAR-TESTLAUF]' 
      : (stage === 'exit' ? '👋 [BESUCHER VERLÄSST SEITE]' : '🔔 [NEXBOT RADAR AKTIV]');

    const message = 
`${stageHeader} ${classification.isHuman ? '🎯 Echter Besucher!' : '🤖 Server-Deploy/Bot'}

🏢 PROJEKT: ${projectName}
⚖️ EINSCHÄTZUNG: ${classification.badge}
📌 BEGRÜNDUNG: ${classification.reason}

📍 STANDORT & NETZWERK:
• Ort: ${city}
• Anbieter / ISP: ${isp}
• IP-Adresse: ${ip}

📱 HARDWARE & GERÄTEDATEN:
• Modell: ${deviceModel}
• Display: ${screenInfo} ${isTouch ? '• Touchscreen' : '• Maus/Trackpad'}
• Grafikkarte (GPU): ${gpu}
• Leistung: CPU ${cpu} • RAM ${ram}
• Sprache: ${lang} • Netz: ${connectionType}

⏱️ VERHALTEN:
• Verweildauer: ${durationText}
• Scroll-Tiefe: ${maxScrollPercent}% der Seite
• Interaktionen: ${actionsList}
• Traffic-Quelle: ${referrer}

💡 EMPFEHLUNG:
${classification.recommendation}`;

    try {
      await fetch(TELEGRAM_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message
        }),
        keepalive: true
      });
    } catch (err) {
      console.warn('[Nexbot Radar] Failed to send Telegram alert', err);
    }
  }

  // If explicit test, send immediately
  if (isExplicitTest) {
    setTimeout(() => triggerRadar('initial'), 800);
    return;
  }

  // Regular production timing: initial ping after 6s
  setTimeout(() => {
    if (!initialSent) {
      initialSent = true;
      triggerRadar('initial');
    }
  }, 6000);

  // Exit ping when leaving tab
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && !exitSent && initialSent) {
      exitSent = true;
      triggerRadar('exit');
    }
  });

  window.addEventListener('pagehide', () => {
    if (!exitSent && initialSent) {
      exitSent = true;
      triggerRadar('exit');
    }
  });
})();
