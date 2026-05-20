import { PlanetLoader } from './planetLoader.js';
import { PLANET_DETAIL_DATA } from './data/planetData.js';

export class PlanetDetail {
  constructor() {
    this.isVisible = false;
    this.currentPlanet = null;
    this.currentConfig = null;
    this.planetLoader = new PlanetLoader();

    this.createDetailView();
    this.setupEventListeners();
  }

  createDetailView() {
    this.detailElement = document.createElement('div');
    this.detailElement.id = 'planet-detail-root';
    this.detailElement.className = 'planet-detail-root hidden';

    const leftPanel = document.createElement('section');
    leftPanel.className = 'planet-detail-left';

    this.detailCanvas = document.createElement('canvas');
    this.detailCanvas.id = 'planet-detail-canvas';
    leftPanel.appendChild(this.detailCanvas);

    const rightPanel = document.createElement('aside');
    rightPanel.className = 'planet-detail-right';

    const closeButton = document.createElement('button');
    closeButton.className = 'planet-detail-close';
    closeButton.textContent = 'Close';
    closeButton.addEventListener('click', () => this.hide());
    rightPanel.appendChild(closeButton);

    this.nameElement = document.createElement('h1');
    this.nameElement.className = 'planet-detail-title';
    rightPanel.appendChild(this.nameElement);

    this.typeElement = document.createElement('div');
    this.typeElement.className = 'planet-detail-type';
    rightPanel.appendChild(this.typeElement);

    this.descriptionElement = document.createElement('p');
    this.descriptionElement.className = 'planet-detail-description';
    rightPanel.appendChild(this.descriptionElement);

    const statsHeader = document.createElement('h2');
    statsHeader.textContent = 'Key Characteristics';
    statsHeader.className = 'planet-detail-section-title';
    rightPanel.appendChild(statsHeader);

    this.statsGrid = document.createElement('div');
    this.statsGrid.className = 'planet-detail-stats';
    rightPanel.appendChild(this.statsGrid);

    const factsHeader = document.createElement('h2');
    factsHeader.textContent = 'Interesting Facts';
    factsHeader.className = 'planet-detail-section-title';
    rightPanel.appendChild(factsHeader);

    this.factsList = document.createElement('ul');
    this.factsList.className = 'planet-detail-facts';
    rightPanel.appendChild(this.factsList);

    this.detailElement.appendChild(leftPanel);
    this.detailElement.appendChild(rightPanel);
    document.body.appendChild(this.detailElement);
  }

  setupEventListeners() {
    document.addEventListener('planet-selected', (event) => {
      const { name, config } = event.detail;
      this.showPlanet(name, config);
    });

    document.addEventListener('close-planet-detail', () => {
      this.hide();
    });

    window.addEventListener('resize', () => {
      if (this.isVisible) {
        this.onWindowResize();
      }
    });
  }

  async showPlanet(planetName, config) {
    if (!planetName || !config) {
      return;
    }

    this.currentPlanet = planetName;
    this.currentConfig = config;

    const detailData = PLANET_DETAIL_DATA[planetName] || {};

    this.nameElement.textContent = config.name || planetName;
    this.typeElement.textContent = detailData.type || config.bodyType || (config.parent ? 'Moon' : 'Planet');
    this.descriptionElement.textContent = detailData.description || config.info || 'No description available.';

    this.updateStats(config, detailData.characteristics || []);
    this.updateFacts(detailData.facts || []);

    this.detailElement.classList.remove('hidden');
    this.detailElement.classList.add('visible');
    this.isVisible = true;

    this.planetLoader.initialize(this.detailCanvas);
    await this.planetLoader.loadPlanet({
      ...config,
      key: planetName
    });
    this.planetLoader.start();
  }

  updateStats(config, customCharacteristics) {
    this.statsGrid.innerHTML = '';

    const defaultStats = [
      { label: 'Diameter', value: config.radius ? `${(config.radius * 12742).toFixed(0)} km` : 'N/A' },
      { label: 'Orbit Distance', value: config.distance ? `${config.distance} AU` : 'N/A' },
      { label: 'Rotation Speed', value: config.rotationSpeed ? `${config.rotationSpeed} rad/s` : 'N/A' }
    ];

    const stats = [...defaultStats, ...customCharacteristics];

    stats.forEach((item) => {
      const statCard = document.createElement('div');
      statCard.className = 'planet-detail-stat-card';
      statCard.innerHTML = `
        <div class="stat-label">${item.label}</div>
        <div class="stat-value">${item.value}</div>
      `;
      this.statsGrid.appendChild(statCard);
    });
  }

  updateFacts(facts) {
    this.factsList.innerHTML = '';

    if (!facts.length) {
      const listItem = document.createElement('li');
      listItem.textContent = 'No additional facts available.';
      this.factsList.appendChild(listItem);
      return;
    }

    facts.forEach((fact) => {
      const listItem = document.createElement('li');
      listItem.textContent = fact;
      this.factsList.appendChild(listItem);
    });
  }

  onWindowResize() {
    if (this.planetLoader) {
      this.planetLoader.onWindowResize();
    }
  }

  hide() {
    if (!this.isVisible) {
      return;
    }

    this.detailElement.classList.remove('visible');
    this.detailElement.classList.add('hidden');
    this.isVisible = false;
    this.currentPlanet = null;
    this.planetLoader.stop();
  }

  dispose() {
    this.planetLoader.dispose();
    if (this.detailElement && this.detailElement.parentNode) {
      this.detailElement.parentNode.removeChild(this.detailElement);
    }
  }
}
