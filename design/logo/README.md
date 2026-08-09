# Identità visiva

- `header.jpeg` — lockup originale fornito da Eduard (1400×350).
- `lockup-white.svg` — vettorializzazione fedele del lockup completo
  (vite + lettering), tracciata con potrace dal jpeg. Bianco su trasparente.
- `mark-white.svg` — la sola vite stilizzata, estratta dai tracciati del
  lockup. È la base delle favicon in `site/static/`.

Fatti di brand:

- Il simbolo è una **vite stilizzata**, non una farfalla.
- Blu del brand: **#013564** (campionato dal jpeg, uniforme).
  Nel sito è `$brand` in `site/assets/scss/main.scss`.
- Il lettering è **ITC Kabel Demi**. Font commerciale: non va embeddato come
  webfont. Per il testo del lettering usare sempre i tracciati vettoriali.
