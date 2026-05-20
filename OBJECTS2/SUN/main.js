import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import getStarfield from "./getStarfield.js";
// getFresnelMat removed — hard halo layer eliminated
import { EffectComposer } from "jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "jsm/postprocessing/UnrealBloomPass.js";

const SUN_SURFACE = "./sun.jpg";

function loadTextureAsync(loader, url) {
  return new Promise((resolve, reject) => {
    loader.load(url, resolve, undefined, reject);
  });
}

async function init() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);

  document.body.appendChild(renderer.domElement);
  const composer = new EffectComposer(renderer);

  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(width, height),
    0.9,  // strength
    1.2,  // radius — wide soft spread outside the disk
    0.85  // threshold — only the bright glow sprite ring triggers bloom, not the texture
  );

  composer.addPass(bloomPass);

  THREE.ColorManagement.enabled = true;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;  // was 1.35 — reduces overall overexposure
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const sunGroup = new THREE.Group();
  sunGroup.rotation.z = (-25.19 * Math.PI) / 180;
  scene.add(sunGroup);

  new OrbitControls(camera, renderer.domElement);

  const loader = new THREE.TextureLoader();
  loader.setCrossOrigin("anonymous");

  const sunTex = await loadTextureAsync(loader, SUN_SURFACE);
  sunTex.colorSpace = THREE.SRGBColorSpace;

  const geometry = new THREE.IcosahedronGeometry(1, 14);
  // MeshBasicMaterial: ignores ALL lights — uniform brightness across the full sphere,
  // no directional shading, no dark side. Correct for a self-luminous star.
  const material = new THREE.MeshBasicMaterial({
    map: sunTex,
  });

  const sunMesh = new THREE.Mesh(geometry, material);
  sunMesh.renderOrder = 1;

  // ── glowMesh (fresnel hard halo) removed ──────────────────────────────────
  // The soft atmospheric aura is produced entirely by bloomPass bleeding off
  // the emissive sun surface + the additive coronaMaterial. No separate hard
  // fresnel shell is needed, and it was the thing covering the texture.
  // ──────────────────────────────────────────────────────────────────────────

  sunGroup.add(sunMesh);

  // ── Background glow sprite ────────────────────────────────────────────────
  // Single-center gradient (no inner radius) — mathematically continuous falloff
  // from center outward, so there is no hard boundary ring at any radius.
  // SpriteMaterial auto-billboards — no quaternion copy needed in animate().
  const glowCanvas = document.createElement("canvas");
  glowCanvas.width = glowCanvas.height = 512; // higher res = smoother gradient
  const ctx = glowCanvas.getContext("2d");

  // Single-point center: gradient starts AT the center (innerRadius=0).
  // This produces a smooth, continuous falloff with no visible boundary.
  const grad = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
  grad.addColorStop(0.0,  "rgba(241, 216, 136, 0.77)");  // center fully transparent — sun disk sits here
  grad.addColorStop(0.35, "rgba(255, 180, 50, 0.47)");  // still transparent inside disk footprint
  grad.addColorStop(0.5,  "rgba(247, 153, 53, 0.23)"); // soft glow begins just outside disk edge
  grad.addColorStop(0.7,  "rgba(255, 81, 0, 0.1)");
  grad.addColorStop(1.0,  "rgba(255,  40,   0, 0.0)");  // fades to nothing at corners
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  const glowTex = new THREE.CanvasTexture(glowCanvas);
  const glowMat = new THREE.SpriteMaterial({
    map:         glowTex,
    blending:    THREE.AdditiveBlending,
    depthWrite:  false,
    depthTest:   true,  // respects depth buffer — sun mesh occludes it over the disk face
    transparent: true,
  });
  const glowMesh = new THREE.Sprite(glowMat);
  glowMesh.scale.setScalar(7); // large enough for the aura to extend well past the edge
  glowMesh.renderOrder = -1;     // drawn before sun mesh; depth test blocks it over the surface
  scene.add(glowMesh);

  const stars = getStarfield({ numStars: 5000 });
  scene.add(stars);

  // Lights removed — MeshBasicMaterial ignores them, and they were causing
  // planet-style directional shading (bright side / dark side) on the Sun.

  // removed unused camWorld/sunWorld/sunScale vectors

  function animate() {
    requestAnimationFrame(animate);
    sunMesh.rotation.y += 0.0019;
    stars.rotation.y -= 0.0002;
    composer.render();
  }

  animate();

  function handleWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener("resize", handleWindowResize, false);
}




init().catch((err) => {
  console.error(err);
});