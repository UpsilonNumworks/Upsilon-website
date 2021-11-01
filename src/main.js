import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// Vue.prototype.window = window
createApp(App).use(router).mount('#app')
