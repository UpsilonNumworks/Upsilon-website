import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Latex from '../views/Latex.vue'
import Installer from '../views/Installer.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/latex',
    name: 'Latex',
    component: Latex
  },
  {
    path: '/install',
    name: 'Install',
    component: Installer
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
