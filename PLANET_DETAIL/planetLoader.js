import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

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

export class PlanetLoader {
  constructor() {
    this.canvas = null;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.planetMesh = null;
    this.animationFrame = null;
    this.initialized = false;
    this.gltfLoader = new GLTFLoader();
    this.onAnimationFrame = this.onAnimationFrame.bind(this);
  }

  initialize(canvas) {
    if (this.initialized && this.canvas === canvas) {
      return;
    }

    this.canvas = canvas;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x02040c);

    this.camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    this.camera.position.set(0, 0, 4.2);

    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: false
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    this.addLighting();
    this.addStarfield();
    this.initialized = true;
  }

  addLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
    this.scene.add(ambientLight);

    const keyLight = new THREE.PointLight(0xffffff, 1.6, 0, 2);
    keyLight.position.set(4, 2, 5);
    this.scene.add(keyLight);

    const fillLight = new THREE.PointLight(0x67b2ff, 0.35, 0, 2);
    fillLight.position.set(-3, -2, 2);
    this.scene.add(fillLight);
  }

  addStarfield() {
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 1200;
    const positions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 100;
      positions[i + 1] = (Math.random() - 0.5) * 100;
      positions[i + 2] = (Math.random() - 0.5) * 100;
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.4,
      transparent: true,
      opacity: 0.8
    });

    const stars = new THREE.Points(starGeometry, starMaterial);
    this.scene.add(stars);
  }

  async loadPlanet(config) {
    if (!config) {
      return;
    }

    this.clearCurrentPlanet();

    const planetName = this.getBodyKey(config);
    const modelPath = config.model || DEFAULT_MODEL_PATHS[planetName];
    if (!modelPath) {
      console.error('No relative model path configured for PlanetDetail:', config);
      return;
    }

    try {
      const model = await this.loadModel(modelPath);
      const planet = new THREE.Group();
      planet.name = planetName;
      planet.userData = { planetName };

      this.normalizeModel(model, this.getDetailRadius(config));
      this.prepareModelMaterials(model, planetName === 'sun');
      planet.add(model);

      if (planetName === 'sun') {
        this.addSunGlow(planet, this.getDetailRadius(config));
      } else {
        this.addAtmosphereGlow(planet, this.getDetailRadius(config), this.getGlowColor(planetName));
      }

      this.scene.add(planet);
      this.planetMesh = planet;
    } catch (error) {
      console.warn(`Model not found at ${modelPath}; using existing OBJECTS texture asset for ${planetName}.`, error);
      this.loadTextureFallbackPlanet(planetName, config);
    }
  }

  loadTextureFallbackPlanet(planetName, config) {
    const radius = this.getDetailRadius(config);
    const textureLoader = new THREE.TextureLoader();
    const texture = config.texture ? textureLoader.load(config.texture) : null;
    if (texture) {
      texture.colorSpace = THREE.SRGBColorSpace;
    }

    const planet = new THREE.Group();
    planet.name = planetName;
    planet.userData = { planetName };

    const geometry = new THREE.IcosahedronGeometry(radius, 8);
    const material = planetName === 'sun'
      ? new THREE.MeshBasicMaterial({ map: texture, color: texture ? 0xffffff : 0xffcc66, toneMapped: false })
      : new THREE.MeshPhysicalMaterial({
          map: texture,
          color: texture ? 0xffffff : 0xcccccc,
          roughness: 1,
          metalness: 0,
          clearcoat: 0.1,
          clearcoatRoughness: 0.3
        });

    planet.add(new THREE.Mesh(geometry, material));

    if (planetName === 'saturn' && config.rings) {
      this.addFallbackRings(planet, radius, config.rings);
    }

    if (planetName === 'sun') {
      this.addSunGlow(planet, radius);
    } else {
      this.addAtmosphereGlow(planet, radius, this.getGlowColor(planetName));
    }

    this.scene.add(planet);
    this.planetMesh = planet;
  }

  addFallbackRings(parent, radius, ringsPath) {
    const textureLoader = new THREE.TextureLoader();
    const ringTexture = textureLoader.load(ringsPath);
    ringTexture.colorSpace = THREE.SRGBColorSpace;

    const ringGeometry = new THREE.RingGeometry(radius * 1.25, radius * 1.9, 96);
    const ringMaterial = new THREE.MeshBasicMaterial({
      map: ringTexture,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    ring.rotation.z = Math.PI / 4;
    parent.add(ring);
  }

  loadModel(path) {
    return new Promise((resolve, reject) => {
      this.gltfLoader.load(path, (gltf) => resolve(gltf.scene), undefined, reject);
    });
  }

  getBodyKey(config) {
    return (config.key || config.id || config.name || 'planet').toLowerCase();
  }

  getDetailRadius(config) {
    return config.bodyType === 'Star' || this.getBodyKey(config) === 'sun' ? 1.45 : 1.3;
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

  prepareModelMaterials(model, isSun) {
    model.traverse((child) => {
      if (!child.isMesh) return;

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

    return new THREE.MeshBasicMaterial({
      map: material.map || null,
      color: material.color ? material.color.clone() : new THREE.Color(0xffffff),
      transparent: material.transparent,
      opacity: material.opacity,
      side: material.side,
      toneMapped: false
    });
  }

  addAtmosphereGlow(parent, radius, color) {
    const atmosphereGeometry = new THREE.IcosahedronGeometry(radius * 1.04, 6);
    const atmosphereMaterial = this.createFresnelMaterial(color);
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    atmosphere.name = `${parent.name}-soft-glow`;
    atmosphere.userData.isGlow = true;
    parent.add(atmosphere);
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

  addSunGlow(parent, radius) {
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
    parent.add(glow);
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

  clearCurrentPlanet() {
    if (!this.planetMesh) {
      return;
    }

    this.scene.remove(this.planetMesh);
    this.planetMesh.traverse((child) => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach((material) => material.dispose());
      }
    });
    this.planetMesh = null;
  }

  start() {
    if (this.animationFrame) {
      return;
    }
    this.animationFrame = requestAnimationFrame(this.onAnimationFrame);
  }

  onAnimationFrame() {
    if (this.planetMesh) {
      this.planetMesh.rotation.y += 0.0025;
    }
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
    this.animationFrame = requestAnimationFrame(this.onAnimationFrame);
  }

  onWindowResize() {
    if (!this.canvas || !this.camera || !this.renderer) {
      return;
    }
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  stop() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  dispose() {
    this.stop();
    this.clearCurrentPlanet();
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer = null;
    }
    if (this.scene) {
      this.scene.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach((material) => material.dispose());
        }
      });
    }
    this.scene = null;
    this.camera = null;
    this.canvas = null;
  }
}
