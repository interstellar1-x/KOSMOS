/**
 * ABOUT PROJECT — Multilingual content data
 * Structure ready for EN/PL language switching
 */

const contentData = {
  en: {
    hero: {
      subtitle: 'Interactive Universe Explorer',
    },
    nav: {
      back: '← BACK',
      aboutMe: 'About Me',
      aboutSchool: 'About School',
      aboutProject: 'About Project',
      sources: 'Sources',
    },
    aboutMe: {
      name: 'Bespalova Solomiia',
      age: '18 years old',
      class: 'Class 4F',
      subtitle: 'Technician Informatics Student',
      description:
        'I am passionate about space, programming, and interactive web technologies. This project combines my interest in astronomy with modern web development and 3D visualization.',
    },
    aboutSchool: {
      name: 'Zespół Szkół im. Jana Kasprowicza',
      subtitle: 'Jelcz-Laskowice',
      description:
        'Zespół Szkół im. Jana Kasprowicza in Jelcz-Laskowice is a secondary school offering both general and technical education. The school provides study programs in various fields and supports students in developing practical and vocational skills. It also cooperates with external institutions and local partners through educational projects and activities.',
      address: 'ul. Techników 26, 55-220 Jelcz-Laskowice',
      website: 'zsjelcz.pl',
    },
    aboutProject: {
      title: 'Interactive journey through the Universe',
      description:
        'The project presents an interactive journey through space, showing planets, celestial objects, and space scenes built with modern web technologies, including Three.js and WebGL. It includes realistic textures, smooth orbital movement, dynamic lighting, and an easy-to-use interface for exploring information about planets and the universe. The project combines education, design, and an immersive visual experience into one interactive space exploration.',
      techStack: ['Three.js', 'WebGL', 'JavaScript', 'GLSL Shaders'],
      note: 'Strona została wykonana na potrzeby konkursu "Kreator"',
    },
    sources: {
      title: 'Sources & References',
      items: [
        {
          label: 'Planet Textures',
          url: 'https://www.solarsystemscope.com/textures/',
        },
        {
          label: 'GitHub Repository — 3D planet visualization in Three.js',
          url: 'https://github.com/SaraRasoulian/3D-Earth/blob/main/',
        },
        {
          label: 'GitHub Repository — Milky Way galaxy visualization in Three.js',
          url: 'https://github.com/pickles976/GalaxyThreeJS',
        },
        {
          label: 'Wikipedia — astronomy and planetary information',
          url: 'https://en.wikipedia.org/wiki/Solar_System',
        },
        {
          label: 'Three.js Documentation',
          url: 'https://threejs.org/docs/',
        },
        {
          label: 'Zespół Szkół im. Jana Kasprowicza w Jelcz-Laskowicach',
          url: 'https://zsjelcz.pl/',
        },
        {
          label: '“Kreator” Competition Regulations PDF',
          url: 'https://zsjelcz.pl/upload/pliki/regulamin-2026-7a9af283.pdf',
        },
      ],
    },
    footer: {
      text: '© 2026 Bespalova Solomiia — The website was created for the "Kreator" competition.',
      textCopyright: '© All rights reserved',
    },
  },

  pl: {
    hero: {
      subtitle: 'Interaktywny Eksplorator Wszechświata',
    },
    nav: {
      back: '← WSTECZ',
      aboutMe: 'O Mnie',
      aboutSchool: 'O Szkole',
      aboutProject: 'O Projekcie',
      sources: 'Źródła',
    },
    aboutMe: {
      name: 'Bespalova Solomiia',
      age: '18 lat',
      class: 'Klasa 4F',
      subtitle: 'Technik Informatyk',
      description:
        'Interesuję się programowaniem, kosmosem i interaktywnymi technologiami webowymi. Ten projekt łączy moje zainteresowanie astronomią z nowoczesnym web developmentem oraz wizualizacją 3D.',
    },
    aboutSchool: {
      name: 'Zespół Szkół im. Jana Kasprowicza',
      subtitle: 'Jelcz-Laskowice',
      description:
        'Zespół Szkół im. Jana Kasprowicza w Jelczu-Laskowicach to szkoła ponadpodstawowa oferująca kształcenie ogólne oraz techniczne. Placówka prowadzi programy nauczania w różnych obszarach i wspiera uczniów w rozwijaniu umiejętności praktycznych oraz zawodowych. Współpracuje również z instytucjami zewnętrznymi i lokalnymi partnerami w ramach projektów i działań edukacyjnych.',
      address: 'ul. Techników 26, 55-220 Jelcz-Laskowice',
      website: 'zsjelcz.pl',
    },
    aboutProject: {
      title: 'Interaktywna podróż przez wszechświat',
      description:
        'Projekt przedstawia interaktywną podróż przez kosmos, pokazując planety, obiekty niebieskie oraz sceny kosmiczne stworzone z wykorzystaniem nowoczesnych technologii internetowych, w tym Three.js i WebGL. Zawiera realistyczne tekstury, płynny ruch orbitalny, dynamiczne oświetlenie oraz intuicyjny interfejs umożliwiający przeglądanie informacji o planetach i wszechświecie. Projekt łączy edukację, design i immersyjne doświadczenie wizualne w jedną interaktywną formę eksploracji kosmosu.',
      techStack: ['Three.js', 'WebGL', 'JavaScript', 'GLSL Shaders'],
      note: 'Strona została wykonana na potrzeby konkursu "Kreator"',
    },
    sources: {
      title: 'Źródła i Referencje',
      items: [
         {
          label: 'Tekstury Planet',
          url: 'https://www.solarsystemscope.com/textures/',
        },
        {
          label: 'GitHub Repository — Wizualizacja planet 3D w Three.js',
          url: 'https://github.com/SaraRasoulian/3D-Earth/blob/main/',
        },
        {
          label: 'GitHub Repository — Wizualizacja Drogi Mlecznej w Three.js',
          url: 'https://github.com/pickles976/GalaxyThreeJS',
        },
        {
          label: 'Wikipedia — astronomia i informacje o planetach',
          url: 'https://pl.wikipedia.org/wiki/Układ_Słoneczny',
        },
        {
          label: 'Three.js Dokumentacja',
          url: 'https://threejs.org/docs/',
        },
        {
          label: 'Zespół Szkół im. Jana Kasprowicza w Jelcz-Laskowicach',
          url: 'https://zsjelcz.pl/',
        },
        {
          label: 'Regulamin konkursu "Kreator" PDF',
          url: 'https://zsjelcz.pl/upload/pliki/regulamin-2026-7a9af283.pdf',
        },
      ],
    },
    footer: {
      text: '© 2026 Bespalova Solomiia — Strona została wykonana na potrzeby konkursu "Kreator"',
      textCopyright: '© Wszelkie prawa zastrzeżone',
    },
  },
};

window.contentData = contentData;