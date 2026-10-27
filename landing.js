/* ═══════════════════════════════════════════════════════════════
   AL-AFNA RISK MANAGER — LANDING PAGE (JS AUTONOME)
   IIFE isolée. Aucune variable globale exposée par défaut.
   ═══════════════════════════════════════════════════════════════ */
(function(){
  'use strict';

  const ROOT_KEY = 'alafna-landing-theme';
  const body = document.body;
  const html = document.documentElement;

  /* ── 1. THÈME (dark/light) ───────────────────── */
  function applyTheme(theme){
    body.setAttribute('data-theme', theme);
    html.setAttribute('data-theme', theme);
    try { localStorage.setItem(ROOT_KEY, theme); } catch(_) {}
  }

  function initTheme(){
    let saved = null;
    try { saved = localStorage.getItem(ROOT_KEY); } catch(_) {}
    if (!saved){
      saved = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    applyTheme(saved);
  }

  function bindThemeToggle(){
    const btn = document.getElementById('lpThemeBtn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const cur = body.getAttribute('data-theme');
      applyTheme(cur === 'light' ? 'dark' : 'light');
    });
  }

  /* ── 2. MATRICE ANIMÉE DU MOCKUP ─────────────── */
  function initMockMatrix(){
    const grid = document.getElementById('lpMockMatrix');
    if (!grid) return;

    const levelColor = s =>
      s >= 15 ? 'var(--lp-crit)' :
      s >= 9  ? 'var(--lp-high)' :
      s >= 4  ? 'var(--lp-med)'  :
                'var(--lp-low)';

    const frag = document.createDocumentFragment();
    let i = 0;
    for (let v = 1; v <= 5; v++){
      for (let imp = 1; imp <= 5; imp++){
        const score = v * imp;
        const cell = document.createElement('div');
        cell.className = 'lp-mockup-cell';
        cell.style.background = levelColor(score);
        cell.style.animationDelay = (i * 25) + 'ms';
        cell.textContent = score;
        frag.appendChild(cell);
        i++;
      }
    }
    grid.appendChild(frag);
  }

  /* ── 3. REVEAL AU SCROLL ─────────────────────── */
  function initReveal(){
    const els = document.querySelectorAll('.lp-reveal');
    if (!els.length) return;

    if (!('IntersectionObserver' in window)){
      els.forEach(e => e.classList.add('lp-visible'));
      return;
    }

    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          entry.target.classList.add('lp-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    els.forEach(e => io.observe(e));
  }

  /* ── 4. SPOTLIGHT CURSEUR SUR FEATURES ───────── */
  function initFeatureSpotlight(){
    document.querySelectorAll('.lp-feature').forEach(f => {
      f.addEventListener('mousemove', e => {
        const r = f.getBoundingClientRect();
        f.style.setProperty('--lp-mx', (e.clientX - r.left) + 'px');
        f.style.setProperty('--lp-my', (e.clientY - r.top) + 'px');
      });
    });
  }

  /* ── 5. SMOOTH SCROLL ANCRES ─────────────────── */
  function initSmoothScroll(){
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const id = a.getAttribute('href');
        if (id.length <= 1) return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /* ── INIT ────────────────────────────────────── */
  function init(){
    initTheme();
    bindThemeToggle();
    initMockMatrix();
    initReveal();
    initFeatureSpotlight();
    initSmoothScroll();
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();