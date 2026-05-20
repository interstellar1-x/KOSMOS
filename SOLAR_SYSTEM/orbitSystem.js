import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { SOLAR_CONFIG } from './solarconfig.js';

const DEFAULT_MODEL_PATHS = {
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
 * OrbitSystem - Manages model loading and planetary orbits.
 * The visible bodies are loaded from OBJECTS with relative GLTF paths.
 */
export class OrbitSystem {
  constructor(scene) {
    this.scene = scene;
    this.loader = new GLTFLoader();

    this.orbitGroups = new Map();
    this.planets = new Map();
    this.moons = new Map();
    this.moonOrbitGroups = new Map();
    this.glowMeshes = new Set();
    this.planetConfigs = SOLAR_CONFIG.planets;
    this.moonConfigs = SOLAR_CONFIG.moons || {};
    this.sun = null;
    this.earthClouds = null;
  }

  async initialize() {
    await this.createSun();
    await this.createPlanets();
    await this.createMoons();
  }

  loadModel(path) {
    return new Promise((resolve, reject) => {
      this.loader.load(path, (gltf) => resolve(gltf.scene), undefined, reject);
    });
  }

  getModelPath(bodyName, config) {
    return config.model || DEFAULT_MODEL_PATHS[bodyName];
  }

  async createBodyModel(bodyName, config, { isSun = false } = {}) {
    const modelPath = this.getModelPath(bodyName, config);
    if (!modelPath) {
      throw new Error(`No relative model path configured for ${bodyName}`);
    }

    try {
      const model = await this.loadModel(modelPath);
      model.name = `${bodyName}-model`;
      model.userData.planetName = bodyName;
      this.normalizeModel(model, config.radius);
      this.prepareModelMaterials(model, { isSun });
      return model;
    } catch (error) {
      console.warn(`Model not found at ${modelPath}; using existing OBJECTS texture asset for ${bodyName}.`, error);
      return this.createTexturedBody(bodyName, config, { isSun });
    }
  }

  createTexturedBody(bodyName, config, { isSun = false } = {}) {
    const textureLoader = new THREE.TextureLoader();
    const texture = config.texture ? textureLoader.load(config.texture) : null;
    if (texture) {
      texture.colorSpace = THREE.SRGBColorSpace;
    }

    const geometry = new THREE.IcosahedronGeometry(config.radius, 8);
    const material = isSun
      ? new THREE.MeshBasicMaterial({ map: texture, color: texture ? 0xffffff : 0xffcc66, toneMapped: false })
      : new THREE.MeshPhysicalMaterial({
          map: texture,
          color: texture ? 0xffffff : 0xcccccc,
          roughness: 1,
          metalness: 0,
          clearcoat: 0.08,
          clearcoatRoughness: 0.35
        });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = `${bodyName}-texture-fallback`;
    mesh.userData.planetName = bodyName;

    if (bodyName === 'saturn' && config.rings) {
      this.addFallbackRings(mesh, config);
    }

    return mesh;
  }

  addFallbackRings(parent, config) {
    const textureLoader = new THREE.TextureLoader();
    const ringTexture = textureLoader.load(config.rings);
    ringTexture.colorSpace = THREE.SRGBColorSpace;

    const ringsGeometry = new THREE.RingGeometry(config.radius * 1.2, config.radius * 2.0, 96);
    const ringsMaterial = new THREE.MeshBasicMaterial({
      map: ringTexture,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const rings = new THREE.Mesh(ringsGeometry, ringsMaterial);
    rings.rotation.x = Math.PI / 2;
    parent.add(rings);
  }

  normalizeModel(model, radius) {
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDimension = Math.max(size.x, size.y, size.z);

    if (maxDimension > 0) {
      const scale = (radius * 2) / maxDimension;
      model.position.sub(center);
      model.scale.setScalar(scale);
    }
  }

  prepareModelMaterials(model, { isSun = false } = {}) {
    model.traverse((child) => {
      if (!child.isMesh) return;

      child.userData.planetName = model.userData.planetName;
      child.castShadow = false;
      child.receiveShadow = false;

      const materials = Array.isArray(child.material) ? child.material : [child.material];
      const preparedMaterials = materials.map((material) => this.prepareMaterial(material, isSun));
      child.material = Array.isArray(child.material) ? preparedMaterials : preparedMaterials[0];
    });
  }

  prepareMaterial(material, isSun) {
    if (!material) {
      return isSun
        ? new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false })
        : new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 1, metalness: 0 });
    }

    if (material.map) {
      material.map.colorSpace = THREE.SRGBColorSpace;
    }

    if (!isSun) {
      material.roughness = material.roughness ?? 1;
      material.metalness = material.metalness ?? 0;
      material.needsUpdate = true;
      return material;
    }

    const sunMaterial = new THREE.MeshBasicMaterial({
      map: material.map || null,
      color: material.color ? material.color.clone() : new THREE.Color(0xffffff),
      transparent: material.transparent,
      opacity: material.opacity,
      side: material.side,
      toneMapped: false
    });
    return sunMaterial;
  }

  async createSun() {
    const sunGroup = new THREE.Group();
    sunGroup.name = 'sun';
    sunGroup.userData.planetName = 'sun';

    const sunModel = await this.createBodyModel('sun', SOLAR_CONFIG.sun, { isSun: true });
    sunGroup.add(sunModel);
    this.addSunLightingAndGlow(sunGroup, SOLAR_CONFIG.sun.radius);

    this.scene.add(sunGroup);
    this.sun = sunGroup;
  }

  addSunLightingAndGlow(sunGroup, radius) {
    const sunLight = new THREE.PointLight(0xffffff, 1.6, 0, 2);
    sunLight.position.set(0, 0, 0);
    sunGroup.add(sunLight);

    const glow = this.createSoftGlowSprite({
      colorStops: [
        [0.0, 'rgba(255, 240, 170, 0.78)'],
        [0.34, 'rgba(255, 185, 70, 0.46)'],
        [0.56, 'rgba(255, 120, 24, 0.22)'],
        [0.78, 'rgba(255, 70, 0, 0.09)'],
        [1.0, 'rgba(255, 40, 0, 0.0)']
      ],
      scale: radius * 5.2
    });
    glow.renderOrder = -1;
    sunGroup.add(glow);
  }

  createSoftGlowSprite({ colorStops, scale }) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext('2d');
    const gradient = context.createRadialGradient(256, 256, 0, 256, 256, 256);

    colorStops.forEach(([offset, color]) => gradient.addColorStop(offset, color));
    context.fillStyle = gradient;
    context.fillRect(0, 0, 512, 512);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({
      map: texture,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: true,
      transparent: true,
      toneMapped: false
    });

    const sprite = new THREE.Sprite(material);
    sprite.scale.setScalar(scale);
    return sprite;
  }

  async createPlanets() {
    for (const [planetName, config] of Object.entries(this.planetConfigs)) {
      await this.createPlanet(planetName, config);
    }
  }

  async createMoons() {
    for (const [moonName, config] of Object.entries(this.moonConfigs)) {
      await this.createMoon(moonName, config);
    }
  }

  async createPlanet(planetName, config) {
    const orbitGroup = new THREE.Group();
    this.scene.add(orbitGroup);
    this.orbitGroups.set(planetName, orbitGroup);

    const planetGroup = new THREE.Group();
    planetGroup.name = planetName;
    planetGroup.position.x = config.distance;
    planetGroup.userData.planetName = planetName;

    const planetModel = await this.createBodyModel(planetName, config);
    planetGroup.add(planetModel);
    this.addAtmosphereGlow(planetGroup, config.radius, this.getGlowColor(planetName));

    orbitGroup.add(planetGroup);
    this.planets.set(planetName, planetGroup);
    this.createOrbitPath(config.distance);
  }

  addAtmosphereGlow(parent, radius, color) {
    const geometry = new THREE.IcosahedronGeometry(radius * 1.04, 6);
    const material = this.createFresnelMaterial(color);
    const glowMesh = new THREE.Mesh(geometry, material);
    glowMesh.name = `${parent.name}-soft-glow`;
    glowMesh.userData.isGlow = true;
    glowMesh.renderOrder = 2;
    parent.add(glowMesh);
    this.glowMeshes.add(glowMesh);
  }

  createFresnelMaterial(rimHex = 0x84c8ff) {
    return new THREE.ShaderMaterial({
      uniforms: {
        rimColor: { value: new THREE.Color(rimHex) },
        facingColor: { value: new THREE.Color(0x000000) },
        fresnelBias: { value: 0.02 },
        fresnelScale: { value: 0.95 },
        fresnelPower: { value: 3.4 }
      },
      vertexShader: `
        uniform float fresnelBias;
        uniform float fresnelScale;
        uniform float fresnelPower;
        varying float vReflectionFactor;

        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vec3 worldNormal = normalize(mat3(modelMatrix) * normal);
          vec3 eyeVector = normalize(worldPosition.xyz - cameraPosition);
          vReflectionFactor = fresnelBias + fresnelScale * pow(1.0 + dot(eyeVector, worldNormal), fresnelPower);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 rimColor;
        uniform vec3 facingColor;
        varying float vReflectionFactor;

        void main() {
          float alpha = smoothstep(0.0, 1.0, clamp(vReflectionFactor, 0.0, 1.0)) * 0.45;
          vec3 color = mix(facingColor, rimColor, alpha);
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.BackSide,
      toneMapped: false
    });
  }

  getGlowColor(bodyName) {
    const colors = {
      mercury: 0xc8d0d8,
      venus: 0xffcf8b,
      earth: 0x84c8ff,
      mars: 0xff8d5c,
      jupiter: 0xffc89a,
      saturn: 0xffd89a,
      uranus: 0x89f0ff,
      neptune: 0x6da8ff,
      moon: 0xd8e3ff
    };
    return colors[bodyName] || 0x84c8ff;
  }

  async createMoon(moonName, config) {
    const parentPlanet = this.planets.get(config.parent);
    const parentOrbitGroup = this.orbitGroups.get(config.parent);
    if (!parentPlanet || !parentOrbitGroup) return;

    const moonOrbitGroup = new THREE.Group();
    moonOrbitGroup.position.copy(parentPlanet.position);
    parentOrbitGroup.add(moonOrbitGroup);
    this.moonOrbitGroups.set(moonName, moonOrbitGroup);

    const moonGroup = new THREE.Group();
    moonGroup.name = moonName;
    moonGroup.position.x = config.distanceFromPlanet;
    moonGroup.userData.planetName = moonName;
    moonGroup.userData.parent = config.parent;

    const moonModel = await this.createBodyModel(moonName, config);
    moonGroup.add(moonModel);
    this.addAtmosphereGlow(moonGroup, config.radius, this.getGlowColor(moonName));

    moonOrbitGroup.add(moonGroup);
    this.moons.set(moonName, moonGroup);
    this.createOrbitPath(config.distanceFromPlanet, parentOrbitGroup, parentPlanet.position);
  }

  createOrbitPath(distance, parent = this.scene, center = new THREE.Vector3()) {
    const orbitSegments = 128;
    const orbitGeometry = new THREE.BufferGeometry();
    const vertices = [];
    for (let i = 0; i <= orbitSegments; i += 1) {
      const angle = (i / orbitSegments) * Math.PI * 2;
      vertices.push(Math.cos(angle) * distance, 0, Math.sin(angle) * distance);
    }
    orbitGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    const orbitMaterial = new THREE.LineBasicMaterial({
      color: 0x88ccff,
      transparent: true,
      opacity: 0.18,
      linewidth: 1,
      toneMapped: false
    });

    const orbitLine = new THREE.LineLoop(orbitGeometry, orbitMaterial);
    orbitLine.position.copy(center);
    parent.add(orbitLine);
  }

  update(deltaTime) {
    if (this.sun) {
      this.sun.rotation.y += SOLAR_CONFIG.sun.rotationSpeed * deltaTime;
    }

    this.orbitGroups.forEach((orbitGroup, planetName) => {
      const config = this.planetConfigs[planetName];
      orbitGroup.rotation.y += config.orbitSpeed * deltaTime;

      const planet = this.planets.get(planetName);
      if (planet) {
        planet.rotation.y += config.rotationSpeed * deltaTime;
      }
    });

    this.moonOrbitGroups.forEach((moonOrbitGroup, moonName) => {
      const config = this.moonConfigs[moonName];
      if (!config) return;

      moonOrbitGroup.rotation.y += config.orbitSpeed * deltaTime;
      const moon = this.moons.get(moonName);
      if (moon) {
        moon.rotation.y += config.rotationSpeed * deltaTime;
      }
    });

    this.glowMeshes.forEach((glowMesh) => {
      glowMesh.rotation.y += 0.002 * deltaTime;
    });
  }

  getPlanet(planetName) {
    return this.planets.get(planetName);
  }

  getOrbitGroup(planetName) {
    return this.orbitGroups.get(planetName);
  }

  getPlanetWorldPosition(planetName) {
    let mesh = this.planets.get(planetName);
    if (!mesh) {
      mesh = this.moons.get(planetName);
    }
    if (mesh) {
      const worldPosition = new THREE.Vector3();
      mesh.getWorldPosition(worldPosition);
      return worldPosition;
    }
    return null;
  }
}
