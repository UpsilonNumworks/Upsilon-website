import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Latex from '../views/Latex.vue'
import Installer from '../views/Installer.vue'
import RPN from '../views/RPN.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/doc/latex',
    name: 'Latex',
    component: Latex
  },
  {
    path: '/install',
    name: 'Install',
    component: Installer
  },
  {
    path: '/doc/rpn',
    name: 'RPN',
    component: RPN
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
