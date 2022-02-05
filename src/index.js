import "bootstrap/dist/js/bootstrap.js";
import "./scss/main.scss";

import CookieConsent from "@klaxit/cookie-consent"


const activateAnalytics = () => {
  const hd = document.head;
  const gtagScript = document.createElement("script");
  gtagScript.setAttribute("async", "");
  gtagScript.setAttribute("src", "https://www.googletagmanager.com/gtag/js?id=UA-695484-3");
  hd.appendChild(gtagScript);
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'UA-695484-3');
};

const cc = new CookieConsent({
  title: "We use cookies 🍪",
  description: `Click “Accept” to enable us to use cookies to personalize
  this site. Customize your preferences in your
  Cookie Settings or click “Reject” if you do not want us
  to use cookies for this purpose. Learn more in our
  <a href="/privacy">Privacy policy</a>.`
});

if (cc.status != "accepted") {
  cc.open();
} else {
  activateAnalytics();
}

cc.on("accept", (cc) => {
  const hasAnalytics = cc.acceptedCategories.indexOf("analytics") !== -1;
  if (hasAnalytics) {
    activateAnalytics();
  }

});