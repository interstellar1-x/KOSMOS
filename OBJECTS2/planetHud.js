/**
 * KOSMOS — PlanetHUD
 * Reusable NASA-style fullscreen HUD overlay for planet detail pages.
 *
 * Usage:
 *   import { PlanetHUD } from '../planetHud.js';
 *   const hud = new PlanetHUD();
 *   hud.show('earth');   // auto-populates from planetData.js
 *   hud.hide();          // fade out
 *
 * Architecture:
 *   - Creates absolute-positioned overlay DOM (no canvas interference)
 *   - Reads data from shared planetData.js (EN / PL)
 *   - Same layout, only data changes per planet
 *   - Supports fade-in/out animations via CSS
 */

import {
  getPlanetHudData,
  normalizeHudLang,
} from './planetData.js';
import { getLang } from '../shared/i18n.js';

export class PlanetHUD {
  constructor() {
    this.isVisible = false;
    this.currentKey = null;
    this.lang = getLang();
    this._buildDOM();
    this._bindEvents();
    window.addEventListener('kosmos-lang-change', (e) => {
      this.setLanguage(e.detail.lang);
    });
  }

  /* ───────── DOM Construction ───────── */

  _buildDOM() {
    this.root = document.createElement('div');
    this.root.className = 'planet-hud-root';
    this.root.id = 'planet-hud-root';

    const titleEl = document.createElement('div');
    titleEl.className = 'planet-hud-title';
    this.titleH1 = document.createElement('h1');
    this.titleType = document.createElement('div');
    this.titleType.className = 'planet-type';
    titleEl.appendChild(this.titleH1);
    titleEl.appendChild(this.titleType);
    this.root.appendChild(titleEl);

    const techPanel = document.createElement('div');
    techPanel.className = 'planet-hud-tech';
    this.techLabelEl = document.createElement('div');
    this.techLabelEl.className = 'panel-label';
    techPanel.appendChild(this.techLabelEl);
    this.techGrid = document.createElement('div');
    this.techGrid.className = 'tech-grid';
    techPanel.appendChild(this.techGrid);
    this.root.appendChild(techPanel);

    const infoPanel = document.createElement('div');
    infoPanel.className = 'planet-hud-info';
    this.infoLabelEl = document.createElement('div');
    this.infoLabelEl.className = 'panel-label';
    infoPanel.appendChild(this.infoLabelEl);
    this.descEl = document.createElement('div');
    this.descEl.className = 'hud-description';
    infoPanel.appendChild(this.descEl);

    const sep = document.createElement('div');
    sep.className = 'hud-separator';
    infoPanel.appendChild(sep);

    this.factsTitleEl = document.createElement('div');
    this.factsTitleEl.className = 'hud-facts-title';
    infoPanel.appendChild(this.factsTitleEl);

    this.factsList = document.createElement('ul');
    this.factsList.className = 'hud-facts-list';
    infoPanel.appendChild(this.factsList);
    this.root.appendChild(infoPanel);

    document.body.appendChild(this.root);
  }

  /* ───────── Event Binding ───────── */

  _bindEvents() {
    document.addEventListener('planet-selected', (e) => {
      const name = e.detail?.name || e.detail?.planetKey;
      if (name) {
        this.show(name);
      }
    });

    document.addEventListener('close-planet-detail', () => {
      this.hide();
    });
  }

  /* ───────── Language ───────── */

  setLanguage(lang) {
    const next = normalizeHudLang(lang);
    if (next === this.lang) return;
    this.lang = next;
    if (this.currentKey) {
      this._renderContent(this.currentKey);
    }
  }

  /* ───────── Public API ───────── */

  /**
   * Show the HUD for a specific planet
   * @param {string} planetKey - Planet identifier (e.g. 'earth', 'mars', 'moon')
   */
  show(planetKey) {
    if (!planetKey) return;

    const key = planetKey.toLowerCase();
    if (!getPlanetHudData(key, this.lang)) {
      console.warn(`[PlanetHUD] No data found for planet key: "${planetKey}"`);
      return;
    }

    this.currentKey = key;
    this._renderContent(key);

    this.root.classList.add('visible');
    this.isVisible = true;
  }

  hide() {
    if (!this.isVisible) return;
    this.root.classList.remove('visible');
    this.isVisible = false;
    this.currentKey = null;
  }

  dispose() {
    this.hide();
    if (this.root?.parentNode) {
      this.root.parentNode.removeChild(this.root);
    }
  }

  /* ───────── Internal Rendering ───────── */

  _renderContent(key) {
    const data = getPlanetHudData(key, this.lang);
    if (!data) return;

    const { labels } = data;

    this.techLabelEl.textContent = labels.techData;
    this.infoLabelEl.textContent = labels.profile;
    this.factsTitleEl.textContent = labels.facts;

    this.titleH1.textContent = data.name;
    this.titleType.textContent = data.type;
    this.descEl.textContent = data.description;

    this._renderTech(data, labels);
    this._renderFacts(data.facts, labels.noFacts);
  }

  _renderTech(data, labels) {
    this.techGrid.innerHTML = '';

    const fields = [
      { label: labels.mass, value: data.mass },
      { label: labels.density, value: data.density },
      { label: labels.gravity, value: data.gravity },
      { label: labels.radius, value: data.radius },
      { label: labels.temperature, value: data.temperature },
      { label: labels.orbitalPeriod, value: data.orbitalPeriod },
    ];

    fields.forEach((field) => {
      const item = document.createElement('div');
      item.className = 'tech-item';
      const label = document.createElement('span');
      label.className = 'tech-label';
      label.textContent = field.label;
      const value = document.createElement('span');
      value.className = 'tech-value';
      value.textContent = field.value;
      item.appendChild(label);
      item.appendChild(value);
      this.techGrid.appendChild(item);
    });

    const atmoItem = document.createElement('div');
    atmoItem.className = 'tech-item full-width';
    const atmoLabel = document.createElement('span');
    atmoLabel.className = 'tech-label';
    atmoLabel.textContent = labels.atmosphere;
    const atmoValue = document.createElement('span');
    atmoValue.className = 'tech-value';
    atmoValue.textContent = data.atmosphere;
    atmoItem.appendChild(atmoLabel);
    atmoItem.appendChild(atmoValue);
    this.techGrid.appendChild(atmoItem);
  }

  _renderFacts(facts, noFactsText) {
    this.factsList.innerHTML = '';
    if (!facts || facts.length === 0) {
      const li = document.createElement('li');
      li.textContent = noFactsText;
      this.factsList.appendChild(li);
      return;
    }
    facts.forEach((fact) => {
      const li = document.createElement('li');
      li.textContent = fact;
      this.factsList.appendChild(li);
    });
  }
}
