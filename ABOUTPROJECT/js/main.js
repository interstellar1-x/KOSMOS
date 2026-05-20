/**
 * ABOUT PROJECT — Main application script
 * Handles language switching, smooth scroll, and active nav detection
 */

(() => {
  'use strict';

  // ---------- State (synced with site-wide kosmos-lang) ----------
  const LANG_KEY = 'kosmos-lang';
  let currentLang = (() => {
    try {
      return localStorage.getItem(LANG_KEY) === 'pl' ? 'pl' : 'en';
    } catch {
      return 'en';
    }
  })();

  // ---------- DOM refs ----------
  const langBtns = document.querySelectorAll('.lang-btn');
  const navLinks = document.querySelectorAll('.nav-link');

  // ---------- Flattened key lookup ----------
  function getValueByKey(obj, key) {
    return key.split('.').reduce((acc, part) => {
      if (acc && typeof acc === 'object' && part in acc) {
        return acc[part];
      }
      // Handle array index access like sources.items.0.label
      const idx = parseInt(part, 10);
      if (Array.isArray(acc) && !isNaN(idx) && idx < acc.length) {
        return acc[idx];
      }
      return undefined;
    }, obj);
  }

  // ---------- Language Switch ----------
  function setLanguage(lang) {
    currentLang = lang;
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch {
      /* ignore */
    }
    document.documentElement.lang = lang;
    window.dispatchEvent(new CustomEvent('kosmos-lang-change', { detail: { lang } }));

    // Update active button
    langBtns.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // Translate all elements with data-key
    document.querySelectorAll('[data-key]').forEach((el) => {
      const key = el.dataset.key;
      const value = getValueByKey(contentData[lang], key);

      if (value !== undefined) {
        // For anchor tags with href, just update text
        // For regular elements, update innerText
        el.textContent = value;
      }
    });
  }

  // ---------- Lang button events ----------
  langBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      if (lang !== currentLang) {
        setLanguage(lang);
      }
    });
  });

  // ---------- Smooth scroll for nav links ----------
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').slice(1);
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---------- Active nav highlight on scroll ----------
  const sections = document.querySelectorAll('.section[id]');

  function updateActiveNav() {
    const scrollY = window.scrollY + 120;
    let activeId = null;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      if (scrollY >= top && scrollY < bottom) {
        activeId = section.id;
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute('href').slice(1);
      link.style.color = href === activeId ? '#8ed0ff' : '';
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // ---------- Init ----------
  setLanguage(currentLang);
})();