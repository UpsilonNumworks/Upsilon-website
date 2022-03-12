import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueMathJax from 'vue-mathjax-next'
import { createI18n } from 'vue-i18n'

function loadLocaleMessages () {
  const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.json$/i)
  const messages = {}
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      messages[locale] = locales(key).default
    }
  })
  return messages
}
const i18n = createI18n({
  legacy: false,
  locale: navigator.language === 'fr' ? 'fr' : 'en',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
  messages: loadLocaleMessages()
})

const app = createApp(App)
app.use(VueMathJax).use(i18n).use(router).mount('#app')
app.config.globalProperties.$window = window
console.log(i18n)
app.config.globalProperties.$i18n = i18n
