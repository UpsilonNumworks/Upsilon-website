import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Latex from '../views/doc/Latex.vue'
import Installer from '../views/Installer.vue'
import RPN from '../views/doc/RPN.vue'
import Releases from '../views/Releases.vue'

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
  },
  {
    path: '/releases',
    name: 'Releases',
    component: Releases
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
