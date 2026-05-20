import * as THREE from 'three';

/**
 * RaycasterSystem - Handles mouse interactions with solar system bodies.
 * Detects clicks on the Sun, planets, and moons, then provides interaction callbacks.
 */
export class RaycasterSystem {
  constructor(camera, scene, canvas) {
    this.camera = camera;
    this.scene = scene;
    this.canvas = canvas;

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.intersectableObjects = []; // Array of clickable body objects
    this.onPlanetClick = null; // Callback function
    this.onPlanetHover = null; // Callback function

    this.currentHoveredPlanet = null;

    this.initEventListeners();
  }

  /**
   * Initialize mouse event listeners
   */
  initEventListeners() {
    this.canvas.addEventListener('click', (event) => this.onMouseClick(event));
    this.canvas.addEventListener('mousemove', (event) => this.onMouseMove(event));
  }

  /**
   * Set the objects that can be intersected.
   */
  setIntersectableObjects(objects) {
    this.intersectableObjects = objects;
  }

  /**
   * Handle mouse click events
   */
  onMouseClick(event) {
    this.updateMousePosition(event);
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersects = this.raycaster.intersectObjects(this.intersectableObjects, true);

    if (intersects.length > 0) {
      const clickedObject = intersects[0].object;
      const planetName = this.getPlanetNameFromObject(clickedObject);

      if (planetName && this.onPlanetClick) {
        this.onPlanetClick(planetName, clickedObject);
      }
    }
  }

  /**
   * Handle mouse move events for hover effects
   */
  onMouseMove(event) {
    this.updateMousePosition(event);
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersects = this.raycaster.intersectObjects(this.intersectableObjects, true);

    let hoveredPlanet = null;
    if (intersects.length > 0) {
      const hoveredObject = intersects[0].object;
      hoveredPlanet = this.getPlanetNameFromObject(hoveredObject);
    }

    // Handle hover state changes
    if (this.currentHoveredPlanet !== hoveredPlanet) {
      if (this.onPlanetHover) {
        this.onPlanetHover(hoveredPlanet, this.currentHoveredPlanet);
      }
      this.currentHoveredPlanet = hoveredPlanet;
    }
  }

  /**
   * Update mouse position in normalized device coordinates
   */
  updateMousePosition(event) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  /**
   * Get body name from the intersected object.
   * This assumes body roots or their child meshes have a userData.planetName property.
   */
  getPlanetNameFromObject(object) {
    // Traverse up to find the planet mesh (in case we clicked on clouds/rings)
    let currentObject = object;
    while (currentObject && !currentObject.userData.planetName) {
      currentObject = currentObject.parent;
    }
    return currentObject ? currentObject.userData.planetName : null;
  }

  /**
   * Set callback for planet click events
   */
  setOnPlanetClick(callback) {
    this.onPlanetClick = callback;
  }

  /**
   * Set callback for planet hover events
   */
  setOnPlanetHover(callback) {
    this.onPlanetHover = callback;
  }

  /**
   * Get current hovered planet
   */
  getCurrentHoveredPlanet() {
    return this.currentHoveredPlanet;
  }

  /**
   * Clean up event listeners
   */
  dispose() {
    this.canvas.removeEventListener('click', this.onMouseClick);
    this.canvas.removeEventListener('mousemove', this.onMouseMove);
  }
}
