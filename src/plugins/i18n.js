import Vue from 'vue'
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

/**
 * Create an i18n configuration
 * @param locale Localized language
 * @param fallback Fallback language
 * @returns {VueI18n}
 */
 function initI18n(locale, fallback) {
    Vue.use(VueI18n)
    let i18nOptions = {
      locale,
      fallbackLocale: fallback,
      silentFallbackWarn: true,
    }
    return new VueI18n(i18nOptions)
  }


export default initI18n;