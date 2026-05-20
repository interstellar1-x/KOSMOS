/**
 * KOSMOS — Planet HUD Data (EN / PL)
 * Each locale contains labels and per-body scientific copy.
 */

export const HUD_LABELS = {
  en: {
    techData: 'TECHNICAL DATA',
    profile: 'PLANET PROFILE',
    facts: 'INTERESTING FACTS',
    mass: 'Mass',
    density: 'Density',
    gravity: 'Gravity',
    radius: 'Radius',
    temperature: 'Temperature',
    orbitalPeriod: 'Orbital Period',
    atmosphere: 'Atmosphere',
    noFacts: 'No additional facts available.',
  },
  pl: {
    techData: 'DANE TECHNICZNE',
    profile: 'PROFIL OBIEKTU',
    facts: 'CIEKAWOSTKI',
    mass: 'Masa',
    density: 'Gęstość',
    gravity: 'Grawitacja',
    radius: 'Promień',
    temperature: 'Temperatura',
    orbitalPeriod: 'Okres orbitalny',
    atmosphere: 'Atmosfera',
    noFacts: 'Brak dodatkowych ciekawostek.',
  },
};

export const PLANET_HUD_DATA = {
  en: {
    sun: {
      name: 'Sun',
      type: 'Star',
      mass: '1.989 × 10³⁰ kg',
      density: '1.408 g/cm³',
      gravity: '274 m/s²',
      atmosphere: 'Hydrogen (73%), Helium (25%)',
      radius: '696,340 km',
      temperature: '5,500 °C (surface)',
      orbitalPeriod: 'N/A',
      description:
        'The Sun is a massive, glowing ball of hot gas that powers the solar system. It provides light, heat, and radiation to all orbiting planets.',
      facts: [
        'The Sun contains 99.8% of the mass in the entire solar system.',
        'Its core temperature reaches approximately 15,000,000 °C, driving nuclear fusion reactions.',
        'Light from the Sun takes about 8 minutes and 20 seconds to reach Earth.',
      ],
    },
    mercury: {
      name: 'Mercury',
      type: 'Rocky Planet',
      mass: '3.285 × 10²³ kg',
      density: '5.427 g/cm³',
      gravity: '3.7 m/s²',
      atmosphere: 'Exosphere — Oxygen, Sodium, Hydrogen, Helium',
      radius: '2,439.7 km',
      temperature: '-180 to 430 °C',
      orbitalPeriod: '87.97 days',
      description:
        "Mercury is the smallest planet in the solar system and orbits very close to the Sun. Its surface is scarred and cratered, resembling Earth's Moon, with dramatic temperature swings between day and night.",
      facts: [
        'Mercury completes an orbit around the Sun in just 88 Earth days, the fastest of all planets.',
        'Despite being closest to the Sun, Mercury is not the hottest planet — Venus holds that title.',
        'A day on Mercury (sunrise to sunrise) lasts 176 Earth days.',
      ],
    },
    venus: {
      name: 'Venus',
      type: 'Terrestrial Planet',
      mass: '4.867 × 10²⁴ kg',
      density: '5.243 g/cm³',
      gravity: '8.87 m/s²',
      atmosphere: 'Carbon Dioxide (96.5%), Nitrogen (3.5%)',
      radius: '6,051.8 km',
      temperature: '462 °C (average)',
      orbitalPeriod: '224.7 days',
      description:
        "Venus is shrouded in dense, toxic clouds of sulfuric acid. A runaway greenhouse effect makes its surface hotter than Mercury's, despite being nearly twice as far from the Sun.",
      facts: [
        'Venus rotates in the opposite direction of most planets — the Sun rises in the west and sets in the east.',
        'Its surface pressure is 92 times that of Earth, equivalent to being 900 meters deep in the ocean.',
        'Venus is often called Earth\'s "sister planet" due to their similar size, mass, and composition.',
      ],
    },
    earth: {
      name: 'Earth',
      type: 'Habitable Planet',
      mass: '5.972 × 10²⁴ kg',
      density: '5.514 g/cm³',
      gravity: '9.807 m/s²',
      atmosphere: 'Nitrogen (78%), Oxygen (21%), Argon, CO₂',
      radius: '6,371 km',
      temperature: '-89 to 57 °C',
      orbitalPeriod: '365.25 days',
      description:
        'Earth is the third planet from the Sun and the only known world to support life. It has liquid water on its surface, a protective magnetic field, and an atmosphere that sustains a vast array of ecosystems.',
      facts: [
        'Earth is the densest planet in the solar system, with a metallic core of iron and nickel.',
        'About 71% of Earth\'s surface is covered by water, making it the "Blue Planet."',
        'Earth\'s atmosphere protects life by blocking harmful solar radiation and moderating temperatures.',
      ],
    },
    mars: {
      name: 'Mars',
      type: 'Red Planet',
      mass: '6.390 × 10²³ kg',
      density: '3.933 g/cm³',
      gravity: '3.721 m/s²',
      atmosphere: 'Carbon Dioxide (95%), Argon, Nitrogen',
      radius: '3,389.5 km',
      temperature: '-140 to 20 °C',
      orbitalPeriod: '687 days',
      description:
        'Mars is a cold desert world with the largest volcano (Olympus Mons) and deepest canyon (Valles Marineris) in the solar system. Evidence of ancient water flows suggests it once had a thicker atmosphere and liquid water on its surface.',
      facts: [
        'Mars has two small moons: Phobos and Deimos, both thought to be captured asteroids.',
        'A day on Mars is only 40 minutes longer than a day on Earth — called a "sol."',
        'The reddish color of Mars comes from iron oxide (rust) on its surface.',
      ],
    },
    jupiter: {
      name: 'Jupiter',
      type: 'Gas Giant',
      mass: '1.898 × 10²⁷ kg',
      density: '1.326 g/cm³',
      gravity: '24.79 m/s²',
      atmosphere: 'Hydrogen (90%), Helium (10%)',
      radius: '69,911 km',
      temperature: '-110 °C (cloud top)',
      orbitalPeriod: '4,333 days (11.86 years)',
      description:
        'Jupiter is the largest planet in our solar system, a massive ball of gas and liquid with swirling storms, powerful magnetic fields, and at least 79 known moons. The Great Red Spot is a storm larger than Earth.',
      facts: [
        'Jupiter\'s mass is more than twice that of all the other planets combined.',
        'The Great Red Spot is a storm that has been raging for at least 350 years.',
        'Jupiter has the shortest day of any planet — one rotation takes just under 10 hours.',
      ],
    },
    saturn: {
      name: 'Saturn',
      type: 'Ringed Planet',
      mass: '5.683 × 10²⁶ kg',
      density: '0.687 g/cm³',
      gravity: '10.44 m/s²',
      atmosphere: 'Hydrogen (96%), Helium (3%)',
      radius: '58,232 km',
      temperature: '-140 °C (cloud top)',
      orbitalPeriod: '10,759 days (29.46 years)',
      description:
        'Saturn is famous for its spectacular ring system, composed of ice and rock particles. The planet is a gas giant with a low average density and a large family of icy moons including Titan, which has a thick atmosphere.',
      facts: [
        'Saturn is so light it would float if placed in a large enough body of water — its density is less than water.',
        'Saturn\'s rings extend up to 282,000 km from the planet but are only about 10 meters thick.',
        'Saturn has at least 83 known moons, with Titan being larger than the planet Mercury.',
      ],
    },
    uranus: {
      name: 'Uranus',
      type: 'Ice Giant',
      mass: '8.681 × 10²⁵ kg',
      density: '1.270 g/cm³',
      gravity: '8.69 m/s²',
      atmosphere: 'Hydrogen (83%), Helium (15%), Methane (2%)',
      radius: '25,362 km',
      temperature: '-195 °C',
      orbitalPeriod: '30,687 days (84 years)',
      description:
        'Uranus is an ice giant that rotates on its side with an axial tilt of 98 degrees, likely caused by a massive ancient collision. Its pale blue-green color comes from methane gas in its upper atmosphere.',
      facts: [
        'Uranus rotates on its side, essentially rolling around the Sun on its equator.',
        'Uranus has 27 known moons, all named after characters from Shakespeare and Pope.',
        'The planet has the coldest atmosphere of any planet in the solar system at -224 °C.',
      ],
    },
    neptune: {
      name: 'Neptune',
      type: 'Ice Giant',
      mass: '1.024 × 10²⁶ kg',
      density: '1.638 g/cm³',
      gravity: '11.15 m/s²',
      atmosphere: 'Hydrogen (80%), Helium (19%), Methane (1%)',
      radius: '24,622 km',
      temperature: '-200 °C',
      orbitalPeriod: '60,190 days (164.8 years)',
      description:
        'Neptune is the outermost planet and the windiest world in the solar system with gusts reaching over 2,000 km/h. Its striking deep blue hue is caused by methane absorbing red light in the atmosphere.',
      facts: [
        'Neptune was the first planet discovered using mathematical prediction rather than direct observation.',
        'Winds on Neptune can reach supersonic speeds of up to 2,100 km/h — the fastest in the solar system.',
        'Neptune\'s moon Triton orbits in the opposite direction of the planet\'s rotation, suggesting it was captured.',
      ],
    },
    moon: {
      name: 'Moon',
      type: 'Natural Satellite',
      mass: '7.342 × 10²² kg',
      density: '3.344 g/cm³',
      gravity: '1.62 m/s²',
      atmosphere: 'Exosphere — traces of Argon, Helium, Sodium',
      radius: '1,737.4 km',
      temperature: '-233 to 123 °C',
      orbitalPeriod: '27.32 days',
      description:
        "The Moon is Earth's only natural satellite and the fifth-largest moon in the solar system. It stabilizes Earth's axial tilt, drives ocean tides, and has been a source of wonder and exploration throughout human history.",
      facts: [
        'The Moon is moving away from Earth at a rate of about 3.8 cm per year.',
        'The Moon\'s surface gravity is only 1/6 of Earth\'s — a 180 kg person would weigh only 30 kg on the Moon.',
        'The Moon was likely formed when a Mars-sized object collided with early Earth about 4.5 billion years ago.',
      ],
    },
  },

  pl: {
    sun: {
      name: 'Słońce',
      type: 'Gwiazda',
      mass: '1.989 × 10³⁰ kg',
      density: '1.408 g/cm³',
      gravity: '274 m/s²',
      atmosphere: 'Wodór (73%), hel (25%)',
      radius: '696 340 km',
      temperature: '5 500 °C (powierzchnia)',
      orbitalPeriod: 'brak',
      description:
        'Słońce to ogromna, świecąca kula gorącego gazu, która napędza Układ Słoneczny. Dostarcza światło, ciepło i promieniowanie wszystkim krążącym wokół nim planetom.',
      facts: [
        'Słońce zawiera 99,8% masy całego Układu Słonecznego.',
        'Temperatura jego jądra sięga około 15 000 000 °C, napędzając reakcje fuzji jądrowej.',
        'Światło ze Słońca dociera na Ziemię po około 8 minutach i 20 sekundach.',
      ],
    },
    mercury: {
      name: 'Merkury',
      type: 'Planeta skalista',
      mass: '3.285 × 10²³ kg',
      density: '5.427 g/cm³',
      gravity: '3.7 m/s²',
      atmosphere: 'Eksosfera — tlen, sód, wodór, hel',
      radius: '2 439,7 km',
      temperature: '-180 do 430 °C',
      orbitalPeriod: '87,97 dnia',
      description:
        'Merkury to najmniejsza planeta w Układzie Słonecznym, krążąca bardzo blisko Słońca. Jego powierzchnia jest pokryta bliznami i kraterami, przypominając Księżyc Ziemi, z dramatycznymi wahaniami temperatury między dniem a nocą.',
      facts: [
        'Merkury okrąża Słońce w zaledwie 88 dniach ziemskich — najszybciej ze wszystkich planet.',
        'Mimo że jest najbliżej Słońca, Merkury nie jest najgorętszą planetą — ten tytuł należy do Wenus.',
        'Dzień na Merkurym (od wschodu do wschodu słońca) trwa 176 dni ziemskich.',
      ],
    },
    venus: {
      name: 'Wenus',
      type: 'Planeta skalistowa',
      mass: '4.867 × 10²⁴ kg',
      density: '5.243 g/cm³',
      gravity: '8.87 m/s²',
      atmosphere: 'Dwutlenek węgla (96,5%), azot (3,5%)',
      radius: '6 051,8 km',
      temperature: '462 °C (średnia)',
      orbitalPeriod: '224,7 dnia',
      description:
        'Wenus jest spowita gęstymi, toksycznymi chmurami kwasu siarkowego. Efekt cieplarniany sprawia, że jej powierzchnia jest gorętsza niż Merkurego, mimo że znajduje się prawie dwa razy dalej od Słońca.',
      facts: [
        'Wenus obraca się w przeciwnym kierunku niż większość planet — Słońce wschodzi na zachodzie i zachodzi na wschodzie.',
        'Ciśnienie na jej powierzchni jest 92 razy większe niż na Ziemi — jak na głębokości 900 m pod wodą.',
        'Wenus bywa nazywana „planetą siostrzaną” Ziemi ze względu na podobny rozmiar, masę i skład.',
      ],
    },
    earth: {
      name: 'Ziemia',
      type: 'Planeta nadająca się do życia',
      mass: '5.972 × 10²⁴ kg',
      density: '5.514 g/cm³',
      gravity: '9.807 m/s²',
      atmosphere: 'Azot (78%), tlen (21%), argon, CO₂',
      radius: '6 371 km',
      temperature: '-89 do 57 °C',
      orbitalPeriod: '365,25 dnia',
      description:
        'Ziemia to trzecia planeta od Słońca i jedyny znany świat, na którym istnieje życie. Na jej powierzchni występuje woda w stanie ciekłym, ma ochronne pole magnetyczne i atmosferę podtrzymującą ogromną różnorodność ekosystemów.',
      facts: [
        'Ziemia jest najgęstszą planetą w Układzie Słonecznym, z metalowym jądrem żelaza i niklu.',
        'Około 71% powierzchni Ziemi pokrywa woda, dlatego nazywana jest „Niebieską Planetą”.',
        'Atmosfera Ziemi chroni życie, blokując szkodliwe promieniowanie słoneczne i regulując temperatury.',
      ],
    },
    mars: {
      name: 'Mars',
      type: 'Czerwona planeta',
      mass: '6.390 × 10²³ kg',
      density: '3.933 g/cm³',
      gravity: '3.721 m/s²',
      atmosphere: 'Dwutlenek węgla (95%), argon, azot',
      radius: '3 389,5 km',
      temperature: '-140 do 20 °C',
      orbitalPeriod: '687 dni',
      description:
        'Mars to zimny, pustynny świat z największym wulkanem (Olympus Mons) i najgłębszym kanionem (Valles Marineris) w Układzie Słonecznym. Dowody na dawne przepływy wody sugerują, że kiedyś miał gęstszą atmosferę i ciekłą wodę na powierzchni.',
      facts: [
        'Mars ma dwa małe księżyce: Phobosa i Deimosa, uważane za przechwycone asteroidy.',
        'Dzień na Marsie trwa tylko 40 minut dłużej niż na Ziemi — nazywa się go „solem”.',
        'Czerwony kolor Marsa wynika z tlenku żelaza (rdzy) na jego powierzchni.',
      ],
    },
    jupiter: {
      name: 'Jowisz',
      type: 'Gazowy olbrzym',
      mass: '1.898 × 10²⁷ kg',
      density: '1.326 g/cm³',
      gravity: '24.79 m/s²',
      atmosphere: 'Wodór (90%), hel (10%)',
      radius: '69 911 km',
      temperature: '-110 °C (wierzch chmur)',
      orbitalPeriod: '4333 dni (11,86 lat)',
      description:
        'Jowisz to największa planeta w naszym Układzie Słonecznym — ogromna kula gazu i cieczy z wirującymi burzami, silnymi polami magnetycznymi i co najmniej 79 znanymi księżycami. Wielka Czerwona Plama to burza większa od Ziemi.',
      facts: [
        'Masa Jowisza jest ponad dwukrotnie większa niż suma mas wszystkich pozostałych planet.',
        'Wielka Czerwona Plama to burza trwająca co najmniej 350 lat.',
        'Jowisz ma najkrótszy dzień ze wszystkich planet — jeden obrót trwa nieco poniżej 10 godzin.',
      ],
    },
    saturn: {
      name: 'Saturn',
      type: 'Planeta z pierścieniami',
      mass: '5.683 × 10²⁶ kg',
      density: '0.687 g/cm³',
      gravity: '10.44 m/s²',
      atmosphere: 'Wodór (96%), hel (3%)',
      radius: '58 232 km',
      temperature: '-140 °C (wierzch chmur)',
      orbitalPeriod: '10 759 dni (29,46 lat)',
      description:
        'Saturn słynie ze spektakularnego systemu pierścieni złożonego z lodu i skał. To gazowy olbrzym o niskiej średniej gęstości i licznej rodzinie lodowych księżyców, w tym Tytanie z gęstą atmosferą.',
      facts: [
        'Saturn jest tak lekki, że unosiłby się w wystarczająco dużym zbiorniku wody — jego gęstość jest mniejsza niż wody.',
        'Pierścienie Saturna sięgają do 282 000 km od planety, ale mają zaledwie około 10 metrów grubości.',
        'Saturn ma co najmniej 83 znane księżyce, a Tytan jest większy od planety Merkury.',
      ],
    },
    uranus: {
      name: 'Uran',
      type: 'Lodowy olbrzym',
      mass: '8.681 × 10²⁵ kg',
      density: '1.270 g/cm³',
      gravity: '8.69 m/s²',
      atmosphere: 'Wodór (83%), hel (15%), metan (2%)',
      radius: '25 362 km',
      temperature: '-195 °C',
      orbitalPeriod: '30 687 dni (84 lata)',
      description:
        'Uran to lodowy olbrzym obracający się „na boku” — z nachyleniem osi 98°, prawdopodobnie po kolizji w przeszłości. Blado niebiesko-zielona barwa wynika z metanu w górnej atmosferze.',
      facts: [
        'Uran obraca się „na boku”, w praktyce tocząc się wokół Słońca po swoim równiku.',
        'Uran ma 27 znanych księżyców, wszystkie nazwane na cześć postaci Szekspira i Pope\'a.',
        'Planeta ma najzimniejszą atmosferę w Układzie Słonecznym — do -224 °C.',
      ],
    },
    neptune: {
      name: 'Neptun',
      type: 'Lodowy olbrzym',
      mass: '1.024 × 10²⁶ kg',
      density: '1.638 g/cm³',
      gravity: '11.15 m/s²',
      atmosphere: 'Wodór (80%), hel (19%), metan (1%)',
      radius: '24 622 km',
      temperature: '-200 °C',
      orbitalPeriod: '60 190 dni (164,8 lat)',
      description:
        'Neptun to najdalsza planeta i najwietrzniejszy świat w Układzie Słonecznym — porywy wiatru przekraczają 2000 km/h. Głęboki niebieski kolor wynika z absorbowania czerwonego światła przez metan w atmosferze.',
      facts: [
        'Neptun był pierwszą planetą odkrytą dzięki przewidywaniom matematycznym, a nie bezpośredniej obserwacji.',
        'Wiatry na Neptunie osiągają prędkości naddźwiękowe do 2100 km/h — najszybsze w Układzie Słonecznym.',
        'Księżyc Tryton krąży w przeciwnym kierunku do rotacji planety, co sugeruje, że został przechwycony.',
      ],
    },
    moon: {
      name: 'Księżyc',
      type: 'Naturalny satelita',
      mass: '7.342 × 10²² kg',
      density: '3.344 g/cm³',
      gravity: '1.62 m/s²',
      atmosphere: 'Eksosfera — śladowe ilości argonu, helu, sodu',
      radius: '1 737,4 km',
      temperature: '-233 do 123 °C',
      orbitalPeriod: '27,32 dnia',
      description:
        'Księżyc to jedyny naturalny satelita Ziemi i piąty co do wielkości księżyc w Układzie Słonecznym. Stabilizuje nachylenie osi Ziemi, napędza pływy oceaniczne i od wieków inspiruje ludzkość do badań i podróży.',
      facts: [
        'Księżyc oddala się od Ziemi o około 3,8 cm rocznie.',
        'Grawitacja na Księżycu to tylko 1/6 ziemskiej — osoba ważąca 180 kg ważyłaby tam tylko 30 kg.',
        'Księżyc prawdopodobnie powstał, gdy obiekt wielkości Marsa zderzył się z młodą Ziemią około 4,5 mld lat temu.',
      ],
    },
  },
};

import { LANG_STORAGE_KEY } from '../shared/i18n.js';

/**
 * @param {'en'|'pl'} lang
 * @returns {'en'|'pl'}
 */
export function normalizeHudLang(lang) {
  return lang === 'pl' ? 'pl' : 'en';
}

export function getStoredHudLang() {
  try {
    return normalizeHudLang(localStorage.getItem(LANG_STORAGE_KEY));
  } catch {
    return 'en';
  }
}

export function setStoredHudLang(lang) {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, normalizeHudLang(lang));
  } catch {
    /* ignore quota / private mode */
  }
}

/**
 * Get HUD data for a specific planet by key and language
 * @param {string} key - Planet key (e.g. 'earth', 'mars')
 * @param {'en'|'pl'} [lang='en']
 * @returns {object|null} Planet HUD data with labels, or null if not found
 */
export function getPlanetHudData(key, lang = 'en') {
  const locale = normalizeHudLang(lang);
  const body = PLANET_HUD_DATA[locale]?.[key.toLowerCase()];
  if (!body) return null;
  return { ...body, labels: HUD_LABELS[locale] };
}
