# Sorpresa 💌 — la gimcana

Web estàtica (HTML/CSS/JS pur, sense build ni dependències) llesta per a GitHub Pages.
Primer surt la **cançó** (l'ha d'engegar), després un **sobre** que obre i un **carrusel** de fotos,
i llavors una **gimcana de 10 nivells**: cada minijoc que supera li dona una **peça (una lletra)** i
un **tros de la teva carta**. Reunint les peces desxifra un **codi secret** (`T'ESTIMO!`) que
desbloqueja el final: la vostra retrospectiva, el comptador de dies i **el pla real**.

## Els nivells (10)
1. **Puzzle de foto** — recompondre una foto (`foto7.jpg`) intercanviant peces.
2. **Memory** — trobar les parelles (les 6 fotos del carrusel).
3. **Sopa de lletres** — trobar paraules arrossegant el dit.
4. **Relaciona** — dues columnes: sinònims i traduccions.
5. **Pronominalitza** — triar la forma correcta amb pronoms febles.
6. **Francès** — sona una frase i l'escriu o ordena les paraules.
7. **Endevina amb emojis** — deduir la frase de cada línia d'emojis.
8. **Quiz** — preguntes sobre vosaltres.
9. **Càmera · caça el cor** — realitat augmentada: atrapar un cor que fuig.
10. **Càmera · troba l'espurna** — trobar un punt invisible pel fred/calent.

---

## ✏️ Què has d'editar → NOMÉS `config.js`

Tot el contingut està centralitzat a **`config.js`**. No cal que toquis `index.html`,
`games.js` ni `app.js`. Obre `config.js` i busca els comentaris `[EDITA AQUÍ]`. Aquestes són les
seccions:

| Secció | Què canvies |
|---|---|
| `coverTitle`, `names` | Títol del sobre i els vostres noms. |
| `photos` | Noms de les fotos del carrusel (veure més avall). |
| `startDate` | Data en què vau començar (comptador de dies). |
| `secretCode`, `secretHint` | La paraula final i la seva pista. |
| `musicLead`, `musicButton` | Text i botó de la pantalla de la cançó (surt primer). |
| `levels` | Els 10 nivells: dades de cada joc, la seva **lletra** i el seu **tros de carta**. |
| `milestones` | La retrospectiva que es veu al final. |
| `signature`, `songLink` | Signatura de la carta i cançó. |
| `finaleLead`, `finalePlan`, `plan` | El pla real + botó de calendari i mapa. |

### El codi secret (important)
Cada nivell entrega **una lletra** (camp `letter`). En acabar-los, ella ha d'**ordenar les peces**
per formar `secretCode` (`T'ESTIMO!`).

➡️ **Regla:** l'apòstrof i els espais es dibuixen sols com a separadors (no calen peces). La resta de
caràcters (lletres **i el `!`**) sí que són peces. Els 8 caràcters de `T'ESTIMO!` són:
`T · E · S · T · I · M · O · !`.

⚠️ **Peces trampa:** els 2 nivells de càmera donen les lletres **A** i **R**, que **no** formen part
del codi. Són decoys a propòsit: al final hi ha 10 fitxes però només 8 caselles, i ella ha de
descartar la A i la R. Si vols treure la trampa, canvia aquestes `letter` per caràcters que sí que
surtin a `secretCode`.

### La carta trossejada
El camp `fragment` de cada nivell és un tros de la teva carta. Es revela com a premi en superar el
nivell i, al final, **tots els trossos s'ajunten** en una carta completa amb la teva `signature`.
Escriu-los perquè tinguin sentit llegits seguits, en l'ordre dels nivells.

---

## 📷 Fotos — calen 7 fitxers a `photos/`
- `foto1.jpg` … `foto6.jpg` → es fan servir al **carrusel** inicial **i** al **memory** (les mateixes 6).
- `foto7.jpg` → exclusiva del **puzzle** (nivell 1).

El memory reutilitza automàticament `CONFIG.photos` (hi ha una línia al final de `config.js` que ho
fa), així que només has de mantenir la llista `photos` i el `photo` del puzzle.

- Serveixen `.jpg`, `.png` o `.webp` (si canvies l'extensió, canvia-la també a `config.js`).
- Mentre una foto no existeixi, es mostra un avís al seu lloc (pots provar la web sense fotos encara).
- **Comprimeix les fotos** abans de pujar-les (<500 KB) perquè carregui ràpid en escanejar el QR:
  [squoosh.app](https://squoosh.app).

## 📸 Els 2 nivells de càmera (realitat augmentada)
Els nivells 9 i 10 obren la **càmera** del mòbil (un cor que flota sobre la imatge real, i un punt
amagat). Necessiten:
- **HTTPS** — GitHub Pages ja el dona, així que en producció funciona sol (en local, `localhost` també val).
- **Permís de càmera** — el mòbil li demanarà; si el denega, el joc segueix funcionant amb un fons
  romàntic en lloc de la càmera (no es queda encallada).

## 🎵 Cançó
Dues opcions a `songLink`:
- **Spotify (recomanat):** enganxa la URL (`https://open.spotify.com/track/...`). Es mostra un
  reproductor incrustat; l'àudio el serveix Spotify (legal i sense pes al repo).
- **Fitxer local:** deixa `songLink: ''` i copia la teva cançó a `audio/cancion.mp3`. Compte: en pujar
  el repo, aquest fitxer queda descarregable públicament — evita música amb copyright aliè.

Un enllaç que no sigui d'Spotify (p. ex. YouTube) es mostra com un botó que obre en una altra pestanya.

## 📅 El pla final
A `config.js`, edita `finalePlan` (el text) i l'objecte `plan` (títol, lloc, data/hora).
El botó **"Afegir al meu calendari"** genera un `.ics` descarregable (Google/Apple/Outlook) sense
serveis externs, i **"Com arribar-hi"** obre Google Maps amb `plan.location`.

## ⚙️ Ajustos (final de `config.js`)
- `saveProgress` — guarda l'avanç: si tanca la web, continua on anava.
- `allowHint` — mostra un botó *"t'ajudo?"* a cada joc perquè **no s'encalli mai**.
- `sound` — petits sons en encertar (es generen sols, no hi ha fitxers).

---

## 🧪 Provar-ho en local
Obre'l amb un servidor estàtic (recomanat, perquè Spotify i tot funcioni). Amb Node:

```bash
npx http-server -p 8000
```

i visita `http://localhost:8000`. També pots obrir `index.html` directament al navegador.

**Reiniciar l'avanç mentre proves:** afegeix `?reset` a la URL
(`http://localhost:8000/?reset`) o executa `__reset()` a la consola del navegador. Fes-ho cada cop
que vulguis jugar la gimcana des de zero.

## 🚀 Desplegar a GitHub Pages (gratis, sense domini)
1. Crea un repositori nou a GitHub.
2. Puja aquests fitxers a l'arrel del repo:
   ```bash
   git init
   git add .
   git commit -m "Sorpresa"
   git branch -M main
   git remote add origin https://github.com/EL_TEU_USUARI/EL_TEU_REPO.git
   git push -u origin main
   ```
3. A GitHub: **Settings → Pages → Source**, tria la branca `main` i la carpeta `/ (root)`. Desa.
4. En 1-2 minuts estarà a `https://EL_TEU_USUARI.github.io/EL_TEU_REPO/`.

> Si el repo és **públic**, qualsevol amb la URL podria veure-la (encara que ningú la coneix). Amb
> GitHub Pro pots fer servir un repo privat. Evita pujar fotos molt íntimes a un repo públic.

## 🔳 Generar el QR
Amb la URL de dalt, genera un QR gratis (sense registre):
- [qr-code-generator.com](https://www.qr-code-generator.com)
- [the-qrcode-generator.com](https://www.the-qrcode-generator.com)

**Genera el QR al final**, quan ja ho hagis provat tot amb contingut real, per no haver de regenerar-lo.

## Notes
- Tot el contingut és teu; no hi ha serveis de pagament ni analítica.
- Optimitzada per a mòbil (és el que farà servir en escanejar): swipe, arrossegament tàctil, vibració en encertar.
- Respecta `prefers-reduced-motion` (redueix animacions si el seu mòbil ho demana).

## Fitxers
```
index.html   estructura (no cal tocar-lo)
style.css    estils (no cal tocar-lo)
config.js    ← TOT el que edites
games.js     motor dels minijocs (no tocar)
app.js       flux de la gimcana (no tocar)
photos/      les teves fotos
audio/        la teva cançó (opcional)
```
