import * as THREE from 'https://cdn.skypack.dev/three@0.152.2';

const canvas = document.getElementById('space-canvas');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 4000);
camera.position.z = 0;

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 1);

const starsCount = 8000;
const starDistance = 2000;
const positions = new Float32Array(starsCount * 3);
const initialRadius = new Float32Array(starsCount);
const initialAngles = new Float32Array(starsCount * 2);
const speeds = new Float32Array(starsCount);

function initializeStar(i) {
  const i3 = i * 3;
  const angle = Math.random() * Math.PI * 2;
  const radius = Math.random() * 200;
  
  initialAngles[i * 2] = angle;
  initialAngles[i * 2 + 1] = radius;
  initialRadius[i] = radius;
  
  positions[i3] = Math.cos(angle) * radius;
  positions[i3 + 1] = Math.sin(angle) * radius;
  positions[i3 + 2] = -Math.random() * starDistance;
  speeds[i] = 0.5 + Math.random() * 0.8;
}

for (let i = 0; i < starsCount; i++) {
  initializeStar(i);
}

const starGeometry = new THREE.BufferGeometry();
starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const starMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 1.6,
  sizeAttenuation: true,
  transparent: true,
  opacity: 0.9,
  depthWrite: false,
});

const starField = new THREE.Points(starGeometry, starMaterial);
scene.add(starField);

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const delta = Math.min(clock.getDelta(), 0.033);
  const positionAttribute = starGeometry.attributes.position;

  for (let i = 0; i < starsCount; i++) {
    const i3 = i * 3;
    const angle = initialAngles[i * 2];
    const baseRadius = initialAngles[i * 2 + 1];
    
    // Move star toward camera (positive z)
    positions[i3 + 2] += speeds[i] * delta * 150;
    
    // Expand star outward radially as it approaches camera
    const progress = (positions[i3 + 2] + starDistance) / starDistance;
    const expandedRadius = baseRadius + progress * 500;
    
    positions[i3] = Math.cos(angle) * expandedRadius;
    positions[i3 + 1] = Math.sin(angle) * expandedRadius;

    // Recycle star when it passes camera
    if (positions[i3 + 2] > 50) {
      const newAngle = Math.random() * Math.PI * 2;
      const newRadius = Math.random() * 200;
      initialAngles[i * 2] = newAngle;
      initialAngles[i * 2 + 1] = newRadius;
      positions[i3] = Math.cos(newAngle) * newRadius;
      positions[i3 + 1] = Math.sin(newAngle) * newRadius;
      positions[i3 + 2] = -starDistance;
      speeds[i] = 0.5 + Math.random() * 0.8;
    }
  }

  positionAttribute.needsUpdate = true;
  renderer.render(scene, camera);
}

function handleResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', handleResize, false);
animate();