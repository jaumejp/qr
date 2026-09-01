/* =========================================================
   CONFIGURACIÓ — EDITA NOMÉS AQUEST FITXER
   =========================================================
   TOT el contingut de la sorpresa és aquí dins.
   No cal que toquis games.js ni app.js.
   Busca els comentaris [EDITA AQUÍ].
   ========================================================= */

const CONFIG = {

  /* ---- 1. PORTADA I NOMS --------------------------------- */
  coverTitle:  'Per tu',                // [EDITA AQUÍ] títol del sobre tancat
  names:       'Natàlia & Jaume',         // [EDITA AQUÍ] els vostres noms
  introLead:   'abans de començar…',      // frase petita sobre el carrusel
  startButton: 'Començar!',         // text del botó sota el carrusel

  /* ---- 2. PANTALLA DE LA CANÇÓ (surt la primera) --------- */
  // La cançó és el primer que veu: l'ha d'engegar abans de continuar.
  // Un cop sona, segueix sonant per sota tota l'estona.
  musicLead:   "Abans de res… Posarem ambient amb Lana del Rey",
  musicButton: 'Començem!',

  /* ---- 3. FOTOS DEL CARRUSEL ----------------------------- */
  // Posa les fotos a la carpeta /photos amb aquests noms
  // (o canvia els noms aquí). Mentre no existeixin, es veu un avís.
  photos: ['foto1.jpg', 'foto2.jpg', 'foto3.jpg', 'foto4.jpg', 'foto5.jpg'],

  /* ---- 4. COMPTADOR DE DIES ------------------------------ */
  startDate:    '2026-01-06',             // [EDITA AQUÍ] AAAA-MM-DD
  counterLabel: 'dies junts',             // text al costat del número

  /* ---- 5. EL CODI SECRET FINAL --------------------------- */
  // Cada nivell entrega UN caràcter (camp "letter"). En acabar els 8
  // nivells, ella haurà d'ORDENAR-los per formar aquesta paraula.
  // -> L'apòstrof i els espais es dibuixen sols com a separadors: NO
  //    fan falta nivells per a ells. El "!" SÍ que és una peça (un nivell).
  //    Els caràcters de "secretCode" (sense apòstrof/espais) han de coincidir
  //    amb els 8 "letter" dels nivells (l'ordre és igual).
  secretCode: "T'ESTIMO!",
  secretHint: 'el que et vull dir… i ben fort',

  /* ---- 6. ELS 8 NIVELLS ---------------------------------- */
  // Camps comuns: title, intro, letter (la peça), fragment (tros de carta).
  levels: [

    /* -------- NIVELL 1 · PUZZLE DE FOTO -------- */
    {
      type: 'puzzle',
      title: 'El record trencat',
      intro: 'Recompon la foto. Toca dues peces per intercanviar-les.',
      photo: 'foto1.jpg',       // [EDITA AQUÍ]
      size: 3,
      letter: 'S',
      fragment: "Primer vam ser coneguts/amics, i ja de llavors eres la persona amb qui tot era més fàcil. Només faltava un petit impuls perquè tot començes a rodar...",
    },

    /* -------- NIVELL 2 · MEMORY / PARELLES -------- */
    {
      type: 'memory',
      title: 'Troba les parelles',
      intro: 'Gira les cartes i troba les parelles.',
      cards: ['🌙', '☕', '🎬', '🌊', '🎶', '🐾'],  // [EDITA AQUÍ] 6 símbols
      letter: 'T',
      fragment: "El sis de gener, ens vam donar permís per començar a escriure la nostre història, i de cop tot es va tornar especial.",
    },

    /* -------- NIVELL 3 · SOPA DE LLETRES -------- */
    {
      type: 'wordsearch',
      title: 'Paraules amagades',
      intro: 'Troba les paraules. Arrossega el dit per sobre de les lletres.',
      words: ['ESTIMAR', 'ABRAÇADA', 'SEMPRE', 'GUAPA', 'OBSERVADORA', 'INTELIGENT', 'DOLÇA', 'AMIGA'],   // [EDITA AQUÍ] MAJÚSCULES, sense espais
      size: 11,
      letter: 'I',
      fragment: "M'agrada la passió, les ganes i el detall que poses en tot el que fas, també en la feina. Ets una inspiració! ❤️",
    },

    /* -------- NIVELL 4 · RELACIONA (sinònims + traducció) -------- */
    // Joc nou: dues columnes. Toca una paraula i el seu parell.
    {
      type: 'relaciona',
      title: 'Relaciona-ho',
      intro: 'Toca una paraula i després el seu parell.',
      rounds: [   // [EDITA AQUÍ] cada ronda: un títol i les seves parelles
        {
          title: 'Cada paraula amb el seu sinònim',
          pairs: [
            ['eixut', 'eixorc'],
            ['ubiqüitat', 'omnipresència'],
            ['pusillànime', 'arronsat'],
            ['inefable', 'indescriptable'],
            ['vesànic', 'dement'],
          ],
        },
        {
          title: 'Del castellà al català',
          pairs: [
            ['desahuciar', 'desnonar'],
            ['bellota', 'aglà'],
            ['bisagra', 'frontissa'],
            ['canapé', 'sofà llit'],
            ['xerigot', 'suero'],
          ],
        },
      ],
      letter: 'M',
      fragment: "M'agrada com penses, com esculls les paraules per expressar-te i com saps dir el que sents.",
    },

    /* -------- NIVELL 5 · PRONOMINALITZACIÓ -------- */
    // Tria la forma correcta. "correct" = índex de l'opció bona.
    // "explain" (opcional) es mostra en encertar.
    {
      type: 'quiz',
      title: 'Pronominalitza',
      intro: 'Substitueix els complements pels pronoms correctes.',
      questions: [   // [EDITA AQUÍ]
        {
          question: '«No vulguis dir la veritat als testimonis.»',
          options: ["No la hi vulguis dir", "No la els vulguis dir", "No els la vulguis dir"],
          correct: 2,
          explain: "la veritat (CD determinat) → la; als testimonis (CI plural) → els. L'ordre de combinació és CI + CD: els + la = els la.",
        },
        {
          question: '«Porteu aigua als excursionistes!»',
          options: ["Porteu-los-en!", "Porteu-les-hi!", "Porteu-n'hi!"],
          correct: 0,
          explain: "aigua (CD indeterminat) → en; als excursionistes (CI plural) → els. Al darrere del verb: els + en = -los-en.",
        },
        {
          question: '«Posa sal a la sopa.»',
          options: ["Posa-l'hi", "Posa-n'hi", "Posa-li'n"],
          correct: 1,
          explain: "sal (CD indeterminat) → en; a la sopa (CCL) → hi. en + hi = n'hi (al darrere del verb d'imperatiu: posa-n'hi).",
        },
        {
          question: '«Anem a la platja a prendre el sol.»',
          options: ["Anem-hi", "Anem-n'hi", "Anem-ne"],
          correct: 0,
          explain: "a la platja (CCL introduït per 'a') → hi. No es pronominalitza el complement de finalitat en aquesta combinació simple.",
        },
        {
          question: '«Vaig donar les gràcies als professors.»',
          options: ["Les hi vaig donar", "Els les vaig donar", "Li les vaig donar"],
          correct: 1,
          explain: "les gràcies (CD determinat plural) → les; als professors (CI plural) → els. Combinació: els + les = els les.",
        },
      ],
      letter: 'O',
      fragment: "M'agraden els plans tranquils amb tu tant com els grans; potser fins i tot més. Simplement necessito la teva presència i el teu carinyo, tal com ja fas.",
    },

    /* -------- NIVELL 6 · FRANCÈS -------- */
    // Joc nou: sona la frase en francès (veu del mòbil) i ella la reprodueix.
    //   mode 'type'  → l'escriu al teclat (per a frases fàcils)
    //   mode 'words' → ordena les paraules, estil Duolingo (per a frases llargues)
    //   ca = què vol dir · fr = la frase francesa (el que ha de fer)
    {
      type: 'french',
      title: 'Escolta el francès',
      intro: 'Sona una frase en francès. Escriu-la o ordena-la.',
      rounds: [   // [EDITA AQUÍ]
        { ca: 'Gràcies',                          fr: 'Merci',                       mode: 'type'  },
        { ca: 'Em dic Natàlia',                   fr: "Je m'appelle Natàlia",        mode: 'type'  },
        { ca: 'La meva germana viu a Milà',       fr: 'Ma sœur habite à Milan',      mode: 'words' },
        { ca: 'El meu tiet és divertit',          fr: 'Mon oncle est amusant',       mode: 'words' },
      ],
      letter: 'E',
      fragment: "Jo faig la meva ruta d'escacs i tu la de francès, però sort que la llengua que ens uneix és una tan maca com és el català. M'agrada poder-nos comunicar en la nostra llengua materna, però si n'hagués d'aprendre una de nova només per fer-te riure, també ho faria. ♟️🇫🇷❤️.",
    },

    /* -------- NIVELL 7 · ENDEVINA AMB EMOJIS -------- */
    {
      type: 'emoji',
      title: 'Vull viure-ho tot amb tu. Començaríem per...',
      intro: "Què amaga cada línia d'emojis?",
      rounds: [   // [EDITA AQUÍ]
        { emojis: '🎬🍿🛋️',  answer: 'Nit de pel·li',        options: ['Nit de pel·li', 'Cine mut', 'Crispetes fredes'] },
        { emojis: '✈️🌴🍹',  answer: 'Descobrir nous indrets', options: ['Un dilluns qualsevol', 'Descobrir nous indrets', 'La llista de la compra'] },
        { emojis: '🌧️☕🎶',  answer: 'Diumenge a casa',      options: ['Diumenge a casa', 'Un examen', 'El gimnàs'] },
      ],
      letter: 'T',
      fragment: "Cada moment al teu costat és increïble. Saber que són efímers fa que els gaudeixi encara més, que els visqui més intensament i que estigui més present en cadascun d'ells.",
    },

    /* -------- NIVELL 8 · QUIZ DE VOSALTRES -------- */
    {
      type: 'quiz',
      title: 'Quant te’n recordes?',
      intro: 'Última prova. Demostra que te’n recordes de tot.',
      questions: [   // [EDITA AQUÍ] posa-hi coses vostres reals
        { 
          question: 'On ens vam veure per primer cop?', 
          options: ['Banyoles', 'Palafrugell', 'Girona', 'Palamós'], 
          correct: 1 
        },
        { 
          question: 'Quina va ser la nostra primera sèrie junts?', 
          options: ['Big Bang Theory', 'El cuento de la criada', 'From', 'Breaking Bad'], 
          correct: 1 
        },
        { 
          question: 'Quina va ser la nostra primera peli junts?', 
          options: ['Project Hail Mary', 'The housemaid', 'Avatar', 'Rocky 2'], 
          correct: 2 
        },
        { 
          question: 'Quin va ser el primer plat que vam menjar junts a un restaurant?', 
          options: ['Tempura de verdures', 'Niguiri de salmó', 'Yakisoba de llangostí', 'Yakisoba de verdures'], 
          correct: 2 
        },
        { 
          question: 'En quin lloc i context vaig pujar per primer cop al teu cotxe? Va ser gràcies a... Recordem la història que no la recordo...', 
          options: ["L'Anna", "La Omayma", "A en Marc", "A l'Àlex"], 
          correc
        }
      ],
      letter: '!',
      fragment: "Ja ho tens gairebé tot. Només et queda ordenar les lletres per llegir el que et vull dir.",
    },

  ],

  /* ---- 7. RETROSPECTIVA (es veu al final) ---------------- */
  milestones: [   // [EDITA AQUÍ]
    { date: '6 de gener de 2026', title: 'Alguna cosa va canviar' },
    { date: 'Aquell hivern',      title: 'La primera vegada que ho vaig saber' },
    { date: 'Avui',               title: 'I només acabem de començar' },
  ],

  /* ---- 8. SIGNATURA DE LA CARTA -------------------------- */
  signature: '— Jaume',

  /* ---- 9. CANÇÓ ------------------------------------------ */
  // Enllaç d'Spotify (recomanat). Es fa servir a la pantalla del principi.
  songLink: 'https://open.spotify.com/track/1fzAuUVbzlhZ1lJAx9PtY6',

  /* ---- 10. EL PLA REAL ----------------------------------- */
  finaleLead: "i això no s'acaba aquí",
  finalePlan: 'Avui a les 20:00h, al nostre lloc de sempre.',
  plan: {
    title:        'El nostre pla',
    description:  'Una sorpresa que he preparat per a tu.',
    location:     'El nostre lloc de sempre',
    start:        '2026-09-01T20:00:00',
    durationHours: 2,
  },

  /* ---- 11. AJUSTOS --------------------------------------- */
  saveProgress: true,   // guarda l'avanç: si tanca la web, continua on anava
  allowHint:    true,   // botó "t'ajudo?" perquè no s'encalli mai
  sound:        true,   // sons suaus en encertar
};
