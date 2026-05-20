import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OrbitSystem } from './orbitSystem.js';
import { RaycasterSystem } from './raycaster.js';
import { SOLAR_CONFIG } from './solarconfig.js';

/**
 * SolarSystemScene - Main scene controller for the interactive solar system
 * Manages Three.js scene, camera, renderer, and all subsystems
 */
export class SolarSystemScene {
  constructor(canvas) {
    this.canvas = canvas;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;

    this.orbitSystem = null;
    this.raycasterSystem = null;

    this.clock = new THREE.Clock();
    this.isInitialized = false;

    this.ready = this.init();
  }

  /**
   * Initialize the Three.js scene and all subsystems
   */
  async init() {
    try {
      this.setupScene();
      this.setupCamera();
      this.setupRenderer();
      this.setupControls();
      this.setupLighting();

      // Initialize subsystems
      this.orbitSystem = new OrbitSystem(this.scene);
      await this.orbitSystem.initialize();
      this.raycasterSystem = new RaycasterSystem(this.camera, this.scene, this.canvas);

      this.setupInteractions();
      this.setupBackground();

      this.isInitialized = true;
      this.animate();

      console.log('Solar System scene initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Solar System scene:', error);
    }
  }

  /**
   * Setup the basic Three.js scene
   */
  setupScene() {
    this.scene = new THREE.Scene();

    // Set scene background and fog for space atmosphere
    const textureLoader = new THREE.TextureLoader();
    this.scene.background = textureLoader.load('../MILKYWAY/resources/nebula.png');
    this.scene.fog = new THREE.FogExp2(SOLAR_CONFIG.scene.fogColor, SOLAR_CONFIG.scene.fogDensity);
  }

  /**
   * Setup camera with initial position
   */
  setupCamera() {
    const config = SOLAR_CONFIG.camera;
    this.camera = new THREE.PerspectiveCamera(
      config.fov,
      this.canvas.clientWidth / this.canvas.clientHeight,
      config.near,
      config.far
    );

    this.camera.position.copy(config.initialPosition);
    this.camera.lookAt(0, 0, 0);
  }

  /**
   * Setup WebGL renderer
   */
  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false
    });

    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    // Color management for realistic rendering
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
  }

  /**
   * Setup orbit controls for camera movement
   */
  setupControls() {
    this.controls = new OrbitControls(this.camera, this.canvas);

    // Configure controls for cinematic space exploration
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.rotateSpeed = 0.7;
    this.controls.zoomSpeed = 1.1;
    this.controls.panSpeed = 1.0;
    this.controls.screenSpacePanning = true;
    this.controls.enablePan = true;
    this.controls.enableZoom = true;
    this.controls.enableRotate = true;
    this.controls.enableKeys = true;
    this.controls.keys = {
      LEFT: 'ArrowLeft',
      UP: 'ArrowUp',
      RIGHT: 'ArrowRight',
      BOTTOM: 'ArrowDown'
    };
    this.controls.minDistance = 0.1;
    this.controls.maxDistance = 500;
    this.controls.minPolarAngle = 0;
    this.controls.maxPolarAngle = Math.PI * 0.98;
    this.controls.target.set(0, 0, 0);

    this.controls.addEventListener('start', () => {
      this.userIsDragging = true;
    });

    this.controls.addEventListener('end', () => {
      this.userIsDragging = false;
    });

    // Use saved state so controls remain smooth after focus transitions
    this.controls.update();
  }

  /**
   * Setup scene lighting
   */
  setupLighting() {
    // Match the PlanetDetail lighting balance: soft ambient light, a warm key
    // from the Sun, and a cool fill so the night side is readable.
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
    this.scene.add(ambientLight);

    const keyLight = new THREE.PointLight(0xffffff, 1.6, 0, 2);
    keyLight.position.set(0, 0, 0);
    this.scene.add(keyLight);

    const fillLight = new THREE.PointLight(0x67b2ff, 0.35, 0, 2);
    fillLight.position.set(-18, -10, 16);
    this.scene.add(fillLight);
  }

  /**
   * Setup raycaster interactions
   */
  setupInteractions() {
    // Set intersectable objects (Sun, planet meshes, and moon meshes)
    const sunMesh = this.orbitSystem.sun;
    if (sunMesh) {
      sunMesh.userData.planetName = 'sun';
    }

    const planetMeshes = Array.from(this.orbitSystem.planets.values());
    planetMeshes.forEach((mesh, index) => {
      const planetName = Array.from(this.orbitSystem.planets.keys())[index];
      mesh.userData.planetName = planetName;
    });

    const moonMeshes = Array.from(this.orbitSystem.moons.values());
    moonMeshes.forEach((mesh, index) => {
      const moonName = Array.from(this.orbitSystem.moons.keys())[index];
      mesh.userData.planetName = moonName;
    });

    const intersectables = [];
    if (sunMesh) intersectables.push(sunMesh);
    intersectables.push(...planetMeshes, ...moonMeshes);

    this.raycasterSystem.setIntersectableObjects(intersectables);

    // Setup click handler
    this.raycasterSystem.setOnPlanetClick((planetName, planetObject) => {
      this.onPlanetClick(planetName);
    });

    // Setup hover handler (optional - could add visual feedback)
    this.raycasterSystem.setOnPlanetHover((hoveredPlanet, previousPlanet) => {
      // Could add hover effects here
    });
  }

  /**
   * Setup the nebula background
   */
  setupBackground() {
    // Background is already set in setupScene()
    // Could add additional space effects here (stars, etc.)
  }

  /**
   * Handle body click - open OBJECTS2 detail page
   */
  onPlanetClick(planetName) {
    const bodyConfig = this.getBodyConfig(planetName);
    if (!bodyConfig) return;

    this.openInfoPlanetPage(planetName);
  }

  openInfoPlanetPage(planetName) {
    const target = `../OBJECTS2/${planetName.toUpperCase()}/index.html`;
    window.location.href = target;
  }

  getBodyConfig(bodyName) {
    if (bodyName === 'sun') {
      return SOLAR_CONFIG.sun;
    }
    if (SOLAR_CONFIG.planets[bodyName]) {
      return SOLAR_CONFIG.planets[bodyName];
    }
    if (SOLAR_CONFIG.moons && SOLAR_CONFIG.moons[bodyName]) {
      return SOLAR_CONFIG.moons[bodyName];
    }
    return null;
  }

  /**
   * Main animation loop
   */
  animate() {
    if (!this.isInitialized) return;

    requestAnimationFrame(() => this.animate());

    const deltaTime = this.clock.getDelta();

    // Update orbit system (planet movements)
    this.orbitSystem.update(deltaTime);

    // Update controls
    this.controls.update();

    // Render the scene
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Handle window resize
   */
  onWindowResize() {
    if (!this.camera || !this.renderer) return;

    this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
  }

  /**
   * Get current focused planet
   */
  getFocusedPlanet() {
    return null; // No longer tracking focus in scene
  }

  /**
   * Clean up resources
   */
  dispose() {
    if (this.raycasterSystem) {
      this.raycasterSystem.dispose();
    }

    if (this.renderer) {
      this.renderer.dispose();
    }

    if (this.controls) {
      this.controls.dispose();
    }
  }
}
