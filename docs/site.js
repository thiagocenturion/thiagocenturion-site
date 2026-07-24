/* Thiago Centurion Apps — dynamic rendering + interactions
   All app content flows from apps.json (single source of truth).
   Mock phone screens are pure CSS/SVG so the site ships with zero images;
   set `icon` / `screenshot` paths in apps.json to swap in real artwork. */

(() => {
  'use strict';

  const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FINE_POINTER = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ------------------------------------------------------------------ *
   * Data
   * ------------------------------------------------------------------ */

  async function loadData() {
    try {
      const res = await fetch('apps.json');
      if (!res.ok) throw new Error(res.statusText);
      return await res.json();
    } catch (err) {
      console.warn('apps.json fetch failed, using embedded fallback:', err);
      return FALLBACK_DATA;
    }
  }

  /* ------------------------------------------------------------------ *
   * SVG helpers — per-app glyphs + feature icons
   * ------------------------------------------------------------------ */

  const GLYPHS = {
    sustain: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 3a9 9 0 1 1-8.5 6"/><path d="M3 6.5h4"/></svg>`,
    anchor: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="4.2" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="8.4" opacity="0.55"/></svg>`,
    pawvet: `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="8" cy="8.4" r="1.9"/><circle cx="16" cy="8.4" r="1.9"/><circle cx="4.9" cy="12.6" r="1.7"/><circle cx="19.1" cy="12.6" r="1.7"/><path d="M12 11.4c-2.9 0-5.2 2.5-5.2 4.9 0 1.6 1.2 2.7 2.8 2.7 1 0 1.6-.4 2.4-.4s1.4.4 2.4.4c1.6 0 2.8-1.1 2.8-2.7 0-2.4-2.3-4.9-5.2-4.9z"/></svg>`,
    glucolens: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21"/><path d="M7 11.5c1.2 0 1.4-2.6 2.6-2.6s1.6 2.6 3 2.6" stroke-width="1.8"/></svg>`,
    pouchdrop: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"><path d="M2.5 14c2.4 0 2.4-4 4.8-4s2.4 4 4.8 4 2.4-4 4.7-4 2.4 4 4.7 4"/><path d="M6 19h12" opacity="0.5"/></svg>`,
    rallylog: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="9.5" cy="14.5" r="5"/><path d="M13.5 4.5c3.5 1 6 4.4 6 8.3"/><path d="M15.5 2.5l-2 2 2 2"/></svg>`,
    gridline: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M3.5 9h17M3.5 15h17M9 3.5v17M15 3.5v17" opacity="0.5"/><rect x="14.6" y="8.6" width="6.8" height="6.8" rx="1.8" fill="currentColor" stroke="none"/></svg>`
  };

  const FEATURE_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5 10 17.5 19 7"/></svg>`;

  const VALUE_ICONS = {
    lock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4.5" y="10.5" width="15" height="10" rx="3"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/></svg>`,
    heart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 20s-7.5-4.6-9.3-9.3C1.5 7.4 3.6 4.5 6.8 4.5c2 0 3.6 1.1 4.4 2.7l.8 1.5.8-1.5c.8-1.6 2.4-2.7 4.4-2.7 3.2 0 5.3 2.9 4.1 6.2C19.5 15.4 12 20 12 20z"/></svg>`,
    consent: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="8.5"/><path d="M8.5 12.5 11 15l4.5-5.5"/></svg>`,
    cancel: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2.5"/></svg>`,
    device: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2" stroke-linecap="round"/></svg>`,
    human: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="3.6"/><path d="M4.5 20c1.2-3.6 4-5.5 7.5-5.5s6.3 1.9 7.5 5.5"/></svg>`
  };

  const VALUES = [
    { icon: 'lock', title: 'No accounts. Ever.', text: 'Your data lives on your device and your own iCloud — not our servers. There is nothing to sign up for and nothing to leak.' },
    { icon: 'heart', title: 'No streaks, no shame', text: 'No guilt mechanics, no red badges, no "you missed 3 days." A bad day costs you nothing in any of our apps.' },
    { icon: 'consent', title: 'AI with real consent', text: 'When an app uses AI, the consent screen names the provider, shows exactly what leaves your device, and stays revocable in Settings.' },
    { icon: 'cancel', title: 'Cancel in 10 seconds', text: 'Honest trial timelines before you pay, a reminder before billing, and cancellation that takes seconds — not a maze.' },
    { icon: 'device', title: 'On-device first', text: 'Voice is transcribed on your phone, health math is computed locally, and audio never leaves the device. Cloud is the exception, not the rule.' },
    { icon: 'human', title: 'One builder, all in', text: 'Every screen, every animation, every word is crafted by one person who ships fast and answers support email personally.' }
  ];

  /* ------------------------------------------------------------------ *
   * Mock phone screens (per app, zero images)
   * ------------------------------------------------------------------ */

  const MOCKS = {
    sustain: () => `
      <div class="m-title">Today</div>
      <div class="m-sub">Wednesday · shot day + 2</div>
      <div class="m-ring-wrap">
        <svg width="132" height="132" viewBox="0 0 132 132">
          <defs><linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="var(--a1)"/><stop offset="1" stop-color="var(--a2)"/>
          </linearGradient></defs>
          <circle cx="66" cy="66" r="48" fill="none" stroke="rgba(255,255,255,0.09)" stroke-width="11"/>
          <circle class="m-ring-fg" cx="66" cy="66" r="48" fill="none" stroke-width="11"/>
        </svg>
        <div class="m-ring-label"><b>112g</b><span>of 120g floor</span></div>
      </div>
      <div class="m-card m-row"><span>🍳 <b>Omelette + skyr</b><br><span class="dim">scanned · 34g protein</span></span><span class="m-chip">+8g fix →</span></div>
      <div class="m-card m-row"><span>💉 <b>Next shot Friday</b><br><span class="dim">rotate to left thigh</span></span><span class="m-chip">Muscle ✓</span></div>`,

    anchor: () => `
      <div class="m-title">Session</div>
      <div class="m-sub">12 min · chore mode</div>
      <div class="m-orb"></div>
      <div class="m-card" style="text-align:center;"><b>"We're just standing at the sink. That's the whole job."</b></div>
      <div class="m-card m-row"><span class="dim">Check-in</span><span class="m-chip">Still with you</span></div>
      <div class="m-card m-row"><span>🏆 <b>Pile of wins</b><br><span class="dim">dishes · laundry · that email</span></span><span class="m-chip">+3 today</span></div>`,

    pawvet: () => `
      <div class="m-title">Luna 🐕</div>
      <div class="m-sub">Golden Retriever · 4y · 28kg</div>
      <div class="m-card">
        <div class="m-row"><b>Skin scan result</b><span class="m-chip">92% match</span></div>
        <div class="m-meter"><i class="on-green"></i><i class="on-amber"></i><i></i></div>
        <b style="color:#fbbf24;">Monitor at home</b>
        <div class="dim">Likely hot spot — recheck in 24h</div>
      </div>
      <div class="m-card">
        <b>Do tonight</b>
        <div class="m-check"><span class="tick">✓</span> Clip fur around the patch</div>
        <div class="m-check"><span class="tick">✓</span> Cool compress, 5 minutes</div>
        <div class="m-check"><span class="tick" style="opacity:.4;">·</span> Block licking (cone or shirt)</div>
      </div>`,

    glucolens: () => `
      <div class="m-title">Tonight's Autopsy</div>
      <div class="m-sub">Tuesday · sensor synced 9:41 PM</div>
      <div class="m-card" style="position:relative; padding-bottom:6px;">
        <div class="m-curve">
          <svg viewBox="0 0 240 90" width="100%">
            <defs><linearGradient id="curveGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stop-color="var(--a2)"/><stop offset="0.55" stop-color="var(--a1)"/><stop offset="1" stop-color="var(--a2)"/>
            </linearGradient></defs>
            <path class="line" d="M4 62 C 30 58, 44 40, 62 44 S 92 78, 118 70 S 150 18, 172 26 S 210 60, 236 52"/>
          </svg>
          <span class="m-pin" style="left:22%; top:26%;">🥣</span>
          <span class="m-pin" style="left:64%; top:2%;">🍜</span>
        </div>
      </div>
      <div class="m-card m-row"><span>🍜 <b>Ramen, 1:12 PM</b><br><span class="dim">your #1 spiker today</span></span><span class="m-chip">+58 mg/dL</span></div>
      <div class="m-card m-row"><span>🚶 <b>10-min walk</b><br><span class="dim">experiment verdict</span></span><span class="m-chip">cut it 41%</span></div>`,

    pouchdrop: () => `
      <div class="m-title">Craving wave</div>
      <div class="m-sub">Hold on — it dies at 3:00</div>
      <div class="m-timer">2:41</div>
      <div class="m-wave-window">
        <div class="m-wave-track">
          <svg viewBox="0 0 200 74" preserveAspectRatio="none"><path d="M0 52 C 22 52, 28 18, 50 18 S 78 52, 100 52 S 128 18, 150 18 S 178 52, 200 52" fill="none" stroke="var(--a1)" stroke-width="3" stroke-linecap="round"/></svg>
          <svg viewBox="0 0 200 74" preserveAspectRatio="none"><path d="M0 52 C 22 52, 28 18, 50 18 S 78 52, 100 52 S 128 18, 150 18 S 178 52, 200 52" fill="none" stroke="var(--a1)" stroke-width="3" stroke-linecap="round"/></svg>
        </div>
      </div>
      <div class="m-card m-row"><span>💰 <b>$438.50 back</b><br><span class="dim">since your quit date</span></span><span class="m-chip">day 19</span></div>
      <div class="m-card m-row"><span>🫀 <b>72h nicotine-free</b><br><span class="dim">recovery milestone</span></span><span class="m-chip">stamped ✦</span></div>`,

    rallylog: () => `
      <div class="m-title">Court Mode</div>
      <div class="m-sub">Game 3 · vs. Ana &amp; Marco</div>
      <div class="m-card" style="text-align:center;">
        <div class="m-score"><span>11</span><span class="vs">—</span><span>8</span></div>
        <span class="m-chip">match logged · 30s</span>
      </div>
      <div class="m-card">
        <div class="m-row"><b>RallyLog Rating</b><span class="m-chip">3.82 ↑</span></div>
        <div class="m-spark">
          <svg viewBox="0 0 220 54" width="100%">
            <defs><linearGradient id="sparkGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stop-color="var(--a2)"/><stop offset="1" stop-color="var(--a1)"/>
            </linearGradient></defs>
            <path d="M4 44 L 34 40 L 62 44 L 92 32 L 122 36 L 152 22 L 182 26 L 216 10"/>
          </svg>
        </div>
      </div>
      <div class="m-card m-row"><span>🎯 <b>Scouting report</b><br><span class="dim">your backhand third shot leaks</span></span><span class="m-chip">1 drill →</span></div>`,

    gridline: () => `
      <div class="m-title">Today</div>
      <div class="m-sub">Wednesday · the same three, worldwide</div>
      <div class="m-card" style="text-align:center;">
        <svg viewBox="0 0 96 96" width="92" height="92" style="display:block;margin:0 auto 8px;">
          <g fill="none" stroke="rgba(255,255,255,0.16)" stroke-width="1.5">
            <rect x="1" y="1" width="94" height="94" rx="10"/>
            <path d="M32.3 1v94M63.6 1v94M1 32.3h94M1 63.6h94"/>
          </g>
          <rect x="37.5" y="5.5" width="21.5" height="21.5" rx="5" fill="var(--a1)"/>
          <path d="M42.5 22.5l-1.2-5.6 3 1.9 2-3.2 2 3.2 3-1.9-1.2 5.6z" fill="#1E1E24"/>
          <rect x="68.5" y="37" width="21.5" height="21.5" rx="5" fill="var(--a2)" opacity="0.85"/>
          <rect x="6" y="68.5" width="21.5" height="21.5" rx="5" fill="var(--a1)" opacity="0.45"/>
        </svg>
        <span class="m-chip">Crown · Duet · Thread</span>
      </div>
      <div class="m-card m-row"><span>👑 <b>Crown solved clean</b><br><span class="dim">1:42 · no hints</span></span><span class="m-chip">that snap ✦</span></div>
      <div class="m-card m-row"><span>🔥 <b>41-day flame</b><br><span class="dim">spoiler-free share card ready</span></span><span class="m-chip">share →</span></div>`
  };

  /* ------------------------------------------------------------------ *
   * Renderers
   * ------------------------------------------------------------------ */

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function glyphHTML(app, size) {
    if (app.icon) {
      return `<img class="app-glyph" src="${esc(app.icon)}" alt="" width="${size}" height="${size}" style="width:${size}px;height:${size}px;object-fit:cover;">`;
    }
    return `<span class="app-glyph" style="--a1:${esc(app.accent)};--a2:${esc(app.accent2)};width:${size}px;height:${size}px;">${GLYPHS[app.id] || GLYPHS.anchor}</span>`;
  }

  function renderRail(apps) {
    const rail = document.getElementById('app-rail');
    if (!rail) return;
    const chips = apps.map((app) => `
      <a class="rail-chip glass" href="#app-${esc(app.id)}" tabindex="-1">
        ${glyphHTML(app, 40)}
        <span><b>${esc(app.name)}</b><span>${esc(app.tagline)}</span></span>
      </a>`).join('');
    rail.innerHTML = `<div class="rail-track">${chips}${chips}</div>`;
  }

  function ctaHTML(app) {
    if (app.status === 'live') {
      return `<a class="btn btn-accent" href="${esc(app.appStoreUrl)}" target="_blank" rel="noopener">
                Download on the App Store</a>`;
    }
    const subject = encodeURIComponent(`Notify me when ${app.name} launches`);
    return `<span class="btn btn-glass glass" style="cursor:default;" aria-disabled="true">Coming soon to the App&nbsp;Store</span>
            <a class="btn btn-accent" href="mailto:support@thiagocenturion.com?subject=${subject}">Get launch alert</a>`;
  }

  function renderShowcases(apps) {
    const host = document.getElementById('showcases');
    if (!host) return;
    host.innerHTML = apps.map((app, i) => {
      const flip = i % 2 === 1;
      const badge = app.status === 'live'
        ? '<span class="badge-live">Live</span>'
        : `<span class="badge-soon">${esc(app.badge || 'Coming soon')}</span>`;
      const features = app.features.map((f, j) => `
        <li class="feature-item glass reveal" style="--d:${j + 2}">
          <span class="f-ico">${FEATURE_ICON}</span>
          <span><b>${esc(f.title)}</b><p>${esc(f.text)}</p></span>
        </li>`).join('');
      // Store screenshots are finished App Store marketing frames (caption +
      // phone mockup on a backdrop), so they render as a standalone card —
      // wrapping them in the CSS phone would double-frame them. The CSS phone
      // mock is only used when no real screenshot exists.
      const visual = app.screenshot
        ? `<div class="store-card" data-tilt>
             <img src="${esc(app.screenshot)}" alt="${esc(app.name)} App Store screenshot" loading="lazy">
           </div>`
        : `<div class="phone" data-tilt>
             <div class="phone-frame">
               <div class="phone-screen">
                 <div class="phone-island"></div>
                 <div class="phone-status"><span>9:41</span><span aria-hidden="true"><svg width="34" height="10" viewBox="0 0 34 10" fill="currentColor"><rect x="0" y="6" width="2.5" height="4" rx="1"/><rect x="4" y="4" width="2.5" height="6" rx="1"/><rect x="8" y="2" width="2.5" height="8" rx="1"/><rect x="12" y="0" width="2.5" height="10" rx="1"/><rect x="20" y="1" width="12" height="8" rx="2.5" fill="none" stroke="currentColor" stroke-width="1"/><rect x="22" y="3" width="7" height="4" rx="1"/><rect x="33" y="3.5" width="1" height="3" rx="0.5"/></svg></span></div>
                 ${(MOCKS[app.id] || (() => ''))()}
               </div>
             </div>
           </div>`;
      // split hook: last 2-3 words get the gradient
      const words = app.hook.split(' ');
      const cut = Math.max(1, words.length - (words.length > 8 ? 3 : 2));
      const hook = `${esc(words.slice(0, cut).join(' '))} <em>${esc(words.slice(cut).join(' '))}</em>`;

      return `
      <section class="showcase ${flip ? 'flip' : ''}" id="app-${esc(app.id)}"
               style="--a1:${esc(app.accent)};--a2:${esc(app.accent2)};--tint-x:${flip ? '18%' : '82%'};">
        <div class="container showcase-inner">
          <div class="showcase-copy">
            <div class="app-head reveal">
              ${glyphHTML(app, 58)}
              <span class="app-title"><b>${esc(app.name)}</b><span>${esc(app.category)} · ${esc(app.storeName)}</span></span>
              ${badge}
            </div>
            <h3 class="showcase-hook reveal" style="--d:1">${hook}</h3>
            <p class="showcase-sub reveal" style="--d:1">${esc(app.subtitle)}</p>
            <ul class="feature-list">${features}</ul>
            <div class="platform-tags reveal" style="--d:5">
              ${app.platforms.map((p) => `<span>${esc(p)}</span>`).join('')}
            </div>
            <div class="showcase-actions reveal" style="--d:5">${ctaHTML(app)}</div>
          </div>
          <div class="showcase-visual reveal-scale" style="--d:2">
            <div class="visual-orb"></div>
            ${visual}
          </div>
        </div>
      </section>`;
    }).join('');
  }

  function renderValues() {
    const host = document.getElementById('values-grid');
    if (!host) return;
    host.innerHTML = VALUES.map((v, i) => `
      <div class="value-card glass spotlight reveal" style="--d:${i % 3}">
        <span class="v-ico">${VALUE_ICONS[v.icon]}</span>
        <h3>${esc(v.title)}</h3>
        <p>${esc(v.text)}</p>
      </div>`).join('');
  }

  const NUM_WORDS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve'];

  function renderCounts(data) {
    // app count is derived from the data so adding an app never leaves stale copy
    const n = data.apps.length;
    const stat = document.getElementById('stat-app-count');
    if (stat) stat.dataset.count = n;
    const eyebrow = document.getElementById('hero-eyebrow-text');
    if (eyebrow) eyebrow.textContent = `${NUM_WORDS[n] || n} apps, hand-built in Portugal · iOS-native`;
  }

  function renderFooter(data) {
    const list = document.getElementById('footer-apps');
    if (list) {
      list.innerHTML = data.apps.map((a) =>
        `<li><a href="#app-${esc(a.id)}">${esc(a.name)}</a></li>`).join('');
    }
    const year = document.getElementById('current-year');
    if (year) year.textContent = new Date().getFullYear();
    for (const id of ['brand-name', 'footer-brand', 'footer-brand-2']) {
      const el = document.getElementById(id);
      if (el) el.textContent = data.brand.name;
    }
    const tagline = document.getElementById('footer-tagline');
    if (tagline) tagline.textContent = data.brand.tagline;
  }

  /* ------------------------------------------------------------------ *
   * Interactions
   * ------------------------------------------------------------------ */

  function splitHeroWords() {
    const h1 = document.getElementById('hero-title');
    if (!h1 || REDUCED_MOTION) return;
    let i = 0;
    const wrap = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        for (const token of node.textContent.split(/(\s+)/)) {
          if (!token) continue;
          if (/^\s+$/.test(token)) { frag.appendChild(document.createTextNode(token)); continue; }
          const w = document.createElement('span');
          w.className = 'w';
          w.style.setProperty('--i', i++);
          w.textContent = token;
          frag.appendChild(w);
        }
        node.replaceWith(frag);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.classList.contains('grad')) {
          // animate gradient text as one unit — splitting its words would
          // break background-clip: text on the children
          node.classList.add('w');
          node.style.setProperty('--i', i++);
        } else {
          [...node.childNodes].forEach(wrap);
        }
      }
    };
    [...h1.childNodes].forEach(wrap);
  }

  function observeReveals() {
    const els = document.querySelectorAll('.reveal, .reveal-scale');
    if (REDUCED_MOTION || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        // reveal when entering view — or when fast scrolling skipped right past
        if (e.isIntersecting || e.boundingClientRect.top < 0) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach((el) => io.observe(el));
  }

  function animateCounters() {
    const els = document.querySelectorAll('[data-count]');
    if (!els.length) return;
    const run = (el) => {
      const target = parseInt(el.dataset.count, 10);
      if (REDUCED_MOTION || target === 0) { el.textContent = target; return; }
      const t0 = performance.now();
      const dur = 1400;
      const tick = (t) => {
        const p = Math.min(1, (t - t0) / dur);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting || e.boundingClientRect.top < 0) {
          run(e.target);
          io.unobserve(e.target);
        }
      }
    }, { threshold: 0.6 });
    els.forEach((el) => io.observe(el));
  }

  function initTilt() {
    if (!FINE_POINTER || REDUCED_MOTION) return;
    document.querySelectorAll('[data-tilt]').forEach((card) => {
      const parent = card.closest('.showcase-visual') || card;
      parent.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const rx = ((e.clientY - r.top) / r.height - 0.5) * -10;
        const ry = ((e.clientX - r.left) / r.width - 0.5) * 12;
        card.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
      });
      parent.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  function initSpotlight() {
    if (!FINE_POINTER) return;
    document.querySelectorAll('.spotlight').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - r.left}px`);
        el.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });
  }

  function initNav() {
    const nav = document.getElementById('nav');
    const progress = document.getElementById('scroll-progress');
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      if (nav) nav.classList.toggle('scrolled', y > 24);
      if (progress) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
      }
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();

    // mobile menu
    const burger = document.getElementById('nav-burger');
    const menu = document.getElementById('mobile-menu');
    if (burger && menu) {
      const setOpen = (open) => {
        burger.setAttribute('aria-expanded', String(open));
        menu.classList.toggle('open', open);
        menu.setAttribute('aria-hidden', String(!open));
        document.body.style.overflow = open ? 'hidden' : '';
      };
      burger.addEventListener('click', () =>
        setOpen(burger.getAttribute('aria-expanded') !== 'true'));
      menu.querySelectorAll('a').forEach((a) =>
        a.addEventListener('click', () => setOpen(false)));
    }
  }

  /* ------------------------------------------------------------------ *
   * Boot
   * ------------------------------------------------------------------ */

  async function boot() {
    const data = await loadData();
    renderRail(data.apps);
    renderShowcases(data.apps);
    renderValues();
    renderCounts(data);
    renderFooter(data);
    splitHeroWords();
    observeReveals();
    animateCounters();
    initTilt();
    initSpotlight();
    initNav();
  }

  /* Embedded fallback so the page renders even when opened via file:// */
  const FALLBACK_DATA = {
    brand: {
      name: 'Thiago Centurion Apps',
      tagline: 'Deeply-crafted iOS apps for the problems you thought you just had to live with.'
    },
    apps: [
      { id: 'sustain', name: 'Sustain', storeName: 'Sustain: GLP-1 Tracker & Coach', category: 'Health & Fitness', tagline: 'Lose the weight. Keep the muscle.', hook: 'On a GLP-1, up to 40% of what you lose can be muscle.', subtitle: 'The companion that protects it: protein-first meal scans, shot tracking, side-effect coaching, and the only taper plan for life after the medication.', status: 'coming_soon', badge: 'Coming soon', platforms: ['iOS', 'Widgets', 'Siri', 'HealthKit'], accent: '#FF7A66', accent2: '#F7C873', appStoreUrl: '#', icon: 'assets/icons/sustain.png', screenshot: 'assets/screens/sustain.png', features: [
        { title: 'Protein-first meal scans', text: 'Snap any meal — even a tiny one — and get protein math in seconds, plus the smallest fix to reach your daily floor.' },
        { title: 'Shot tracker with site rotation', text: 'A body map that remembers where you injected and suggests the next site. Reminders on your schedule.' },
        { title: 'Side-effect coach', text: 'Log nausea or fatigue in one tap and see your personal pattern by day-after-shot, with evidence-based tips.' },
        { title: 'Taper Mode', text: 'The only structured off-ramp: adjusted targets and coaching for keeping the results after the medication.' }] },
      { id: 'anchor', name: 'Anchor', storeName: 'Anchor: ADHD Body Double', category: 'Productivity', tagline: 'A voice that sits with you while you do the thing.', hook: 'You know what you need to do. Starting is the hard part.', subtitle: "A body double on demand: tell it what you're avoiding, and a calm voice gives you one tiny first step — then stays with you until it's done.", status: 'coming_soon', badge: 'Coming soon', platforms: ['iOS', 'Widgets', 'Siri', 'Live Activity'], accent: '#F5B971', accent2: '#B9B4D9', appStoreUrl: '#', icon: 'assets/icons/anchor.png', screenshot: null, features: [
        { title: 'Body doubling on demand', text: "No scheduling, no video calls, no strangers. A warm voice whenever you're stuck — even with the screen locked." },
        { title: 'Tasks shrunk until startable', text: '"Just stand in the kitchen holding a trash bag." Stuck? Say so. The step gets smaller. It always gets smaller.' },
        { title: 'No streaks. Ever.', text: 'No guilt mechanics, no red badges, no task graveyard. A bad day costs you nothing.' },
        { title: 'Unstick from the Lock Screen', text: 'An "I can\'t start" Siri shortcut and a Lock-Screen button for frozen moments. Sessions live in your Dynamic Island.' }] },
      { id: 'pawvet', name: 'PawVet AI', storeName: 'PawVet AI: Pet Health Scanner', category: 'Lifestyle', tagline: 'Is it serious? Know in seconds.', hook: "It's 11pm and your dog is scratching a red patch. Google says everything. Your vet opens at 8.", subtitle: 'A calm, breed-aware answer in seconds: what it looks like, how urgent it is, and exactly what to do tonight. Guidance, not diagnosis.', status: 'coming_soon', badge: 'Coming soon', platforms: ['iOS', 'Widgets', 'Siri', 'Share Sheet'], accent: '#2DD4BF', accent2: '#5EEAD4', appStoreUrl: '#', icon: 'assets/icons/pawvet.png', screenshot: null, features: [
        { title: 'Point. Scan. Breathe.', text: "Skin, eyes and ears, poop, wounds, food labels, or something they just ate — read against your pet's breed, age, and history." },
        { title: '"They ate something" checks, 24/7', text: 'Chocolate, grapes, plants, and more — with a clear urgency level: monitor at home, call your vet, or emergency now.' },
        { title: 'A timeline that spots patterns', text: 'Every check remembered. Recurring issues surfaced before they become big ones.' },
        { title: 'Vet Visit Briefs', text: "Your pet's history as a clean PDF, so you walk into the clinic prepared." }] },
      { id: 'glucolens', name: 'GlucoLens', storeName: 'GlucoLens: CGM Insights & AI', category: 'Health & Fitness', tagline: 'Know exactly what spiked you.', hook: 'You bought the sensor. Now get the answers.', subtitle: 'GlucoLens reads the glucose data your CGM writes to Apple Health and delivers a nightly Glucose Autopsy: your spikers, your heroes, your next experiment.', status: 'coming_soon', badge: 'Coming soon', platforms: ['iOS', 'Widgets', 'HealthKit'], accent: '#818CF8', accent2: '#86EFAC', appStoreUrl: '#', icon: 'assets/icons/glucolens.png', screenshot: null, features: [
        { title: 'The Nightly Glucose Autopsy', text: 'Every evening: which meal spiked you (named, with the number), what flattened the curve, and one experiment for tomorrow.' },
        { title: 'Your whole day, one curve', text: 'Meals pinned right on the line — snap a photo and the pin drops at its timestamp. Touch the curve to magnify any moment.' },
        { title: 'Meet your spikers', text: 'The foods that actually move you — and the "surprisingly fine" list of expected spikers that weren\'t.' },
        { title: 'Experiments with verdicts', text: 'Meal order, a 10-minute walk, an earlier dinner — two days, two curves, an honest verdict: "cut your spike 41%."' }] },
      { id: 'pouchdrop', name: 'PouchDrop', storeName: 'PouchDrop — Quit Nicotine', category: 'Health & Fitness', tagline: 'Cravings die in 3 minutes. We play those minutes with you.', hook: "You've done the math on the cans. Now do something about it.", subtitle: "One-tap logging, a taper that fits your life, your body's recovery ticking live — and a voice coach for the 3 minutes that matter. No lectures. No shame.", status: 'coming_soon', badge: 'Coming soon', platforms: ['iOS', 'Widgets', 'Lock Screen'], accent: '#5EEAD4', accent2: '#F5D06F', appStoreUrl: '#', icon: 'assets/icons/pouchdrop.png', screenshot: null, features: [
        { title: 'The 3-minute wave', text: 'Cravings crest at 90 seconds and die at three minutes. Hold the panic button and the coach talks you through — win logged.' },
        { title: 'A taper on your schedule', text: 'Pick the date of your last can and the daily target walks itself down. Slips log honestly and never nuke your clean days.' },
        { title: 'Your body, healing live', text: '20 minutes to a calmer heart rate, 72 hours to nicotine-free, 1 month to rebalanced dopamine — gold-stamped as you pass each one.' },
        { title: 'The money comes home', text: 'Your can price × your habit = your counter. Watch it climb in real time.' }] },
      { id: 'rallylog', name: 'RallyLog', storeName: 'RallyLog: Pickleball & Padel', category: 'Sports', tagline: 'You know you lost. RallyLog knows why.', hook: 'Log a match in 30 seconds. Get a scouting report on YOUR game.', subtitle: 'AI scouting reports, drills that fix your real leaks, and pre-match briefs on every recurring opponent. Built for players who play to improve.', status: 'coming_soon', badge: 'Coming soon', platforms: ['iOS', 'Widgets', 'Live Activity'], accent: '#A3E635', accent2: '#38BDF8', appStoreUrl: '#', icon: 'assets/icons/rallylog.png', screenshot: null, features: [
        { title: 'Your personal scout', text: 'After every match: which patterns cost you points, what\'s working, and the ONE five-minute drill to run before next game.' },
        { title: 'A rating you can watch climb', text: 'An honest estimate built from every match you log — with a trajectory chart and projection. Track your official DUPR alongside it.' },
        { title: 'Never forget how to beat Ana', text: 'Every recurring opponent gets a card: head-to-head record, what worked in your wins, and a pre-match brief the morning you play them.' },
        { title: 'Court Mode', text: 'Keep score on your Lock Screen and Dynamic Island — giant tap targets, +1 without unlocking, and the finished match logs itself.' }] },
      { id: 'gridline', name: 'Gridline', storeName: 'Gridline: Daily Logic Puzzle', category: 'Games', tagline: 'The daily logic club with taste.', hook: 'Three tiny logic puzzles a day — the same three for the whole world.', subtitle: 'Crown, Duet, Thread: three original grid puzzles every morning, solver-verified, under 5 minutes. No ads ever, no lives, no nagging — just the snap of a clean solve and your streak. The daily is free. Forever.', status: 'coming_soon', badge: 'Coming soon', platforms: ['iOS', 'Widgets', 'Live Activity', 'Lock Screen'], accent: '#C9A15A', accent2: '#7B5EA7', appStoreUrl: '#', icon: 'assets/icons/gridline.png', screenshot: null, features: [
        { title: 'Three originals, every morning', text: 'Crown, Duet, Thread — each generated and verified to have exactly one solution, with a difficulty curve that ramps gently from Monday to a chunky Sunday.' },
        { title: 'Logic that respects you', text: 'Mistakes glow softly — no lives, no lockouts, no timers screaming at you. One gentle hint per puzzle teaches the technique, never the answer.' },
        { title: 'Same puzzles as your friends', text: 'The whole world gets the same three. Share the spoiler-free card, compare your solves, and keep the flame alive — streak repair included, because life happens.' },
        { title: 'Gridline Club', text: 'The full archive since day one, unlimited practice, Black Label hard variants, and full stats history. The daily never goes behind it.' }] }
    ]
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
