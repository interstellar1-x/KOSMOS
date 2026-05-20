/* ============================================
   KOSMOS — GLOBAL NAVIGATION SYSTEM
   Reusable class for ALL scenes/pages
   State-driven, data-driven — no hardcoded URLs or file paths
   Uses shared catalog for navigation decisions
   ============================================ */

import {
  SCENE_FLOW,
  PLANET_KEYS,
  getScenePath,
  getPlanetPath,
  getNextScene,
  getPrevScene,
  getNextPlanetKey,
  getPrevPlanetKey
} from './catalog.js';
import { initSiteI18n, t, getLang } from './i18n.js';

class Navigation {
  /**
   * @param {Object} options
   * @param {string} [options.aboutLink]   - Path to the About page
   * @param {string} [options.currentScene] - Current scene: 'LANDING', 'MILKYWAY', 'SOLAR_SYSTEM', or 'PLANET_DETAIL'
   * @param {string} [options.currentPlanet] - Current planet key (only for PLANET_DETAIL, e.g. 'earth')
   */
  constructor(options = {}) {
    this.aboutLink = options.aboutLink || '../ABOUTPROJECT/index.html';
    this.currentScene = options.currentScene || null;
    this.currentPlanet = options.currentPlanet || null;
    this.overlay = null;

    // Compute navigation destinations from catalog
    this.nextScene = null;
    this.backScene = null;
    this.nextPlanetKey = null;
    this.backPlanetKey = null;

    this._computeNavigation();

    // Wait for DOM, then build
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this._build());
    } else {
      this._build();
    }
  }

  // --------------------------------------------------
  //  Compute navigation destinations from the shared catalog
  // --------------------------------------------------
  _computeNavigation() {
    const scene = this.currentScene;

    if (scene === 'LANDING') {
      // LANDING: no BACK, NEXT = MILKYWAY
      this.backScene = null;
      this.nextScene = getNextScene('LANDING'); // MILKYWAY
    } else if (scene === 'MILKYWAY') {
      // MILKYWAY: BACK = LANDING, NEXT = SOLAR_SYSTEM
      this.backScene = getPrevScene('MILKYWAY'); // LANDING
      this.nextScene = getNextScene('MILKYWAY'); // SOLAR_SYSTEM
    } else if (scene === 'SOLAR_SYSTEM') {
      // SOLAR_SYSTEM: BACK = MILKYWAY, NEXT = first planet in catalog
      this.backScene = getPrevScene('SOLAR_SYSTEM'); // MILKYWAY
      this.nextScene = null; // NEXT from SOLAR_SYSTEM goes to first planet detail
      this.nextPlanetKey = PLANET_KEYS.length > 0 ? PLANET_KEYS[0] : null;
    } else if (scene === 'PLANET_DETAIL') {
      // PLANET_DETAIL: BACK = SOLAR_SYSTEM, NEXT = next planet in catalog
      this.backScene = getPrevScene('PLANET_DETAIL'); // SOLAR_SYSTEM
      if (this.currentPlanet) {
        this.nextPlanetKey = getNextPlanetKey(this.currentPlanet);
        this.backPlanetKey = getPrevPlanetKey(this.currentPlanet);
      } else {
        this.nextPlanetKey = null;
        this.backPlanetKey = null;
      }
      this.nextScene = null; // within-planet NEXT handled by nextPlanetKey
    } else {
      // Fallback: no scene context — hide navigation buttons
      this.backScene = null;
      this.nextScene = null;
    }

    // Resolve paths
    this.nextLink = null;
    this.backLink = null;

    // NEXT button path — pass current scene for correct relative directory depth
    if (this.nextScene) {
      this.nextLink = getScenePath(this.nextScene, scene);
    } else if (this.nextPlanetKey) {
      this.nextLink = getPlanetPath(this.nextPlanetKey, scene);
    }

    // BACK button path — pass current scene for correct relative directory depth
    if (this.backScene) {
      this.backLink = getScenePath(this.backScene, scene);
    } else if (this.backPlanetKey) {
      this.backLink = getPlanetPath(this.backPlanetKey, scene);
    }
  }

  // --------------------------------------------------
  //  Build everything
  // --------------------------------------------------
  _build() {
    initSiteI18n({ currentScene: this.currentScene });
    if (document.querySelector('.kosmos-footer')) {
      document.body.classList.add('has-kosmos-footer');
    }
    this._lang = getLang();
    window.addEventListener('kosmos-lang-change', (e) => {
      this._lang = e.detail.lang;
      this._updateNavLabels();
    });

    this._createOverlay();
    this._createHamburger();
    this._createPanel();
    // Create shared navigation buttons container
    this._navButtonsContainer = document.createElement('div');
    this._navButtonsContainer.className = 'nav-buttons';
    document.body.appendChild(this._navButtonsContainer);

    if (this.backLink) {
      this._createBackButton();
    }
    if (this.nextLink) {
      this._createNextButton();
    }
    this._bindEvents();
  }

  // --------------------------------------------------
  //  Hamburger button (top-left)
  // --------------------------------------------------
  _createHamburger() {
    const btn = document.createElement('button');
    btn.className = 'hamburger-menu';
    btn.setAttribute('aria-label', 'Toggle navigation menu');
    btn.setAttribute('type', 'button');
    btn.innerHTML = `
      <span class="bar"></span>
      <span class="bar"></span>
      <span class="bar"></span>
    `;
    document.body.appendChild(btn);
    this._hamburger = btn;
  }

  // --------------------------------------------------
  //  Slide-out navigation panel
  // --------------------------------------------------
  _createPanel() {
    const panel = document.createElement('nav');
    panel.className = 'nav-panel';
    panel.setAttribute('aria-label', 'Site navigation');
    panel.innerHTML = `
      <div class="nav-label" data-i18n="nav.navigate">Navigate</div>
      <a href="${this._escapeHtml(this.aboutLink)}" class="nav-link" data-nav="about" data-i18n="nav.aboutProject">About Project</a>
    `;
    document.body.appendChild(panel);
    this._panel = panel;
  }

  // --------------------------------------------------
  //  Overlay backdrop
  // --------------------------------------------------
  _createOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);
    this.overlay = overlay;
  }

  // --------------------------------------------------
  //  Next / scene-advance button (shared container, right)
  // --------------------------------------------------
  _createNextButton() {
    const btn = document.createElement('button');
    btn.className = 'next-button';
    btn.setAttribute('type', 'button');
    btn.dataset.i18n = 'nav.next';
    btn.textContent = t('nav.next', this._lang);
    this._navButtonsContainer.appendChild(btn);
    this._nextBtn = btn;
  }

  // --------------------------------------------------
  //  Back / scene-return button (shared container, left)
  // --------------------------------------------------
  _createBackButton() {
    const btn = document.createElement('button');
    btn.className = 'back-button';
    btn.setAttribute('type', 'button');
    btn.dataset.i18n = 'nav.back';
    btn.textContent = t('nav.back', this._lang);
    this._navButtonsContainer.appendChild(btn);
    this._backBtn = btn;
  }

  // --------------------------------------------------
  //  Event binding
  // --------------------------------------------------
  _bindEvents() {
    // Toggle panel on hamburger click
    this._hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggle();
    });

    // Close panel when clicking a nav link — navigate via window.location (same-window)
    this._panel.addEventListener('click', (e) => {
      const link = e.target.closest('.nav-link');
      if (!link) return;
      e.preventDefault();
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#')) {
        // Same-page anchor — just close the panel
        this.close();
        if (href && href.startsWith('#')) {
          const target = document.querySelector(href);
          if (target) target.scrollIntoView({ behavior: 'smooth' });
        }
        return;
      }
      // Same-window navigation
      window.location.href = href;
    });

    // Next button navigation — data-driven via catalog
    if (this._nextBtn) {
      this._nextBtn.addEventListener('click', () => {
        if (this.nextLink) {
          window.location.href = this.nextLink;
        }
      });
    }

    // Back button navigation — data-driven via catalog
    if (this._backBtn) {
      this._backBtn.addEventListener('click', () => {
        if (this.backLink) {
          window.location.href = this.backLink;
        }
      });
    }

    // Overlay click closes panel
    this.overlay.addEventListener('click', () => this.close());

    // ESC key closes panel
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this._panel.classList.contains('open')) {
        this.close();
      }
    });
  }

  // --------------------------------------------------
  //  Public API
  // --------------------------------------------------
  open() {
    this._hamburger.classList.add('active');
    this._panel.classList.add('open');
    this.overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this._hamburger.classList.remove('active');
    this._panel.classList.remove('open');
    this.overlay.classList.remove('visible');
    document.body.style.overflow = '';
  }

  toggle() {
    if (this._panel.classList.contains('open')) {
      this.close();
    } else {
      this.open();
    }
  }

  // --------------------------------------------------
  //  i18n — refresh nav button / panel labels
  // --------------------------------------------------
  _updateNavLabels() {
    const lang = this._lang;
    if (this._nextBtn) {
      this._nextBtn.textContent = t('nav.next', lang);
    }
    if (this._backBtn) {
      this._backBtn.textContent = t('nav.back', lang);
    }
    if (this._panel) {
      this._panel.querySelectorAll('[data-i18n]').forEach((el) => {
        const value = t(el.dataset.i18n, lang);
        if (value !== undefined) el.textContent = value;
      });
    }
  }

  // --------------------------------------------------
  //  Utility
  // --------------------------------------------------
  _escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
}

export default Navigation;