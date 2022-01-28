import i18n, { LanguageDetectorModule } from "i18next";
import { initReactI18next } from "react-i18next";
import { findBestAvailableLanguage } from "react-native-localize";

import { resources } from "./resources";

const noop = () => {
  // no-op
};

// https://www.i18next.com/overview/plugins-and-utils#language-detector
const i18nLanguageDetector: LanguageDetectorModule = {
  type: "languageDetector",
  detect: () => {
    const language = findBestAvailableLanguage(Object.keys(resources));
    return language?.languageTag ?? "en";
  },
  init: noop,
  cacheUserLanguage: noop,
};

void i18n
  .use(i18nLanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    ns: ["common"],
    defaultNS: "common",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    cleanCode: true,
    /**
     * TODO(DEBT-03): Update to the latest translation JSON format.
     */
    compatibilityJSON: "v3",
  });

export default i18n;
