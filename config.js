/* =========================================================
   CONFIGURACIÓ — EDITA NOMÉS AQUEST FITXER
   =========================================================
   TOT el contingut de la sorpresa és aquí dins.
   No cal que toquis games.js ni app.js.
   Busca els comentaris [EDITA AQUÍ].
   ========================================================= */

const CONFIG = {

  /* ---- 1. PORTADA I NOMS --------------------------------- */
  coverTitle:  'Per a tu',                // [EDITA AQUÍ] títol del sobre tancat
  names:       'Nom & Nom',               // [EDITA AQUÍ] els vostres noms
  introLead:   'abans de començar…',      // frase petita sobre el carrusel
  startButton: 'Començar el joc',         // text del botó sota el carrusel

  /* ---- 2. FOTOS DEL CARRUSEL ----------------------------- */
  // Posa les fotos a la carpeta /photos amb aquests noms
  // (o canvia els noms aquí). Mentre no existeixin, es veu un avís.
  photos: ['foto1.jpg', 'foto2.jpg', 'foto3.jpg', 'foto4.jpg', 'foto5.jpg'],

  /* ---- 3. COMPTADOR DE DIES ------------------------------ */
  startDate: '2023-01-01',                // [EDITA AQUÍ] AAAA-MM-DD, dia que vau començar

  /* ---- 4. EL CODI SECRET FINAL --------------------------- */
  // Cada nivell entrega UNA lletra (més avall, camp "letter").
  // En acabar els 5 nivells, ella haurà d'ORDENAR aquestes lletres
  // per formar aquesta paraula i desbloquejar el final.
  // -> Les lletres de "secretCode" han de ser les mateixes que les dels
  //    5 nivells (l'ordre és igual). Els espais s'ignoren en comprovar-ho.
  secretCode: 'ETS TU',
  secretHint: 'dues paraules… qui ho és tot per a mi',

  /* ---- 5. ELS 5 NIVELLS ---------------------------------- */
  // L'ordre aquí = l'ordre en què es desbloquegen.
  // Camps comuns a tots:
  //   title    → nom del nivell (es veu al camí)
  //   intro    → instrucció curta del minijoc
  //   letter   → la pista (UNA lletra) que entrega en superar-lo
  //   fragment → el tros de carta que revela com a premi
  levels: [

    /* ---------- NIVELL 1 · PUZZLE DE FOTO ---------- */
    {
      type: 'puzzle',
      title: 'El record trencat',
      intro: 'Recompon la foto. Toca dues peces per intercanviar-les.',
      photo: 'foto1.jpg',       // [EDITA AQUÍ] foto que es recompon
      size: 3,                  // 3 = puzzle de 3x3 (9 peces)
      letter: 'E',
      fragment: "Des del dia que vas aparèixer, fins i tot el més normal va començar a semblar-me una mica extraordinari.",
    },

    /* ---------- NIVELL 2 · SOPA DE LLETRES ---------- */
    {
      type: 'wordsearch',
      title: 'Paraules amagades',
      intro: 'Troba les paraules. Arrossega el dit per sobre de les lletres.',
      words: ['NOSALTRES', 'SEMPRE', 'JUNTS'],   // [EDITA AQUÍ] MAJÚSCULES, sense espais
      size: 11,                 // mida de la quadrícula (11x11)
      letter: 'T',
      fragment: "M'agrada fins i tot l'avorriment, si és amb tu. Sobretot l'avorriment, de fet.",
    },

    /* ---------- NIVELL 3 · MEMORY / PARELLES ---------- */
    {
      type: 'memory',
      title: 'Troba les parelles',
      intro: 'Gira les cartes i troba les parelles.',
      cards: ['🌙', '☕', '🎬', '🌊', '🎶', '🐾'],  // [EDITA AQUÍ] 6 símbols = 6 parelles
      letter: 'S',
      fragment: "Cadascun d'aquests detalls em porta a un moment amb tu. I me'n queden molts per viure.",
    },

    /* ---------- NIVELL 4 · ENDEVINA AMB EMOJIS ---------- */
    {
      type: 'emoji',
      title: 'Digues-ho amb emojis',
      intro: "Què amaga cada línia d'emojis?",
      rounds: [   // [EDITA AQUÍ] cada ronda: els emojis, la resposta i les 3 opcions
        { emojis: '🎬🍿🛋️', answer: 'Nit de pel·li',        options: ['Nit de pel·li', 'Cine mut', 'Crispetes fredes'] },
        { emojis: '✈️🌴🍹',  answer: 'Les nostres vacances', options: ['Un dilluns qualsevol', 'Les nostres vacances', 'La llista de la compra'] },
        { emojis: '🌧️☕🎶',  answer: 'Diumenge a casa',      options: ['Diumenge a casa', 'Un examen', 'El gimnàs'] },
      ],
      letter: 'T',
      fragment: "No necessito plans espectaculars. Una pel·li, un cafè i tu, i ja soc al meu lloc preferit.",
    },

    /* ---------- NIVELL 5 · QUIZ ---------- */
    {
      type: 'quiz',
      title: "Quant te'n recordes?",
      intro: "Última prova. Demostra'm que te'n recordes de tot.",
      questions: [   // "correct" = índex (0, 1, 2…) de l'opció correcta
        { question: 'En quin mes ens vam conèixer?',     options: ['Març', 'Juliol', 'Desembre'], correct: 0 },
        { question: 'On va ser el nostre primer viatge?', options: ['La platja', 'La muntanya', 'Una altra ciutat'], correct: 2 },
        { question: 'Què demanem sempre per sopar?',      options: ['Pizza', 'Sushi', 'Tacos'], correct: 1 },
      ],
      letter: 'U',
      fragment: "T'ho has guanyat. Ja ho saps tot de nosaltres… menys el que ve ara.",
    },

  ],

  /* ---- 6. RETROSPECTIVA (es veu al final) ---------------- */
  milestones: [
    { date: 'Març 2021',  title: 'Ens vam conèixer' },
    { date: 'Juny 2021',  title: 'La nostra primera cita' },
    { date: 'Agost 2022', title: 'El primer viatge junts' },
    { date: 'Avui',       title: 'Seguim escrivint aquesta història' },
  ],

  /* ---- 7. SIGNATURA DE LA CARTA -------------------------- */
  signature: '— El teu nom',

  /* ---- 8. CANÇÓ ------------------------------------------ */
  // Enllaç d'Spotify (recomanat) o de YouTube; o deixa'l en '' (buit)
  // i posa el fitxer a audio/cancion.mp3.
  songLink: 'https://open.spotify.com/track/1fzAuUVbzlhZ1lJAx9PtY6',

  /* ---- 9. EL PLA REAL ------------------------------------ */
  finaleLead: "i això no s'acaba aquí",
  finalePlan: 'Avui a les 20:00h, al nostre lloc de sempre.',
  plan: {
    title:        'El nostre pla',
    description:  'Una sorpresa que he preparat per a tu.',
    location:     'El nostre lloc de sempre',   // s'utilitza també per a "Com arribar-hi"
    start:        '2026-09-01T20:00:00',         // AAAA-MM-DDTHH:MM:SS (hora local)
    durationHours: 2,
  },

  /* ---- 10. AJUSTOS --------------------------------------- */
  saveProgress: true,   // guarda l'avanç: si tanca la web, pot continuar on anava
  allowHint:    true,   // mostra un botó "t'ajudo?" perquè no s'encalli mai
  sound:        true,   // sons suaus en encertar (sense fitxers, es generen sols)
};
