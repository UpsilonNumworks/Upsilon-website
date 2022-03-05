import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import VueMathJax from 'vue-mathjax-next'

const app = createApp(App)
app.use(VueMathJax).use(i18n).use(router).mount('#app')
app.config.globalProperties.$window = window
