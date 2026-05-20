import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import getStarfield from "./getStarfield.js";
import { getFresnelMat } from "./getFresnelMat.js";

const PLANETS = "https://threejs.org/examples/textures/planets/";

const TEXTURES = {
  earth: "./earthmap.jpg",
  clouds: `${PLANETS}earth_clouds_1024.png`,
};

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

  THREE.ColorManagement.enabled = true;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

  const earthGroup = new THREE.Group();
  earthGroup.rotation.z = (-23.4 * Math.PI) / 180;
  scene.add(earthGroup);

  new OrbitControls(camera, renderer.domElement);

  const loader = new THREE.TextureLoader();
  loader.setCrossOrigin("anonymous");

  const [earthTex, cloudsTex] = await Promise.all([
    loadTextureAsync(loader, TEXTURES.earth),
    loadTextureAsync(loader, TEXTURES.clouds),
  ]);

  earthTex.colorSpace = THREE.SRGBColorSpace;

  const geometry = new THREE.IcosahedronGeometry(1, 14);
  const material = new THREE.MeshPhongMaterial({
    map: earthTex,
    shininess: 15,
    specular: new THREE.Color(0x222222),
  });
  const earthMesh = new THREE.Mesh(geometry, material);
  earthGroup.add(earthMesh);

  const cloudsMat = new THREE.MeshStandardMaterial({
    map: cloudsTex,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
  });

  const cloudsMesh = new THREE.Mesh(geometry, cloudsMat);
  cloudsMesh.scale.setScalar(1.003);
  earthGroup.add(cloudsMesh);

  const fresnelMat = getFresnelMat();
  const glowMesh = new THREE.Mesh(geometry, fresnelMat);
  glowMesh.scale.setScalar(1.01);
  earthGroup.add(glowMesh);

  const stars = getStarfield({ numStars: 5000 });
  scene.add(stars);

  const sunLight = new THREE.DirectionalLight(0xffffff, 3.2);
  sunLight.position.set(-2.2, 0.7, 1.6);
  scene.add(sunLight);

  scene.add(new THREE.AmbientLight(0xffffff, 0.42));
  scene.add(new THREE.HemisphereLight(0xcfe8ff, 0x1a1a22, 0.55));

  function animate() {
    requestAnimationFrame(animate);
    earthMesh.rotation.y += 0.0019;
    cloudsMesh.rotation.y += 0.0026;
    glowMesh.rotation.y += 0.002;
    stars.rotation.y -= 0.0002;
    renderer.render(scene, camera);
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
