import Vue from "vue";
import VueI18n from "vue-i18n";
import { LANG_KEY } from "./utils/constants";

Vue.use(VueI18n);

export const i18n = new VueI18n({
  locale: localStorage.getItem(LANG_KEY) || "en",
  fallbackLocale: "en",
  messages: loadLocaleMessages(),
  silentFallbackWarn: true
});

function loadLocaleMessages() {
  const locales = require.context("./locales", true, /[A-Za-z0-9-_,\s]+\.json$/i);
  const messages = {};
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key);
    }
  });
  return messages;
}
