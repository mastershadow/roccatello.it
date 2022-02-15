import "bootstrap/dist/js/bootstrap.js";
import "./scss/main.scss";

import CookieConsent from "@klaxit/cookie-consent"
import { v4 as uuid } from 'uuid';

const GA_LOCAL_STORAGE_KEY = 'ga:clientId';

const activateAnalytics = () => {
  const hd = document.head;
  const gtagScript = document.createElement("script");
  gtagScript.setAttribute("async", "");
  gtagScript.setAttribute("src", "https://www.googletagmanager.com/gtag/js?id=UA-695484-3");
  hd.appendChild(gtagScript);
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  if (window.localStorage) {
    if (!localStorage.getItem(GA_LOCAL_STORAGE_KEY)) {
      window.localStorage.setItem(GA_LOCAL_STORAGE_KEY, uuid());
    }

    gtag('config', 'UA-695484-3', {
          send_page_view: true,
          client_storage: 'none',
          client_id: localStorage.getItem(GA_LOCAL_STORAGE_KEY),
        });
  }
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
} 

activateAnalytics();

cc.on("accept", (cc) => {
  const hasAnalytics = cc.acceptedCategories.indexOf("analytics") !== -1;
  if (hasAnalytics) {
    //activateAnalytics();
  }

});