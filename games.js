/* =========================================================
   MOTOR DE MINIJUEGOS  (no hace falta editar este archivo)
   =========================================================
   Cada juego es una función:  Games.tipo(stage, level, onComplete)
     - stage      : el <div> donde se dibuja el juego
     - level      : el objeto del nivel definido en config.js
     - onComplete : llámalo cuando el juego se supera
   Devuelve un objeto con { hint(), cleanup() } (ambos opcionales).
   ========================================================= */

const Games = {};

/* ---- utilidades compartidas ---- */
function shuffle(a){
  for(let i = a.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
// mayúsculas, sin acentos, solo A-Z (la Ñ se convierte en N)
function normalize(s){
  return s.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^A-Z]/g, '');
}


/* =========================================================
   NIVEL TIPO "puzzle" — recomponer una foto intercambiando piezas
   ========================================================= */
Games.puzzle = function(stage, level, onComplete){
  const N = level.size || 3;
  const total = N * N;
  const src = 'photos/' + level.photo;

  stage.innerHTML = '';
  const board = document.createElement('div');
  board.className = 'puzzle-board';
  board.style.setProperty('--n', N);
  stage.appendChild(board);

  // barajado que garantiza que NO empieza ya resuelto
  let order;
  do { order = shuffle([...Array(total).keys()]); } while(order.every((p, i) => p === i));
  let selected = -1;
  let done = false;
  let hasPhoto = false;

  const cells = [];
  for(let i = 0; i < total; i++){
    const cell = document.createElement('button');
    cell.className = 'puzzle-piece';
    cell.addEventListener('click', () => pick(i));
    board.appendChild(cell);
    cells.push(cell);
  }

  // intenta cargar la foto; si no existe, se juega con piezas numeradas
  const probe = new Image();
  probe.onload  = () => { hasPhoto = true;  render(); };
  probe.onerror = () => { hasPhoto = false; render(); };
  probe.src = src;

  function paint(cell, pieceId){
    const r = Math.floor(pieceId / N), c = pieceId % N;
    if(hasPhoto){
      cell.style.backgroundImage = `url('${src}')`;
      cell.style.backgroundSize  = `${N * 100}% ${N * 100}%`;
      cell.style.backgroundPosition = `${(c / (N - 1)) * 100}% ${(r / (N - 1)) * 100}%`;
      cell.classList.remove('is-numbered');
      cell.textContent = '';
    } else {
      cell.style.backgroundImage = 'none';
      cell.classList.add('is-numbered');
      cell.textContent = pieceId + 1;
    }
  }

  function render(){
    order.forEach((pieceId, idx) => {
      paint(cells[idx], pieceId);
      cells[idx].classList.toggle('is-selected', idx === selected);
    });
  }

  function pick(idx){
    if(done) return;
    if(selected === -1){ selected = idx; render(); return; }
    if(selected === idx){ selected = -1; render(); return; }
    [order[selected], order[idx]] = [order[idx], order[selected]];
    selected = -1;
    render();
    check();
  }

  function check(){
    if(!done && order.every((p, i) => p === i)){
      done = true;
      board.classList.add('is-solved');
      App.ding();
      setTimeout(onComplete, 650);
    }
  }

  render();

  return {
    hint(){                       // coloca en su sitio una pieza mal puesta
      for(let i = 0; i < total; i++){
        if(order[i] !== i){
          const j = order.indexOf(i);
          [order[i], order[j]] = [order[j], order[i]];
          break;
        }
      }
      selected = -1; render(); check();
    }
  };
};


/* =========================================================
   NIVEL TIPO "wordsearch" — sopa de letras
   ========================================================= */
Games.wordsearch = function(stage, level, onComplete){
  const N = level.size || 10;
  const words = level.words.map(normalize).filter(Boolean);
  const grid = Array.from({ length: N }, () => Array(N).fill(''));
  const solutions = {};                       // palabra -> ["r,c", ...]
  const DIRS = [[0, 1], [1, 0], [1, 1], [1, -1]];

  function fits(word, r, c, dr, dc){
    for(let k = 0; k < word.length; k++){
      const rr = r + dr * k, cc = c + dc * k;
      if(rr < 0 || cc < 0 || rr >= N || cc >= N) return false;
      if(grid[rr][cc] && grid[rr][cc] !== word[k]) return false;
    }
    return true;
  }
  function place(word){
    for(let t = 0; t < 400; t++){
      let [dr, dc] = DIRS[Math.floor(Math.random() * DIRS.length)];
      if(Math.random() < 0.5){ dr = -dr; dc = -dc; }   // permite palabras invertidas
      const r = Math.floor(Math.random() * N), c = Math.floor(Math.random() * N);
      if(fits(word, r, c, dr, dc)){
        const cells = [];
        for(let k = 0; k < word.length; k++){
          const rr = r + dr * k, cc = c + dc * k;
          grid[rr][cc] = word[k];
          cells.push(rr + ',' + cc);
        }
        solutions[word] = cells;
        return true;
      }
    }
    return false;
  }
  // coloca primero las largas; rellena huecos con letras al azar
  [...words].sort((a, b) => b.length - a.length).forEach(place);
  const POOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for(let r = 0; r < N; r++)
    for(let c = 0; c < N; c++)
      if(!grid[r][c]) grid[r][c] = POOL[Math.floor(Math.random() * POOL.length)];

  // --- render ---
  stage.innerHTML = '';
  const wrap  = document.createElement('div'); wrap.className = 'ws-wrap'; stage.appendChild(wrap);
  const boardEl = document.createElement('div'); boardEl.className = 'ws-grid'; boardEl.style.setProperty('--n', N); wrap.appendChild(boardEl);
  const cellEls = {};
  for(let r = 0; r < N; r++){
    for(let c = 0; c < N; c++){
      const d = document.createElement('div');
      d.className = 'ws-cell';
      d.textContent = grid[r][c];
      d.dataset.r = r; d.dataset.c = c;
      boardEl.appendChild(d);
      cellEls[r + ',' + c] = d;
    }
  }
  const listEl = document.createElement('div'); listEl.className = 'ws-words'; wrap.appendChild(listEl);
  const wordEls = {};
  words.forEach(w => {
    const s = document.createElement('span');
    s.className = 'ws-word';
    s.textContent = w;
    listEl.appendChild(s);
    wordEls[w] = s;
  });

  const found = new Set();
  let start = null, sel = [], done = false;

  function cellAt(x, y){
    const el = document.elementFromPoint(x, y);
    return (el && el.classList.contains('ws-cell')) ? el : null;
  }
  function lineCells(r0, c0, r1, c1){
    const dr = Math.sign(r1 - r0), dc = Math.sign(c1 - c0);
    const straight = (r0 === r1) || (c0 === c1) || (Math.abs(r1 - r0) === Math.abs(c1 - c0));
    if(!straight) return null;
    const len = Math.max(Math.abs(r1 - r0), Math.abs(c1 - c0));
    const cells = [];
    for(let k = 0; k <= len; k++) cells.push((r0 + dr * k) + ',' + (c0 + dc * k));
    return cells;
  }
  function highlight(cells){
    sel.forEach(k => cellEls[k] && cellEls[k].classList.remove('is-sel'));
    sel = cells || [];
    sel.forEach(k => cellEls[k] && cellEls[k].classList.add('is-sel'));
  }
  function readWord(cells){ return cells.map(k => cellEls[k].textContent).join(''); }

  function down(e){
    if(done) return;
    const el = cellAt(e.clientX, e.clientY);
    if(!el) return;
    start = [+el.dataset.r, +el.dataset.c];
    highlight([start.join(',')]);
    e.preventDefault();
  }
  function move(e){
    if(!start) return;
    const el = cellAt(e.clientX, e.clientY);
    if(!el) return;
    const cells = lineCells(start[0], start[1], +el.dataset.r, +el.dataset.c);
    if(cells) highlight(cells);
  }
  function up(){
    if(!start) return;
    if(sel.length >= 2){
      const str = readWord(sel);
      const rev = str.split('').reverse().join('');
      const hit = words.find(w => !found.has(w) && (w === str || w === rev));
      if(hit) mark(hit, sel);
    }
    highlight([]); start = null;
  }
  function mark(word, cells){
    found.add(word);
    cells.forEach(k => cellEls[k].classList.add('is-found'));
    wordEls[word].classList.add('is-found');
    App.ding();
    if(found.size === words.length && !done){ done = true; setTimeout(onComplete, 600); }
  }

  boardEl.addEventListener('pointerdown', down);
  boardEl.addEventListener('pointermove', move);
  window.addEventListener('pointerup', up);
  // evita que la página haga scroll mientras se arrastra sobre la sopa
  boardEl.addEventListener('touchmove', e => { if(start) e.preventDefault(); }, { passive: false });

  return {
    hint(){                       // revela una palabra que falte
      const w = words.find(x => !found.has(x));
      if(w) mark(w, solutions[w]);
    },
    cleanup(){ window.removeEventListener('pointerup', up); }
  };
};


/* =========================================================
   NIVEL TIPO "memory" — encontrar parejas
   ========================================================= */
Games.memory = function(stage, level, onComplete){
  const symbols = level.cards.slice();
  const deck = shuffle(symbols.concat(symbols));
  const cols = Math.min(4, Math.ceil(Math.sqrt(deck.length)));

  stage.innerHTML = '';
  const grid = document.createElement('div');
  grid.className = 'memory-grid';
  grid.style.setProperty('--cols', cols);
  stage.appendChild(grid);

  let first = null, lock = false, matched = 0, done = false;
  const cards = [];

  deck.forEach(sym => {
    const card = document.createElement('button');
    card.className = 'memory-card';
    card.dataset.sym = sym;
    card.innerHTML =
      '<span class="memory-inner">' +
        '<span class="memory-face memory-back">♡</span>' +
        '<span class="memory-face memory-front">' + sym + '</span>' +
      '</span>';
    card.addEventListener('click', () => flip(card));
    grid.appendChild(card);
    cards.push(card);
  });

  function flip(card){
    if(lock || done) return;
    if(card.classList.contains('is-up') || card.classList.contains('is-done')) return;
    card.classList.add('is-up');
    if(!first){ first = card; return; }

    if(first.dataset.sym === card.dataset.sym){
      first.classList.add('is-done');
      card.classList.add('is-done');
      first = null;
      matched++;
      App.ding();
      if(matched === symbols.length && !done){ done = true; setTimeout(onComplete, 600); }
    } else {
      lock = true;
      const a = first, b = card;
      first = null;
      setTimeout(() => {
        a.classList.remove('is-up');
        b.classList.remove('is-up');
        lock = false;
      }, 750);
    }
  }

  return {
    hint(){                       // resuelve una pareja pendiente
      const pending = cards.filter(c => !c.classList.contains('is-done'));
      if(!pending.length) return;
      pending.forEach(c => c.classList.remove('is-up'));
      first = null; lock = false;
      const sym = pending[0].dataset.sym;
      pending.filter(c => c.dataset.sym === sym).forEach(c => c.classList.add('is-up', 'is-done'));
      matched++;
      App.ding();
      if(matched === symbols.length && !done){ done = true; setTimeout(onComplete, 600); }
    }
  };
};


/* =========================================================
   NIVEL TIPO "emoji" — adivinar la frase (opción múltiple)
   ========================================================= */
Games.emoji = function(stage, level, onComplete){
  let idx = 0, done = false;

  stage.innerHTML = '';
  const wrap = document.createElement('div'); wrap.className = 'emoji-game'; stage.appendChild(wrap);
  const display = document.createElement('div'); display.className = 'emoji-display'; wrap.appendChild(display);
  const opts = document.createElement('div'); opts.className = 'options-col'; wrap.appendChild(opts);
  const fb = document.createElement('p'); fb.className = 'game-feedback'; wrap.appendChild(fb);
  const prog = document.createElement('p'); prog.className = 'round-progress'; wrap.appendChild(prog);

  function round(){
    const r = level.rounds[idx];
    display.textContent = r.emojis;
    prog.textContent = (idx + 1) + ' / ' + level.rounds.length;
    fb.textContent = '';
    opts.innerHTML = '';
    shuffle(r.options.slice()).forEach(opt => {
      const b = document.createElement('button');
      b.className = 'pill-option';
      b.textContent = opt;
      b.addEventListener('click', () => choose(b, opt, r));
      opts.appendChild(b);
    });
  }

  function choose(btn, opt, r){
    if(done) return;
    if(opt === r.answer){
      btn.classList.add('is-correct');
      [...opts.children].forEach(c => c.disabled = true);
      App.ding();
      idx++;
      if(idx >= level.rounds.length){ done = true; setTimeout(onComplete, 650); }
      else setTimeout(round, 650);
    } else {
      btn.classList.add('is-wrong');
      btn.disabled = true;
      fb.textContent = 'Gairebé… prova una altra.';
    }
  }

  round();

  return {
    hint(){                       // descarta las opciones incorrectas de la ronda actual
      const r = level.rounds[idx];
      [...opts.children].forEach(b => {
        if(b.textContent !== r.answer){ b.classList.add('is-wrong'); b.disabled = true; }
      });
    }
  };
};


/* =========================================================
   NIVEL TIPO "quiz" — preguntas (hay que acertarlas todas)
   ========================================================= */
Games.quiz = function(stage, level, onComplete){
  const total = level.questions.length;
  const solved = level.questions.map(() => false);
  let correct = 0, done = false;

  stage.innerHTML = '';
  const wrap = document.createElement('div'); wrap.className = 'quiz-game'; stage.appendChild(wrap);

  level.questions.forEach((q, qi) => {
    const block = document.createElement('div'); block.className = 'quiz-question';
    const prompt = document.createElement('p'); prompt.className = 'quiz-prompt'; prompt.textContent = q.question; block.appendChild(prompt);
    const ow = document.createElement('div'); ow.className = 'options-col';
    const fb = document.createElement('p'); fb.className = 'game-feedback';

    q.options.forEach((opt, oi) => {
      const b = document.createElement('button');
      b.className = 'pill-option';
      b.textContent = opt;
      b.addEventListener('click', () => {
        if(solved[qi] || done) return;
        if(oi === q.correct){
          b.classList.add('is-correct');
          ow.querySelectorAll('button').forEach(x => x.disabled = true);
          solved[qi] = true; correct++;
          fb.textContent = q.explain ? '✔ ' + q.explain : 'Exacte! 💛';
          App.ding();
          if(correct === total && !done){ done = true; setTimeout(onComplete, 700); }
        } else {
          b.classList.add('is-wrong');
          b.disabled = true;
          fb.textContent = 'Mmm, no. Torna-ho a provar.';
        }
      });
      ow.appendChild(b);
    });

    block.appendChild(ow);
    block.appendChild(fb);
    wrap.appendChild(block);
  });

  return {
    hint(){                       // acierta por ella la primera pregunta pendiente
      for(let qi = 0; qi < total; qi++){
        if(!solved[qi]){
          const ow = wrap.querySelectorAll('.options-col')[qi];
          ow.querySelectorAll('button')[level.questions[qi].correct].click();
          break;
        }
      }
    }
  };
};


/* =========================================================
   NIVEL TIPO "relaciona" — emparejar dos columnas
   (varias rondas: p.ej. sinónimos y traducciones)
   ========================================================= */
Games.relaciona = function(stage, level, onComplete){
  const rounds = level.rounds || [{ title: '', pairs: level.pairs || [] }];
  let ri = 0, done = false, selected = null, matched = 0, needed = 0;

  stage.innerHTML = '';
  const wrap = document.createElement('div'); wrap.className = 'rel-game'; stage.appendChild(wrap);
  const titleEl = document.createElement('p'); titleEl.className = 'rel-title'; wrap.appendChild(titleEl);
  const cols = document.createElement('div'); cols.className = 'rel-cols'; wrap.appendChild(cols);
  const leftCol = document.createElement('div'); leftCol.className = 'rel-col'; cols.appendChild(leftCol);
  const rightCol = document.createElement('div'); rightCol.className = 'rel-col'; cols.appendChild(rightCol);
  const fb = document.createElement('p'); fb.className = 'game-feedback'; wrap.appendChild(fb);
  const prog = document.createElement('p'); prog.className = 'round-progress'; wrap.appendChild(prog);

  function board(){
    const r = rounds[ri];
    titleEl.textContent = r.title || '';
    prog.textContent = rounds.length > 1 ? (ri + 1) + ' / ' + rounds.length : '';
    fb.textContent = '';
    leftCol.innerHTML = ''; rightCol.innerHTML = '';
    selected = null; matched = 0; needed = r.pairs.length;

    shuffle(r.pairs.map((p, i) => ({ i, t: p[0] }))).forEach(o => {
      const b = document.createElement('button');
      b.className = 'rel-item'; b.textContent = o.t; b.dataset.i = o.i;
      b.addEventListener('click', () => pickLeft(b));
      leftCol.appendChild(b);
    });
    shuffle(r.pairs.map((p, i) => ({ i, t: p[1] }))).forEach(o => {
      const b = document.createElement('button');
      b.className = 'rel-item'; b.textContent = o.t; b.dataset.i = o.i;
      b.addEventListener('click', () => pickRight(b));
      rightCol.appendChild(b);
    });
  }

  function pickLeft(b){
    if(done || b.classList.contains('is-done')) return;
    if(selected) selected.classList.remove('is-sel');
    selected = b; b.classList.add('is-sel');
    fb.textContent = '';
  }
  function pickRight(b){
    if(done || b.classList.contains('is-done') || !selected) return;
    if(b.dataset.i === selected.dataset.i){
      b.classList.add('is-done'); selected.classList.add('is-done');
      selected.classList.remove('is-sel'); selected = null;
      matched++; App.ding();
      if(matched === needed){
        ri++;
        if(ri >= rounds.length){ done = true; setTimeout(onComplete, 650); }
        else setTimeout(board, 650);
      }
    } else {
      b.classList.add('is-bad');
      fb.textContent = 'Aquesta no. Prova una altra.';
      setTimeout(() => b.classList.remove('is-bad'), 500);
    }
  }

  board();

  return {
    hint(){                       // resol una parella pendent de la ronda actual
      const left = [...leftCol.children].find(b => !b.classList.contains('is-done'));
      if(!left) return;
      const right = [...rightCol.children].find(b => b.dataset.i === left.dataset.i && !b.classList.contains('is-done'));
      if(!right) return;
      pickLeft(left);
      pickRight(right);
    }
  };
};


/* =========================================================
   NIVEL TIPO "french" — sona la frase (veu del mòbil) i ella
   la reprodueix: escrivint-la (mode 'type') o ordenant les
   paraules estil Duolingo (mode 'words').
   ========================================================= */
Games.french = function(stage, level, onComplete){
  let ri = 0, done = false;
  const canSpeak = typeof window.speechSynthesis !== 'undefined';

  stage.innerHTML = '';
  const wrap = document.createElement('div'); wrap.className = 'fr-game'; stage.appendChild(wrap);
  const playBtn = document.createElement('button'); playBtn.className = 'fr-play'; playBtn.innerHTML = '🔊 Escolta';
  wrap.appendChild(playBtn);
  const meaning = document.createElement('p'); meaning.className = 'fr-meaning'; wrap.appendChild(meaning);
  const area = document.createElement('div'); area.className = 'fr-area'; wrap.appendChild(area);
  const fb = document.createElement('p'); fb.className = 'game-feedback'; wrap.appendChild(fb);
  const prog = document.createElement('p'); prog.className = 'round-progress'; wrap.appendChild(prog);

  function speak(text){
    if(!canSpeak) return false;
    try{
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'fr-FR'; u.rate = 0.9;
      const fr = window.speechSynthesis.getVoices().find(v => (v.lang || '').toLowerCase().indexOf('fr') === 0);
      if(fr) u.voice = fr;
      window.speechSynthesis.speak(u);
      return true;
    }catch(e){ return false; }
  }

  // normalitza per comparar: minúscules, sense accents ni puntuació
  function norm(s){
    return s.toLowerCase().replace(/œ/g, 'oe').replace(/æ/g, 'ae')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, ' ').trim();
  }
  function mode(r){ return r.mode || (r.fr.trim().split(/\s+/).length <= 2 ? 'type' : 'words'); }

  function round(){
    const r = level.rounds[ri];
    prog.textContent = (ri + 1) + ' / ' + level.rounds.length;
    fb.textContent = '';
    meaning.textContent = 'Vol dir: «' + r.ca + '»';
    area.innerHTML = '';
    const spoke = speak(r.fr);
    if(!spoke){   // el mòbil no pot llegir en veu alta: mostra la frase
      const p = document.createElement('p'); p.className = 'fr-fallback'; p.textContent = r.fr;
      area.appendChild(p);
    }
    if(mode(r) === 'type') buildType(r); else buildWords(r);
  }

  function win(){
    App.ding();
    ri++;
    if(ri >= level.rounds.length){ done = true; setTimeout(onComplete, 650); }
    else setTimeout(round, 700);
  }

  function buildType(r){
    const input = document.createElement('input');
    input.type = 'text'; input.className = 'fr-input';
    input.autocomplete = 'off'; input.autocapitalize = 'none'; input.spellcheck = false;
    input.placeholder = 'Escriu-ho en francès…';
    const check = document.createElement('button'); check.className = 'pill-option'; check.textContent = 'Comprova';
    area.appendChild(input); area.appendChild(check);
    function go(){
      if(done) return;
      if(norm(input.value) === norm(r.fr)){ input.disabled = true; check.disabled = true; win(); }
      else fb.textContent = 'Gairebé… torna a escoltar i prova-ho.';
    }
    check.addEventListener('click', go);
    input.addEventListener('keydown', e => { if(e.key === 'Enter') go(); });
  }

  function buildWords(r){
    const words = r.fr.trim().split(/\s+/);
    const slots = document.createElement('div'); slots.className = 'fr-answer';
    const bank = document.createElement('div'); bank.className = 'fr-bank';
    area.appendChild(slots); area.appendChild(bank);
    const placed = [];

    shuffle(words.map((w, i) => ({ w, i }))).forEach(o => {
      const t = document.createElement('button'); t.className = 'fr-word'; t.textContent = o.w;
      t.addEventListener('click', () => {
        if(done || t.classList.contains('is-used')) return;
        t.classList.add('is-used');
        placed.push({ w: o.w, tile: t });
        renderSlots();
        if(placed.length === words.length) check();
      });
      bank.appendChild(t);
    });

    function renderSlots(){
      slots.innerHTML = '';
      placed.forEach((p, idx) => {
        const s = document.createElement('button'); s.className = 'fr-slot'; s.textContent = p.w;
        s.addEventListener('click', () => { if(done) return; p.tile.classList.remove('is-used'); placed.splice(idx, 1); renderSlots(); fb.textContent = ''; });
        slots.appendChild(s);
      });
    }
    function check(){
      if(norm(placed.map(p => p.w).join(' ')) === norm(r.fr)) win();
      else {
        fb.textContent = 'Aquest ordre no és. Torna a escoltar.';
        slots.classList.add('shake');
        setTimeout(() => { slots.classList.remove('shake'); placed.forEach(p => p.tile.classList.remove('is-used')); placed.length = 0; renderSlots(); }, 700);
      }
    }
  }

  playBtn.addEventListener('click', () => speak(level.rounds[ri].fr));
  round();

  return {
    hint(){ fb.textContent = '👉 ' + level.rounds[ri].fr; }   // revela la resposta
  };
};
