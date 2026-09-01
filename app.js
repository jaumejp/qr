/* =========================================================
   APP — flujo de la sorpresa  (no hace falta editar este archivo)
   =========================================================
   Orquesta: portada -> carrusel -> sendero de niveles ->
   recompensas -> código secreto -> final.
   ========================================================= */

const App = (function(){
  'use strict';

  const $  = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));
  const levels = CONFIG.levels;

  /* ---------- estado persistente ---------- */
  const KEY = 'sorpresa_progress_v1';
  let state = { done: levels.map(() => false), unlocked: false };

  function load(){
    if(!CONFIG.saveProgress) return;
    try{
      const s = JSON.parse(localStorage.getItem(KEY));
      if(s && Array.isArray(s.done) && s.done.length === levels.length) state = s;
    }catch(e){ /* sin guardado */ }
  }
  function save(){
    if(!CONFIG.saveProgress) return;
    try{ localStorage.setItem(KEY, JSON.stringify(state)); }catch(e){}
  }

  /* ---------- sonido (WebAudio, sin archivos) ---------- */
  let audioCtx = null;
  let muted = !CONFIG.sound;

  function ding(){
    if(navigator.vibrate) { try{ navigator.vibrate(18); }catch(e){} }
    if(muted) return;
    try{
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(660, audioCtx.currentTime);
      o.frequency.exponentialRampToValueAtTime(1320, audioCtx.currentTime + 0.14);
      g.gain.setValueAtTime(0.0001, audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.07, audioCtx.currentTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.30);
      o.connect(g); g.connect(audioCtx.destination);
      o.start();
      o.stop(audioCtx.currentTime + 0.32);
    }catch(e){}
  }

  /* ---------- pétalos ---------- */
  const petalsLayer = $('#petals');
  function spawnPetals(count){
    count = count || 26;
    for(let i = 0; i < count; i++){
      const petal = document.createElement('div');
      petal.className = 'petal';
      const size = 8 + Math.random() * 8;
      petal.style.left = (Math.random() * 100) + 'vw';
      petal.style.width = size + 'px';
      petal.style.height = (size * 1.2) + 'px';
      petal.style.animationDelay = (Math.random() * 500) + 'ms';
      const dur = 3000 + Math.random() * 1600;
      petal.style.animationDuration = dur + 'ms';
      petal.style.setProperty('--drift', ((Math.random() - 0.5) * 140) + 'px');
      petal.style.setProperty('--spin', (280 + Math.random() * 420) + 'deg');
      petalsLayer.appendChild(petal);
      setTimeout(() => petal.remove(), dur + 900);
    }
  }

  /* ---------- navegación entre pantallas ---------- */
  function show(id){ $('#' + id).classList.add('is-shown'); }
  function hide(id){ $('#' + id).classList.remove('is-shown'); }

  /* =========================================================
     1) PORTADA — sello que se abre
     ========================================================= */
  function initCover(){
    const seal  = $('#seal');
    const cover = $('#cover');
    $('.cover-title').textContent = CONFIG.coverTitle;

    seal.addEventListener('click', () => {
      seal.classList.add('is-cracking');
      seal.disabled = true;
      spawnPetals(26);
      setTimeout(() => {
        cover.classList.add('is-open');
        $('#sound-toggle').classList.add('is-shown');
        // restaura la pantalla correcta según el avance guardado
        if(state.unlocked)               enterFinale(false);
        else                             show('intro');
      }, 380);
    });
  }

  /* =========================================================
     2) INTRO — nombres + carrusel + botón de empezar
     ========================================================= */
  function initIntro(){
    $('#names').innerHTML = CONFIG.names;
    $('#intro-lead').textContent = CONFIG.introLead;
    $('#start-game').textContent = CONFIG.startButton;

    buildCarousel();

    $('#start-game').addEventListener('click', () => {
      hide('intro');
      show('trail-screen');
      renderTrail();
    });
  }

  function imgError(img){
    const ph = document.createElement('div');
    ph.className = 'img-placeholder';
    ph.innerHTML = '<span class="heart">♡</span><span>Posa aquí la teva foto:<br><strong>photos/' +
                   img.dataset.name + '</strong></span>';
    img.replaceWith(ph);
  }

  function buildCarousel(){
    const track = $('#track');
    const dotsWrap = $('#dots');
    CONFIG.photos.forEach(name => {
      const slide = document.createElement('div');
      slide.className = 'slide';
      const img = document.createElement('img');
      img.src = 'photos/' + name;
      img.alt = 'Nosotros';
      img.dataset.name = name;
      img.addEventListener('error', () => imgError(img));
      slide.appendChild(img);
      track.appendChild(slide);
    });

    const slides = Array.from(track.children);
    let current = 0;

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'dot';
      dot.setAttribute('aria-label', 'Anar a la foto ' + (i + 1));
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.children);

    function goTo(i){
      current = (i + slides.length) % slides.length;
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      dots.forEach((d, k) => d.classList.toggle('is-active', k === current));
    }
    $('#prev').addEventListener('click', () => goTo(current - 1));
    $('#next').addEventListener('click', () => goTo(current + 1));
    goTo(0);

    // swipe táctil
    let startX = null;
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      if(startX === null) return;
      const diff = e.changedTouches[0].clientX - startX;
      if(Math.abs(diff) > 40) diff < 0 ? goTo(current + 1) : goTo(current - 1);
      startX = null;
    });

    // autoplay que se detiene al interactuar
    const auto = setInterval(() => goTo(current + 1), 4500);
    ['click', 'touchstart'].forEach(ev =>
      $('#carousel').addEventListener(ev, () => clearInterval(auto), { once: true }));
  }

  /* =========================================================
     3) SENDERO — el hub de niveles
     ========================================================= */
  function firstPending(){
    const i = state.done.findIndex(d => !d);
    return i;   // -1 si están todos hechos
  }

  function renderTrail(){
    // bandeja de letras conseguidas
    const tray = $('#letters-tray');
    tray.innerHTML = '';
    levels.forEach((lv, i) => {
      const slot = document.createElement('div');
      slot.className = 'letter-slot' + (state.done[i] ? ' is-filled' : '');
      slot.textContent = state.done[i] ? lv.letter : '?';
      tray.appendChild(slot);
    });

    const doneCount = state.done.filter(Boolean).length;
    $('#progress-label').textContent = doneCount + ' / ' + levels.length + ' pistes';

    // nodos del sendero
    const trail = $('#trail');
    trail.innerHTML = '';
    const current = firstPending();

    levels.forEach((lv, i) => {
      const isDone = state.done[i];
      const isCurrent = i === current;
      const li = document.createElement('li');
      li.className = 'trail-node' +
        (isDone ? ' is-done' : '') +
        (isCurrent ? ' is-current' : '') +
        (!isDone && !isCurrent ? ' is-locked' : '');

      const badge =
        isDone    ? '<span class="node-check">✓</span>' :
        isCurrent ? '<span class="node-num">' + (i + 1) + '</span>' :
                    '<span class="node-lock">🔒</span>';

      li.innerHTML =
        '<button class="node-dot" ' + ((isDone || isCurrent) ? '' : 'disabled') + '>' + badge + '</button>' +
        '<div class="node-info">' +
          '<span class="node-title">' + (isDone || isCurrent ? lv.title : '· · ·') + '</span>' +
          (isDone ? '<span class="node-letter">pista: ' + lv.letter + '</span>' : '') +
        '</div>';

      if(isCurrent){
        li.querySelector('.node-dot').addEventListener('click', () => openLevel(i));
      }
      trail.appendChild(li);
    });

    // si están todos los niveles, ofrece el código secreto
    const openSecretBtn = $('#open-secret');
    if(current === -1 && !state.unlocked){
      openSecretBtn.hidden = false;
      $('#trail-lead').textContent = 'Ja tens les 5 pistes! Desxifra el codi.';
    } else {
      openSecretBtn.hidden = true;
      $('#trail-lead').textContent = 'La teva missió: reuneix les 5 pistes.';
    }
  }

  /* =========================================================
     4) NIVEL — abre el minijuego en un panel
     ========================================================= */
  let activeGame = null;

  function openLevel(i){
    const lv = levels[i];
    $('#game-title').textContent = lv.title;
    $('#game-intro').textContent = lv.intro;
    const stage = $('#game-stage');
    stage.innerHTML = '';
    stage.scrollTop = 0;

    const hintBtn = $('#game-hint');
    hintBtn.hidden = !CONFIG.allowHint;

    show('game-panel');

    // arranca el juego correspondiente
    activeGame = Games[lv.type](stage, lv, () => reward(i));

    hintBtn.onclick = () => { if(activeGame && activeGame.hint) activeGame.hint(); };
    $('#game-close').onclick = () => closeGame();
  }

  function closeGame(){
    if(activeGame && activeGame.cleanup) activeGame.cleanup();
    activeGame = null;
    hide('game-panel');
  }

  /* =========================================================
     5) RECOMPENSA — letra-pista + trozo de carta
     ========================================================= */
  function reward(i){
    const lv = levels[i];
    if(activeGame && activeGame.cleanup) activeGame.cleanup();
    activeGame = null;

    $('#reward-letter').textContent = lv.letter;
    $('#reward-fragment').textContent = lv.fragment;
    hide('game-panel');
    show('reward');
    spawnPetals(16);

    $('#reward-continue').onclick = () => {
      hide('reward');
      state.done[i] = true;
      save();
      renderTrail();
      // si acaba de completar el último, abre el código directamente
      if(firstPending() === -1 && !state.unlocked){
        setTimeout(openSecret, 500);
      }
    };
  }

  /* =========================================================
     6) CÓDIGO SECRETO — ordenar las letras
     ========================================================= */
  function openSecret(){
    const target = CONFIG.secretCode.replace(/\s/g, '').toUpperCase();
    const slotsN = target.length;
    const letters = shuffle(levels.map(l => l.letter.toUpperCase()));

    $('#secret-hint').textContent = CONFIG.secretHint;
    const feedback = $('#secret-feedback');
    feedback.textContent = '';

    const slotsEl = $('#secret-slots');
    const tilesEl = $('#secret-tiles');
    slotsEl.innerHTML = '';
    tilesEl.innerHTML = '';

    const filled = new Array(slotsN).fill(null);   // {letter, tileEl} por hueco

    // huecos
    const slotEls = [];
    for(let s = 0; s < slotsN; s++){
      const slot = document.createElement('button');
      slot.className = 'secret-slot';
      slot.addEventListener('click', () => removeFromSlot(s));
      slotsEl.appendChild(slot);
      slotEls.push(slot);
    }

    // fichas
    const tileEls = [];
    letters.forEach(ch => {
      const t = document.createElement('button');
      t.className = 'secret-tile';
      t.textContent = ch;
      t.addEventListener('click', () => placeTile(t, ch));
      tilesEl.appendChild(t);
      tileEls.push(t);
    });

    function placeTile(tile, ch){
      if(tile.classList.contains('is-used')) return;
      const s = filled.findIndex(x => x === null);
      if(s === -1) return;
      filled[s] = { letter: ch, tile };
      tile.classList.add('is-used');
      slotEls[s].textContent = ch;
      slotEls[s].classList.add('is-filled');
      checkCode();
    }
    function removeFromSlot(s){
      if(!filled[s]) return;
      filled[s].tile.classList.remove('is-used');
      filled[s] = null;
      slotEls[s].textContent = '';
      slotEls[s].classList.remove('is-filled');
      feedback.textContent = '';
    }
    function checkCode(){
      if(filled.some(x => x === null)) return;
      const guess = filled.map(x => x.letter).join('');
      if(guess === target){
        ding();
        feedback.textContent = '';
        slotEls.forEach(el => el.classList.add('is-correct'));
        setTimeout(() => enterFinale(true), 900);
      } else {
        feedback.textContent = 'Mmm… no és aquest. Prova un altre ordre.';
        slotsEl.classList.add('shake');
        setTimeout(() => {
          slotsEl.classList.remove('shake');
          for(let s = 0; s < slotsN; s++) removeFromSlot(s);
        }, 600);
      }
    }

    show('secret-gate');
  }

  /* =========================================================
     7) FINAL — retrospectiva + carta completa + canción + plan
     ========================================================= */
  let finaleBuilt = false;

  function enterFinale(celebrate){
    state.unlocked = true;
    save();
    hide('secret-gate');
    hide('trail-screen');
    if(!finaleBuilt){ buildFinale(); finaleBuilt = true; }
    show('finale');
    window.scrollTo(0, 0);
    if(celebrate) spawnPetals(40);
  }

  function buildFinale(){
    // retrospectiva
    const tl = $('#timeline');
    CONFIG.milestones.forEach(m => {
      const li = document.createElement('li');
      li.className = 'timeline-item';
      li.innerHTML = '<span class="timeline-date">' + m.date + '</span>' +
                     '<p class="timeline-title">' + m.title + '</p>';
      tl.appendChild(li);
    });

    // carta completa = todos los trozos + firma
    const letter = $('#final-letter');
    levels.forEach(lv => {
      const p = document.createElement('p');
      p.textContent = lv.fragment;
      letter.appendChild(p);
    });
    const sign = document.createElement('p');
    sign.className = 'signature';
    sign.textContent = CONFIG.signature;
    letter.appendChild(sign);

    buildSong();

    // contador de días
    const daysEl = $('#days');
    const start = new Date(CONFIG.startDate + 'T00:00:00');
    const diff = Math.max(0, Math.floor((Date.now() - start) / 86400000));
    daysEl.textContent = diff.toLocaleString('ca-ES');

    // el plan
    $('#finale-lead').textContent = CONFIG.finaleLead;
    $('#finale-plan').textContent = CONFIG.finalePlan;
    $('#open-map').href = 'https://www.google.com/maps/search/?api=1&query=' +
                          encodeURIComponent(CONFIG.plan.location);
    $('#add-calendar').addEventListener('click', downloadIcs);
  }

  function buildSong(){
    const section = $('#song-section');
    const audio = $('#song');
    const link = CONFIG.songLink || '';
    const spotify = link.match(/track\/([a-zA-Z0-9]+)/);

    if(spotify){
      section.innerHTML =
        '<p class="section-lead">la nostra cançó</p>' +
        '<iframe class="song-embed" src="https://open.spotify.com/embed/track/' + spotify[1] +
        '?utm_source=generator&theme=0" width="100%" height="152" frameborder="0" ' +
        'allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" ' +
        'loading="lazy" title="Reproductor d\'Spotify"></iframe>';
    } else if(link){
      section.innerHTML =
        '<p class="section-lead">la nostra cançó</p>' +
        '<a class="song-link" href="' + link + '" target="_blank" rel="noopener">Escoltar la nostra cançó</a>';
    } else if(audio){
      audio.addEventListener('error', () => {
        audio.outerHTML = '<p class="game-feedback">Afegeix la teva cançó a <strong>audio/cancion.mp3</strong>, ' +
                          'o posa songLink a config.js.</p>';
      });
    }
  }

  function downloadIcs(){
    const p = CONFIG.plan;
    const start = new Date(p.start);
    const end = new Date(start.getTime() + p.durationHours * 3600000);
    const fmt = d => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'BEGIN:VEVENT',
      'SUMMARY:' + p.title,
      'DESCRIPTION:' + p.description,
      'LOCATION:' + p.location,
      'DTSTART:' + fmt(start),
      'DTEND:' + fmt(end),
      'END:VEVENT', 'END:VCALENDAR',
    ].join('\r\n');
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    const a = document.createElement('a');
    a.href = url; a.download = 'sorpresa.ics'; a.click();
    URL.revokeObjectURL(url);
  }

  /* =========================================================
     sonido: botón de silencio
     ========================================================= */
  function initSound(){
    const btn = $('#sound-toggle');
    function paint(){ btn.textContent = muted ? '🔇' : '🔊'; btn.setAttribute('aria-label', muted ? 'Activar sonido' : 'Silenciar'); }
    paint();
    btn.addEventListener('click', () => { muted = !muted; if(!muted) ding(); paint(); });
  }

  /* =========================================================
     arranque
     ========================================================= */
  function init(){
    // reset para pruebas:  añade ?reset a la URL, o llama a __reset() en la consola
    if(location.search.indexOf('reset') !== -1){ try{ localStorage.removeItem(KEY); }catch(e){} }
    window.__reset = () => { try{ localStorage.removeItem(KEY); }catch(e){} location.href = location.pathname; };

    load();
    initCover();
    initIntro();
    initSound();
    $('#open-secret').addEventListener('click', openSecret);
  }

  return { init, ding, spawnPetals };
})();

document.addEventListener('DOMContentLoaded', App.init);
