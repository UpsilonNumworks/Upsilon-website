import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import VueMathJax from 'vue-mathjax-next'

createApp(App).use(VueMathJax).use(i18n).use(router).mount('#app')
