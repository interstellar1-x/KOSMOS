import { SolarSystemScene } from './solarSystemScene.js';
import { PlanetDetail } from '../PLANET_DETAIL/planetDetail.js';

/**
 * Main entry point for the Solar System application
 * Initializes the scene and handles basic app lifecycle
 */

class SolarSystemApp {
  constructor() {
    this.solarSystem = null;
    this.planetDetail = null;
    this.init();
  }

  async init() {
    try {
      // Hide loading message
      const loadingElement = document.getElementById('loading');
      if (loadingElement) {
        loadingElement.style.display = 'none';
      }

      // Get canvas element
      const canvas = document.getElementById('canvas');
      if (!canvas) {
        throw new Error('Canvas element not found');
      }

      // Initialize planet detail view
      this.planetDetail = new PlanetDetail();

      // Initialize solar system scene
      this.solarSystem = new SolarSystemScene(canvas);
      await this.solarSystem.ready;

      // Setup window resize handler
      window.addEventListener('resize', () => {
        if (this.solarSystem) {
          this.solarSystem.onWindowResize();
        }
      });

      // Setup keyboard shortcuts
      window.addEventListener('keydown', (event) => {
        this.handleKeyPress(event);
      });

      console.log('Solar System App initialized successfully');

    } catch (error) {
      console.error('Failed to initialize Solar System App:', error);
      this.showError('Failed to load Solar System. Please check console for details.');
    }
  }

  /**
   * Handle keyboard shortcuts
   */
  handleKeyPress(event) {
    switch (event.key.toLowerCase()) {
      case 'escape':
        // Close any open detail views
        document.dispatchEvent(new CustomEvent('close-planet-detail'));
        break;
      case ' ':
        // Spacebar - could add pause/play functionality
        event.preventDefault();
        break;
    }
  }

  /**
   * Show error message to user
   */
  showError(message) {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
      loadingElement.textContent = message;
      loadingElement.style.color = '#ff6b6b';
      loadingElement.style.display = 'block';
    }
  }

  /**
   * Clean up resources
   */
  dispose() {
    if (this.solarSystem) {
      this.solarSystem.dispose();
    }
    if (this.planetDetail) {
      this.planetDetail.dispose();
    }
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new SolarSystemApp();
});

// Handle page unload
window.addEventListener('beforeunload', () => {
  // Clean up if needed
});
