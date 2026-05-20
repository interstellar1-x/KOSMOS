/**
 * KOSMOS — Site-wide i18n (EN / PL)
 * Shared language switch, footer, page titles, and nav labels.
 */

export const LANG_STORAGE_KEY = 'kosmos-lang';

export const I18N = {
  en: {
    nav: {
      navigate: 'Navigate',
      aboutProject: 'About Project',
      back: '← BACK',
      next: 'NEXT →',
    },
    landing: {
      title: 'KOSMOS',
      subtitle: 'Interactive journey through the Universe',
    },
    milkyway: {
      title: 'Milky Way',
    },
    solarSystem: {
      title: 'Solar System',
      loading: 'Loading Solar System...',
    },
    footer:
      '© 2026 Bespalova Solomiia — The website was created for the "Kreator" competition.',
  },
  pl: {
    nav: {
      navigate: 'Nawigacja',
      aboutProject: 'O Projekcie',
      back: '← WSTECZ',
      next: 'DALEJ →',
    },
    landing: {
      title: 'KOSMOS',
      subtitle: 'Interaktywna podróż przez wszechświat',
    },
    milkyway: {
      title: 'Droga Mleczna',
    },
    solarSystem: {
      title: 'Układ Słoneczny',
      loading: 'Ładowanie Układu Słonecznego...',
    },
    footer:
      '© 2026 Bespalova Solomiia — Strona została wykonana na potrzeby konkursu "Kreator"',
  },
};

export function normalizeLang(lang) {
  return lang === 'pl' ? 'pl' : 'en';
}

export function getLang() {
  try {
    return normalizeLang(localStorage.getItem(LANG_STORAGE_KEY));
  } catch {
    return 'en';
  }
}

export function setLang(lang) {
  const next = normalizeLang(lang);
  try {
    localStorage.setItem(LANG_STORAGE_KEY, next);
  } catch {
    /* ignore */
  }
  document.documentElement.lang = next;
  applyTranslations(next);
  updateLangButtons(next);
  window.dispatchEvent(new CustomEvent('kosmos-lang-change', { detail: { lang: next } }));
  return next;
}

/**
 * @param {string} key - Dot-separated path, e.g. "nav.back"
 * @param {'en'|'pl'} [lang]
 */
export function t(key, lang = getLang()) {
  return key.split('.').reduce((acc, part) => {
    if (acc && typeof acc === 'object' && part in acc) return acc[part];
    return undefined;
  }, I18N[lang]);
}

function getValueByKey(obj, key) {
  return key.split('.').reduce((acc, part) => {
    if (acc && typeof acc === 'object' && part in acc) return acc[part];
    const idx = parseInt(part, 10);
    if (Array.isArray(acc) && !Number.isNaN(idx) && idx < acc.length) return acc[idx];
    return undefined;
  }, obj);
}

export function applyTranslations(lang = getLang()) {
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const value = t(el.dataset.i18n, lang);
    if (value !== undefined) el.textContent = value;
  });

  document.querySelectorAll('[data-key]').forEach((el) => {
    if (typeof window.contentData === 'undefined') return;
    const value = getValueByKey(window.contentData[lang], el.dataset.key);
    if (value !== undefined) el.textContent = value;
  });

  const footerText = document.querySelector('.footer p, .kosmos-footer p');
  if (footerText && !footerText.dataset.key) {
    footerText.textContent = t('footer', lang);
  }

}

function updateLangButtons(lang) {
  document.querySelectorAll('.kosmos-lang-btn, .lang-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

function createLangSwitch() {
  if (document.querySelector('.kosmos-lang-switch, .lang-switch')) return;

  const wrap = document.createElement('div');
  wrap.className = 'kosmos-lang-switch';
  wrap.setAttribute('role', 'group');
  wrap.setAttribute('aria-label', 'Language');

  const btnEn = document.createElement('button');
  btnEn.type = 'button';
  btnEn.className = 'kosmos-lang-btn';
  btnEn.dataset.lang = 'en';
  btnEn.textContent = 'EN';

  const divider = document.createElement('span');
  divider.className = 'kosmos-lang-divider';
  divider.textContent = '|';

  const btnPl = document.createElement('button');
  btnPl.type = 'button';
  btnPl.className = 'kosmos-lang-btn';
  btnPl.dataset.lang = 'pl';
  btnPl.textContent = 'PL';

  wrap.appendChild(btnEn);
  wrap.appendChild(divider);
  wrap.appendChild(btnPl);
  document.body.appendChild(wrap);

  wrap.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-lang]');
    if (!btn) return;
    setLang(btn.dataset.lang);
  });
}

function createFooter() {
  if (document.querySelector('.footer, .kosmos-footer')) return;

  const footer = document.createElement('footer');
  footer.className = 'footer kosmos-footer';
  const p = document.createElement('p');
  footer.appendChild(p);
  document.body.appendChild(footer);
}

function createPageTitle(scene) {
  if (document.querySelector('.page-scene-title')) return;

  const keyByScene = {
    MILKYWAY: 'milkyway.title',
    SOLAR_SYSTEM: 'solarSystem.title',
  };
  const i18nKey = keyByScene[scene];
  if (!i18nKey) return;

  const wrap = document.createElement('div');
  wrap.className = 'planet-hud-title page-scene-title';

  const h1 = document.createElement('h1');
  h1.dataset.i18n = i18nKey;
  wrap.appendChild(h1);
  document.body.appendChild(wrap);
}

/**
 * @param {Object} [options]
 * @param {string} [options.currentScene] - LANDING | MILKYWAY | SOLAR_SYSTEM | PLANET_DETAIL
 * @param {boolean} [options.langSwitch=true]
 * @param {boolean} [options.footer=true]
 * @param {boolean} [options.pageTitle=true]
 */
export function initSiteI18n(options = {}) {
  const {
    currentScene = null,
    langSwitch = true,
    footer = true,
    pageTitle = true,
  } = options;

  if (langSwitch) createLangSwitch();
  if (footer) createFooter();
  if (pageTitle && currentScene) createPageTitle(currentScene);

  const lang = getLang();
  applyTranslations(lang);
  updateLangButtons(lang);
  return lang;
}
