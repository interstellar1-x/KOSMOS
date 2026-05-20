import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const MODEL_PATHS = {
  sun: '../OBJECTS/SUN/sun.glb',
  mercury: '../OBJECTS/MERCURY/mercury.glb',
  venus: '../OBJECTS/VENUS/venus.glb',
  earth: '../OBJECTS/EARTH/earth.glb',
  mars: '../OBJECTS/MARS/mars.glb',
  jupiter: '../OBJECTS/JUPITER/jupiter.glb',
  saturn: '../OBJECTS/SATURN/saturn.glb',
  uranus: '../OBJECTS/URANUS/uranus.glb',
  neptune: '../OBJECTS/NEPTUNE/neptune.glb',
  moon: '../OBJECTS/MOON/moon.glb'
};

/**
 * PlanetDetail - Fullscreen planet detail view
 * Shows a large rotating planet with information panel
 */
export class PlanetDetail {
  constructor() {
    this.isVisible = false;
    this.currentPlanet = null;
    this.detailElement = null;
    this.detailScene = null;
    this.detailCamera = null;
    this.detailRenderer = null;
    this.animationId = null;
    this.gltfLoader = new GLTFLoader();

    this.createDetailView();
    this.setupEventListeners();
  }

  /**
   * Create the fullscreen planet detail view
   */
  createDetailView() {
    // Main container
    this.detailElement = document.createElement('div');
    this.detailElement.id = 'planet-detail';
    this.detailElement.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #000;
      display: none;
      z-index: 2000;
    `;

    // Left side: planet visualization
    const leftSide = document.createElement('div');
    leftSide.style.cssText = `
      position: absolute;
      left: 0;
      top: 0;
      width: 60%;
      height: 100%;
      background: #000;
      overflow: hidden;
    `;

    const canvas = document.createElement('canvas');
    canvas.id = 'planet-detail-canvas';
    canvas.style.cssText = `
      width: 100%;
      height: 100%;
      display: block;
    `;
    leftSide.appendChild(canvas);

    // Right side: information panel
    const rightSide = document.createElement('div');
    rightSide.style.cssText = `
      position: absolute;
      right: 0;
      top: 0;
      width: 40%;
      height: 100%;
      background: linear-gradient(135deg, rgba(0,20,40,0.95) 0%, rgba(0,10,30,0.95) 100%);
      padding: 60px 40px;
      overflow-y: auto;
      color: white;
      font-family: 'Arial', sans-serif;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    `;

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '✕ Close';
    closeBtn.style.cssText = `
      position: absolute;
      top: 20px;
      right: 20px;
      background: rgba(255,255,255,0.1);
      border: 1px solid rgba(255,255,255,0.3);
      color: white;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.3s ease;
    `;
    closeBtn.addEventListener('mouseover', () => {
      closeBtn.style.background = 'rgba(255,255,255,0.2)';
    });
    closeBtn.addEventListener('mouseout', () => {
      closeBtn.style.background = 'rgba(255,255,255,0.1)';
    });
    closeBtn.addEventListener('click', () => this.hide());
    rightSide.appendChild(closeBtn);

    // Planet name
    const nameElement = document.createElement('h1');
    nameElement.id = 'detail-planet-name';
    nameElement.style.cssText = `
      margin: 0 0 10px 0;
      font-size: 48px;
      color: #87CEEB;
      text-transform: uppercase;
      letter-spacing: 2px;
    `;
    rightSide.appendChild(nameElement);

    // Body type
    const typeElement = document.createElement('div');
    typeElement.id = 'detail-body-type';
    typeElement.style.cssText = `
      color: #a0d8ff;
      font-size: 16px;
      margin-bottom: 30px;
      text-transform: uppercase;
      letter-spacing: 1px;
    `;
    rightSide.appendChild(typeElement);

    // Description
    const descElement = document.createElement('p');
    descElement.id = 'detail-description';
    descElement.style.cssText = `
      font-size: 16px;
      line-height: 1.8;
      color: #ccc;
      margin: 0 0 40px 0;
    `;
    rightSide.appendChild(descElement);

    // Stats container
    const statsContainer = document.createElement('div');
    statsContainer.id = 'detail-stats';
    statsContainer.style.cssText = `
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin-top: 40px;
    `;
    rightSide.appendChild(statsContainer);

    this.detailElement.appendChild(leftSide);
    this.detailElement.appendChild(rightSide);
    document.body.appendChild(this.detailElement);

    this.detailCanvas = canvas;
    this.nameElement = nameElement;
    this.typeElement = typeElement;
    this.descElement = descElement;
    this.statsContainer = statsContainer;
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    document.addEventListener('planet-selected', (e) => {
      this.showPlanet(e.detail.name, e.detail.config);
    });

    document.addEventListener('close-planet-detail', () => {
      this.hide();
    });

    window.addEventListener('resize', () => {
      if (this.isVisible && this.detailRenderer) {
        this.onWindowResize();
      }
    });
  }

  /**
   * Show planet detail view
   */
  showPlanet(planetName, config) {
    this.currentPlanet = planetName;
    this.currentConfig = config;

    // Update info panel
    this.nameElement.textContent = config.name;
    
    const typeLabel = config.bodyType
      ? `⭐ ${config.bodyType}`
      : config.parent
        ? '🌙 Moon'
        : '🪐 Planet';
    this.typeElement.textContent = typeLabel;
    this.descElement.textContent = config.info;

    // Update stats
    this.updateStats(config);

    // Show detail view
    this.detailElement.style.display = 'flex';
    this.isVisible = true;

    // Initialize Three.js scene if needed
    if (!this.detailRenderer) {
      this.initThreeJS();
    }

    this.loadPlanetMesh(config);
    this.startAnimation();
  }

  /**
   * Initialize Three.js scene
   */
  initThreeJS() {
    const canvas = this.detailCanvas;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    // Scene
    this.detailScene = new THREE.Scene();
    this.detailScene.background = new THREE.Color(0x000000);

    // Camera
    this.detailCamera = new THREE.PerspectiveCamera(
      60,
      width / height,
      0.1,
      10000
    );
    this.detailCamera.position.z = 3;

    // Renderer
    this.detailRenderer = new THREE.WebGLRenderer({ 
      canvas: canvas,
      antialias: true,
      alpha: false
    });
    this.detailRenderer.setSize(width, height);
    this.detailRenderer.setPixelRatio(window.devicePixelRatio);
    this.detailRenderer.outputColorSpace = THREE.SRGBColorSpace;
    this.detailRenderer.toneMapping = THREE.ACESFilmicToneMapping;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    this.detailScene.add(ambientLight);

    const sunLight = new THREE.PointLight(0xffffff, 1.5);
    sunLight.position.set(5, 3, 5);
    this.detailScene.add(sunLight);

    // Stars background
    this.addStarfield();
  }

  /**
   * Add starfield background
   */
  addStarfield() {
    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 1000;
    const posArray = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 200;
      posArray[i + 1] = (Math.random() - 0.5) * 200;
      posArray[i + 2] = (Math.random() - 0.5) * 200;
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const starsMaterial = new THREE.PointsMaterial({
      size: 0.5,
      color: 0xffffff,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.7
    });

    const stars = new THREE.Points(starsGeometry, starsMaterial);
    this.detailScene.add(stars);
  }

  /**
   * Load planet mesh
   */
  async loadPlanetMesh(config) {
    if (this.detailPlanetMesh) {
      this.detailScene.remove(this.detailPlanetMesh);
      this.detailPlanetMesh.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach((material) => material.dispose());
        }
      });
      this.detailPlanetMesh = null;
    }

    const planetName = (this.currentPlanet || config.name || '').toLowerCase();
    const modelPath = config.model || MODEL_PATHS[planetName];
    if (!modelPath) {
      console.error('No relative model path configured for detail view:', config);
      return;
    }

    try {
      const gltf = await new Promise((resolve, reject) => {
        this.gltfLoader.load(modelPath, resolve, undefined, reject);
      });

      const planetMesh = new THREE.Group();
      planetMesh.userData.isPlanet = true;
      planetMesh.userData.planetName = planetName;

      const model = gltf.scene;
      this.normalizeModel(model, planetName === 'sun' ? 1.45 : 1.3);
      this.prepareModelMaterials(model, planetName === 'sun');
      planetMesh.add(model);

      if (planetName === 'sun') {
        planetMesh.add(this.createSunGlow(7));
      } else {
        planetMesh.add(this.createAtmosphereGlow(1.35));
      }

      this.detailScene.add(planetMesh);
      this.detailPlanetMesh = planetMesh;
    } catch (error) {
      console.error(`Failed to load ${planetName} model from ${modelPath}:`, error);
    }
  }

  normalizeModel(model, radius) {
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDimension = Math.max(size.x, size.y, size.z);
    if (maxDimension > 0) {
      model.position.sub(center);
      model.scale.setScalar((radius * 2) / maxDimension);
    }
  }

  prepareModelMaterials(model, isSun) {
    model.traverse((child) => {
      if (!child.isMesh) return;
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      const prepared = materials.map((material) => {
        if (material?.map) {
          material.map.colorSpace = THREE.SRGBColorSpace;
        }
        if (!isSun) return material;
        return new THREE.MeshBasicMaterial({
          map: material?.map || null,
          color: material?.color ? material.color.clone() : new THREE.Color(0xffffff),
          transparent: material?.transparent || false,
          opacity: material?.opacity ?? 1,
          toneMapped: false
        });
      });
      child.material = Array.isArray(child.material) ? prepared : prepared[0];
    });
  }

  createAtmosphereGlow(radius) {
    const geometry = new THREE.IcosahedronGeometry(radius, 6);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        rimColor: { value: new THREE.Color(0x84c8ff) }
      },
      vertexShader: `
        varying float vRim;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vec3 worldNormal = normalize(mat3(modelMatrix) * normal);
          vec3 eyeVector = normalize(worldPosition.xyz - cameraPosition);
          vRim = pow(1.0 + dot(eyeVector, worldNormal), 3.4);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 rimColor;
        varying float vRim;
        void main() {
          float alpha = smoothstep(0.0, 1.0, clamp(vRim, 0.0, 1.0)) * 0.45;
          gl_FragColor = vec4(rimColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.BackSide,
      toneMapped: false
    });
    return new THREE.Mesh(geometry, material);
  }

  createSunGlow(scale) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext('2d');
    const gradient = context.createRadialGradient(256, 256, 0, 256, 256, 256);
    gradient.addColorStop(0.0, 'rgba(255, 240, 170, 0.78)');
    gradient.addColorStop(0.34, 'rgba(255, 185, 70, 0.46)');
    gradient.addColorStop(0.56, 'rgba(255, 120, 24, 0.22)');
    gradient.addColorStop(0.78, 'rgba(255, 70, 0, 0.09)');
    gradient.addColorStop(1.0, 'rgba(255, 40, 0, 0.0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 512, 512);

    const material = new THREE.SpriteMaterial({
      map: new THREE.CanvasTexture(canvas),
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: true,
      transparent: true,
      toneMapped: false
    });
    const glow = new THREE.Sprite(material);
    glow.scale.setScalar(scale);
    return glow;
  }

  /**
   * Update stats panel
   */
  updateStats(config) {
    this.statsContainer.innerHTML = '';

    const stats = [
      { label: 'Type', value: config.bodyType ? config.bodyType : (config.parent ? 'Moon' : 'Planet') },
      { label: 'Radius', value: `${config.radius} Earth radii` }
    ];

    if (config.distance) {
      stats.push({ label: 'Distance from Sun', value: `${config.distance} AU` });
    }
    if (config.distanceFromPlanet) {
      stats.push({ label: 'Distance from Parent', value: `${config.distanceFromPlanet.toFixed(1)} Earth radii` });
    }

    stats.forEach(stat => {
      const statDiv = document.createElement('div');
      statDiv.style.cssText = `
        background: rgba(255,255,255,0.05);
        padding: 15px;
        border-left: 3px solid #87CEEB;
        border-radius: 3px;
      `;
      statDiv.innerHTML = `
        <div style="color: #87CEEB; font-size: 12px; text-transform: uppercase; margin-bottom: 5px;">${stat.label}</div>
        <div style="color: #fff; font-size: 18px; font-weight: bold;">${stat.value}</div>
      `;
      this.statsContainer.appendChild(statDiv);
    });
  }

  /**
   * Start animation loop
   */
  startAnimation() {
    const animate = () => {
      this.animationId = requestAnimationFrame(animate);

      if (this.detailPlanetMesh) {
        this.detailPlanetMesh.rotation.y += 0.002;
      }

      this.detailRenderer.render(this.detailScene, this.detailCamera);
    };

    animate();
  }

  /**
   * Handle window resize
   */
  onWindowResize() {
    const width = this.detailCanvas.clientWidth;
    const height = this.detailCanvas.clientHeight;

    this.detailCamera.aspect = width / height;
    this.detailCamera.updateProjectionMatrix();

    this.detailRenderer.setSize(width, height);
  }

  /**
   * Hide detail view
   */
  hide() {
    this.detailElement.style.display = 'none';
    this.isVisible = false;
    this.currentPlanet = null;

    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /**
   * Clean up
   */
  dispose() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.detailRenderer) {
      this.detailRenderer.dispose();
    }
    if (this.detailElement && this.detailElement.parentNode) {
      this.detailElement.parentNode.removeChild(this.detailElement);
    }
  }
}
