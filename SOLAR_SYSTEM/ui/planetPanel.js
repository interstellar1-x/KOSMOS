/**
 * PlanetPanel - Displays information about selected planets
 * Creates and manages a floating information panel
 */
export class PlanetPanel {
  constructor() {
    this.panel = null;
    this.isVisible = false;
    this.currentPlanet = null;

    this.createPanel();
  }

  /**
   * Create the HTML panel element
   */
  createPanel() {
    this.panel = document.createElement('div');
    this.panel.id = 'planet-panel';
    this.panel.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      width: 300px;
      background: rgba(0, 0, 0, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 10px;
      padding: 20px;
      color: white;
      font-family: 'Arial', sans-serif;
      font-size: 14px;
      backdrop-filter: blur(10px);
      transition: opacity 0.3s ease, transform 0.3s ease;
      opacity: 0;
      transform: translateY(-20px);
      pointer-events: none;
      z-index: 1000;
    `;

    // Panel content structure
    this.panel.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px;">
        <div>
          <h2 id="planet-name" style="margin: 0; color: #87CEEB; font-size: 24px;"></h2>
          <div id="planet-type" style="color: #a0d8ff; font-size: 13px; margin-top: 4px;"></div>
        </div>
        <button id="close-panel" style="
          background: none;
          border: none;
          color: white;
          font-size: 20px;
          cursor: pointer;
          padding: 5px;
        ">×</button>
      </div>
      <div id="planet-info" style="line-height: 1.6;"></div>
      <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255, 255, 255, 0.2);">
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <span>Distance from Sun:</span>
          <span id="planet-distance"></span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <span>Orbital Period:</span>
          <span id="planet-period"></span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span>Radius:</span>
          <span id="planet-radius"></span>
        </div>
      </div>
    `;

    document.body.appendChild(this.panel);

    // Close button event
    const closeButton = this.panel.querySelector('#close-panel');
    closeButton.addEventListener('click', () => this.hide());

    // Make panel clickable when visible
    this.panel.addEventListener('click', (e) => e.stopPropagation());
  }

  /**
   * Show the panel with planet information
   */
  show(planetName, planetData) {
    if (!this.panel) return;

    this.currentPlanet = planetName;

    // Update content
    const nameElement = this.panel.querySelector('#planet-name');
    const typeElement = this.panel.querySelector('#planet-type');
    const infoElement = this.panel.querySelector('#planet-info');
    const distanceElement = this.panel.querySelector('#planet-distance');
    const periodElement = this.panel.querySelector('#planet-period');
    const radiusElement = this.panel.querySelector('#planet-radius');

    nameElement.textContent = planetData.name;
    const typeLabel = planetData.bodyType
      ? `⭐ ${planetData.bodyType}`
      : planetData.parent
        ? '🌙 Moon'
        : '🪐 Planet';
    typeElement.textContent = typeLabel;
    infoElement.textContent = planetData.info;
    distanceElement.textContent = planetData.distance
      ? `${planetData.distance} AU`
      : planetData.distanceFromPlanet
        ? `≈ ${planetData.distanceFromPlanet.toFixed(1)} Earth radii from ${planetData.parent}`
        : 'Center of Solar System';
    periodElement.textContent = this.getOrbitalPeriodText(planetData);
    radiusElement.textContent = planetData.radius
      ? `${planetData.radius} Earth radii`
      : 'N/A';

    // Show panel
    this.panel.style.opacity = '1';
    this.panel.style.transform = 'translateY(0)';
    this.panel.style.pointerEvents = 'auto';
    this.isVisible = true;
  }

  /**
   * Hide the panel
   */
  hide() {
    if (!this.panel) return;

    this.panel.style.opacity = '0';
    this.panel.style.transform = 'translateY(-20px)';
    this.panel.style.pointerEvents = 'none';
    this.isVisible = false;
    this.currentPlanet = null;
  }

  /**
   * Convert orbit speed to readable orbital period text
   */
  getOrbitalPeriodText(planetData) {
    if (planetData.bodyType === 'Star') {
      return 'Center of Solar System';
    }
    if (planetData.parent) {
      return '27.3 Earth days';
    }

    // Simplified calculation - in a real app, this would be more accurate
    const earthYear = 365.25; // days
    const relativeSpeed = 0.03 / planetData.orbitSpeed; // Earth orbit speed is 0.03
    const period = earthYear * relativeSpeed;

    if (period < 100) {
      return `${period.toFixed(1)} Earth days`;
    } else if (period < 400) {
      return `${(period / 365.25).toFixed(1)} Earth years`;
    } else {
      return `${(period / 365.25).toFixed(0)} Earth years`;
    }
  }

  /**
   * Check if panel is visible
   */
  isPanelVisible() {
    return this.isVisible;
  }

  /**
   * Get current planet being displayed
   */
  getCurrentPlanet() {
    return this.currentPlanet;
  }

  /**
   * Clean up the panel
   */
  dispose() {
    if (this.panel && this.panel.parentNode) {
      this.panel.parentNode.removeChild(this.panel);
    }
  }
}