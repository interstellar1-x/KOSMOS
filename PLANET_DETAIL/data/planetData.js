export const PLANET_DETAIL_DATA = {
  mercury: {
    type: 'Rocky Planet',
    description: 'Mercury is the smallest planet in the solar system and orbits very close to the Sun. Its surface is scarred and cratered, resembling Earth’s Moon.',
    characteristics: [
      { label: 'Surface', value: 'Rocky and cratered' },
      { label: 'Atmosphere', value: 'None' }
    ],
    facts: [
      'Mercury completes an orbit around the Sun in just 88 Earth days.',
      'Its surface temperatures can swing from -180°C to 430°C.'
    ]
  },
  venus: {
    type: 'Terrestrial Planet',
    description: 'Venus is shrouded in dense, toxic clouds. It has a runaway greenhouse effect that makes its surface hotter than Mercury’s, despite being farther from the Sun.',
    characteristics: [
      { label: 'Atmosphere', value: 'Thick CO₂ clouds' },
      { label: 'Surface', value: 'Rocky and volcanic' }
    ],
    facts: [
      'Venus rotates in the opposite direction of most planets.',
      'Its surface pressure is 92 times that of Earth.'
    ]
  },
  earth: {
    type: 'Habitable Planet',
    description: 'Earth is the only known world to support life. It has liquid water, a magnetic field, and an atmosphere that sustains a wide range of ecosystems.',
    characteristics: [
      { label: 'Water Coverage', value: '71%' },
      { label: 'Life', value: 'Confirmed' }
    ],
    facts: [
      'Earth is the densest planet in the solar system.',
      'It orbits the Sun once every 365.25 days.'
    ]
  },
  mars: {
    type: 'Red Planet',
    description: 'Mars is a cold desert world with the largest volcano and deepest canyon in the solar system. It has evidence of ancient water flows in its surface geology.',
    characteristics: [
      { label: 'Surface', value: 'Dusty and rocky' },
      { label: 'Potential', value: 'Mars may support future human missions' }
    ],
    facts: [
      'Mars has two small moons: Phobos and Deimos.',
      'A day on Mars is only 40 minutes longer than a day on Earth.'
    ]
  },
  jupiter: {
    type: 'Gas Giant',
    description: 'Jupiter is the largest planet in our solar system. It is a giant ball of gas with swirling storms and a powerful magnetic field.',
    characteristics: [
      { label: 'Composition', value: 'Hydrogen and helium' },
      { label: 'Storms', value: 'Great Red Spot' }
    ],
    facts: [
      'Jupiter has at least 79 known moons.',
      'Its mass is more than twice that of all the other planets combined.'
    ]
  },
  saturn: {
    type: 'Ringed Planet',
    description: 'Saturn is famous for its extensive ring system. The planet is a gas giant with many icy moons and a low average density.',
    characteristics: [
      { label: 'Rings', value: 'Ice and rock particles' },
      { label: 'Density', value: 'Less than water' }
    ],
    facts: [
      'Saturn would float if placed in a large enough ocean.',
      'Its rings are made of billions of particles.'
    ]
  },
  uranus: {
    type: 'Ice Giant',
    description: 'Uranus is an ice giant that rotates on its side. Its pale blue color comes from methane in the upper atmosphere.',
    characteristics: [
      { label: 'Tilt', value: '98 degrees' },
      { label: 'Temperature', value: 'Extremely cold' }
    ],
    facts: [
      'Uranus has 27 known moons.',
      'It appears blue-green due to methane gas.'
    ]
  },
  neptune: {
    type: 'Ice Giant',
    description: 'Neptune is the outermost planet and the windiest world in the solar system. Its striking blue hue is caused by methane and unknown atmospheric particles.',
    characteristics: [
      { label: 'Wind Speed', value: 'Over 2,000 km/h' },
      { label: 'Color', value: 'Deep blue' }
    ],
    facts: [
      'Neptune was the first planet discovered by mathematical prediction.',
      'Its moon Triton orbits in the opposite direction of the planet’s rotation.'
    ]
  },
  moon: {
    type: 'Natural Satellite',
    description: 'The Moon is Earth’s only natural satellite. It affects tides and has a surface covered in dust and craters.',
    characteristics: [
      { label: 'Gravity', value: '1/6 of Earth' },
      { label: 'Surface', value: 'Regolith and basalt' }
    ],
    facts: [
      'The Moon is moving away from Earth at about 3.8 cm per year.',
      'It has no atmosphere capable of supporting life.'
    ]
  },
  sun: {
    type: 'Star',
    description: 'The Sun is a massive, glowing ball of hot gas that powers the solar system. It provides light, heat, and radiation to all orbiting planets.',
    characteristics: [
      { label: 'Type', value: 'G-type main-sequence star' },
      { label: 'Energy', value: 'Nuclear fusion' }
    ],
    facts: [
      'The Sun contains 99.8% of the mass in the solar system.',
      'Its surface temperature is around 5,500°C.'
    ]
  }
};
