import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import getStarfield from "./getStarfield.js";
import { getFresnelMat } from "./getFresnelMat.js";

const SATURN_SURFACE = "./saturn.jpg";
const SATURN_RING_ALPHA = "./saturn_ring_alpha.png";

function loadTextureAsync(loader, url) {
  return new Promise((resolve, reject) => {
    loader.load(url, resolve, undefined, reject);
  });
}

/** 1D radial strip texture: map horizontal U to radius between inner and outer. */
function applyRadialRingUVs(geometry, innerRadius, outerRadius) {
  const pos = geometry.attributes.position;
  const uv = geometry.attributes.uv;
  const span = outerRadius - innerRadius;
  for (let i = 0; i < uv.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const r = Math.sqrt(x * x + y * y);
    const u = THREE.MathUtils.clamp((r - innerRadius) / span, 0, 1);
    uv.setXY(i, u, 0.5);
  }
  uv.needsUpdate = true;
}

/**
 * Three.js alphaMap uses the green channel. Re-using the ring color texture makes
 * dark browns look nearly transparent. Build a mask: gaps stay 0, ring body → 1.
 */
function buildRingAlphaMapTexture(sourceTexture, gapCutoff = 0.07, bodyStart = 0.2) {
  const image = sourceTexture.image;
  if (!image?.width) return null;
  const w = image.width;
  const h = image.height;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0);
  const imgData = ctx.getImageData(0, 0, w, h);
  const d = imgData.data;
  for (let i = 0; i < d.length; i += 4) {
    const lum =
      (0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]) / 255;
    const srcA = d[i + 3] / 255;
    const fromLum = THREE.MathUtils.smoothstep(lum, gapCutoff, bodyStart);
    const o = fromLum * srcA;
    const v = Math.round(o * 255);
    d[i] = v;
    d[i + 1] = v;
    d[i + 2] = v;
    d[i + 3] = 255;
  }
  ctx.putImageData(imgData, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.NoColorSpace;
  tex.wrapS = sourceTexture.wrapS;
  tex.wrapT = sourceTexture.wrapT;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Factory function to create Saturn scene in a container
 * @param {HTMLElement} container - DOM element to render into
 * @returns {Object} { scene, camera, renderer, controls, dispose, meshes }
 */
export async function initSaturnScene(container) {
  const width = container.clientWidth;
  const height = container.clientHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  THREE.ColorManagement.enabled = true;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

  const saturnGroup = new THREE.Group();
  saturnGroup.rotation.z = (-25.19 * Math.PI) / 180;
  scene.add(saturnGroup);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.autoRotate = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  const loader = new THREE.TextureLoader();
  const baseUrl = new URL(".", import.meta.url).href;
  loader.setPath(baseUrl);
  loader.setCrossOrigin("anonymous");

  const saturnTex = await loadTextureAsync(loader, SATURN_SURFACE);
  saturnTex.colorSpace = THREE.SRGBColorSpace;

  const geometry = new THREE.IcosahedronGeometry(1, 14);
  const material = new THREE.MeshPhongMaterial({
    map: saturnTex,
    shininess: 15,
    specular: new THREE.Color(0x222222),
  });
  const saturnMesh = new THREE.Mesh(geometry, material);
  saturnGroup.add(saturnMesh);

  const ringInner = 1.14;
  const ringOuter = 2.38;
  const ringTex = await loadTextureAsync(loader, SATURN_RING_ALPHA);
  ringTex.colorSpace = THREE.SRGBColorSpace;
  ringTex.wrapS = THREE.ClampToEdgeWrapping;
  ringTex.wrapT = THREE.ClampToEdgeWrapping;

  const ringGeo = new THREE.RingGeometry(ringInner, ringOuter, 256);
  applyRadialRingUVs(ringGeo, ringInner, ringOuter);

  const ringAlphaTex = buildRingAlphaMapTexture(ringTex, 0.06, 0.22);

  const ringMat = new THREE.MeshPhongMaterial({
    map: ringTex,
    alphaMap: ringAlphaTex ?? ringTex,
    color: new THREE.Color(1.35, 1.28, 1.15),
    emissiveMap: ringTex,
    emissive: new THREE.Color(0xffffff),
    emissiveIntensity: 0.42,
    transparent: true,
    opacity: 1,
    depthWrite: false,
    depthTest: true,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
    side: THREE.DoubleSide,
    shininess: 12,
    specular: new THREE.Color(0x333333),
  });
  const ringMesh = new THREE.Mesh(ringGeo, ringMat);
  ringMesh.rotation.x = Math.PI / 2;
  ringMesh.renderOrder = 1;
  saturnMesh.add(ringMesh);

  const fresnelMat = getFresnelMat({
    rimHex: 0xd4a574,
    facingHex: 0x000000,
  });
  const glowMesh = new THREE.Mesh(geometry, fresnelMat);
  glowMesh.scale.setScalar(1.01);
  saturnGroup.add(glowMesh);

  const stars = getStarfield({ numStars: 5000 });
  scene.add(stars);

  const sunLight = new THREE.DirectionalLight(0xffffff, 3.2);
  sunLight.position.set(-2.2, 0.7, 1.6);
  scene.add(sunLight);

  scene.add(new THREE.AmbientLight(0xffffff, 0.42));
  scene.add(new THREE.HemisphereLight(0xffc9a8, 0x1f1814, 0.55));

  let animationId = null;

  function animate() {
    animationId = requestAnimationFrame(animate);
    saturnMesh.rotation.y += 0.0019;
    glowMesh.rotation.y += 0.002;
    stars.rotation.y -= 0.0002;
    controls.update();
    renderer.render(scene, camera);
  }

  function handleWindowResize() {
    const newWidth = container.clientWidth;
    const newHeight = container.clientHeight;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
  }

  function dispose() {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    window.removeEventListener("resize", handleWindowResize);
    renderer.dispose();
    geometry.dispose();
    material.dispose();
    ringGeo.dispose();
    ringMat.dispose();
    fresnelMat.dispose();
  }

  window.addEventListener("resize", handleWindowResize, false);
  animate();

  return {
    scene,
    camera,
    renderer,
    controls,
    dispose,
    meshes: { saturnMesh, ringMesh, glowMesh, stars },
  };
}
