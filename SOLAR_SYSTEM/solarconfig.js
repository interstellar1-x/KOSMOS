// Solar System Configuration
export const SOLAR_CONFIG = {
  // Planet data with simplified astronomical values
  planets: {
    mercury: {
      name: 'Mercury',
      radius: 0.38, // Relative to Earth
      distance: 4, // AU scaled
      orbitSpeed: 0.04, // Radians per second
      rotationSpeed: 0.01,
      model: '../OBJECTS/MERCURY/mercury.glb',
      texture: '../OBJECTS/MERCURY/mercury.jpg',
      info: 'The smallest planet in our solar system.'
    },
    venus: {
      name: 'Venus',
      radius: 0.95,
      distance: 7,
      orbitSpeed: 0.035,
      rotationSpeed: 0.008,
      model: '../OBJECTS/VENUS/venus.glb',
      texture: '../OBJECTS/VENUS/venus.jpg',
      info: 'The hottest planet with a thick atmosphere.'
    },
    earth: {
      name: 'Earth',
      radius: 1.0,
      distance: 10,
      orbitSpeed: 0.03,
      rotationSpeed: 0.02,
      model: '../OBJECTS/EARTH/earth.glb',
      texture: '../OBJECTS/EARTH/earthmap.jpg',
      clouds: 'https://threejs.org/examples/textures/planets/earth_clouds_1024.png',
      info: 'Our home planet, the only known planet with life.'
    },
    mars: {
      name: 'Mars',
      radius: 0.53,
      distance: 15,
      orbitSpeed: 0.025,
      rotationSpeed: 0.018,
      model: '../OBJECTS/MARS/mars.glb',
      texture: '../OBJECTS/MARS/mars.jpg',
      info: 'The Red Planet, with the largest volcano in the solar system.'
    },
    jupiter: {
      name: 'Jupiter',
      radius: 2.5,
      distance: 25,
      orbitSpeed: 0.02,
      rotationSpeed: 0.04,
      model: '../OBJECTS/JUPITER/jupiter.glb',
      texture: '../OBJECTS/JUPITER/jupiter.jpg',
      info: 'The largest planet, a gas giant with a Great Red Spot.'
    },
    saturn: {
      name: 'Saturn',
      radius: 2.1,
      distance: 35,
      orbitSpeed: 0.015,
      rotationSpeed: 0.035,
      model: '../OBJECTS/SATURN/saturn.glb',
      texture: '../OBJECTS/SATURN/saturn.jpg',
      rings: '../OBJECTS/SATURN/saturn_ring_alpha.png',
      info: 'Famous for its prominent ring system.'
    },
    uranus: {
      name: 'Uranus',
      radius: 1.6,
      distance: 45,
      orbitSpeed: 0.01,
      rotationSpeed: 0.03,
      model: '../OBJECTS/URANUS/uranus.glb',
      texture: '../OBJECTS/URANUS/uranus.jpg',
      info: 'An ice giant that rotates on its side.'
    },
    neptune: {
      name: 'Neptune',
      radius: 1.5,
      distance: 55,
      orbitSpeed: 0.008,
      rotationSpeed: 0.032,
      model: '../OBJECTS/NEPTUNE/neptune.glb',
      texture: '../OBJECTS/NEPTUNE/neptune.jpg',
      info: 'The windiest planet with supersonic winds.'
    }
  },

  // Moon and satellite data
  moons: {
    moon: {
      name: 'Moon',
      radius: 0.27,
      distanceFromPlanet: 1.8,
      orbitSpeed: 0.18,
      rotationSpeed: 0.009,
      model: '../OBJECTS/MOON/moon.glb',
      texture: '../OBJECTS/MOON/moon.jpg',
      parent: 'earth',
      info: 'Earth’s only natural satellite, orbiting together with Earth around the Sun.'
    }
  },

  // Sun configuration
  sun: {
    name: 'Sun',
    radius: 2.0,
    model: '../OBJECTS/SUN/sun.glb',
    texture: '../OBJECTS/SUN/sun.jpg',
    rotationSpeed: 0.005,
    info: 'The star at the center of our solar system, providing light and energy to the planets.',
    bodyType: 'Star'
  },

  // Scene settings
  scene: {
    backgroundColor: 0x000000,
    fogColor: 0x000011,
    fogDensity: 0.00001
  },

  // Camera settings
  camera: {
    fov: 60,
    near: 0.1,
    far: 1000,
    initialPosition: { x: 0, y: 25, z: 60 }
  },

  // Lighting
  lighting: {
    ambient: { color: 0x404040, intensity: 0.4 },
    sunLight: { color: 0xffffff, intensity: 2.0, position: { x: 0, y: 0, z: 0 } }
  }
};
