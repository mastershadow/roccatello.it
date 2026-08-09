import "bootstrap/js/src/collapse";

// non il pacchetto intero: il suo entry point importa uno scss, che esbuild
// non sa compilare. il css arriva da assets/scss/main.scss
import CookieConsent from "@klaxit/cookie-consent/src/cookie_consent"
import { v4 as uuid } from 'uuid';

const GA_LOCAL_STORAGE_KEY = 'ga:clientId';

// il client id sta in localStorage invece che nel cookie _ga: meno cookie in
// giro a parita' di misurazione
let analyticsActive = false;
const activateAnalytics = () => {
  if (analyticsActive || !window.localStorage) {
    return;
  }
  analyticsActive = true;

  const gtagScript = document.createElement("script");
  gtagScript.setAttribute("async", "");
  gtagScript.setAttribute("src", "https://www.googletagmanager.com/gtag/js?id=G-S3YK3YKMEZ");
  document.head.appendChild(gtagScript);
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  if (!localStorage.getItem(GA_LOCAL_STORAGE_KEY)) {
    localStorage.setItem(GA_LOCAL_STORAGE_KEY, uuid());
  }

  gtag('config', 'G-S3YK3YKMEZ', {
    send_page_view: true,
    client_storage: 'none',
    client_id: localStorage.getItem(GA_LOCAL_STORAGE_KEY),
  });
};

// il costruttore apre da solo il banner alla prima visita; se una scelta
// esiste gia' non riapre nulla, nemmeno per chi ha rifiutato
const cc = new CookieConsent({
  title: "Questo sito usa i cookie 🍪",
  description: `Premi "Accetta" per consentire l'uso dei cookie di misurazione
  del traffico, oppure "Rifiuta" se non vuoi. I dettagli sono nella
  <a href="/privacy">privacy policy</a>.`,
  buttons: {
    acceptAll: "Accetta",
    acceptSelected: "Accetta i selezionati",
    reject: "Rifiuta",
    showSettings: "Preferenze",
    hideSettings: "Nascondi",
  },
  categories: {
    essentials: {
      label: "Essenziali",
      description: `Servono al funzionamento di base del sito, come ricordare
      questa scelta sui cookie.`,
      checked: true,
      mandatory: true,
    },
    analytics: {
      label: "Statistiche",
      description: `Permettono di misurare le visite in forma anonima, per
      capire quali contenuti sono letti.`,
    },
  },
});

const analyticsConsented = () =>
  cc.status === "accepted" && cc.acceptedCategories.indexOf("analytics") !== -1;

// google analytics parte solo dopo il consenso esplicito alla categoria
// statistiche: mai al primo caricamento, mai dopo un rifiuto
if (analyticsConsented()) {
  activateAnalytics();
}

cc.on("accept", () => {
  if (analyticsConsented()) {
    activateAnalytics();
  }
});
