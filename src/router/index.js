import { createRouter, createWebHistory } from 'vue-router'
import FAQ from '../views/doc/FAQ.vue'
import RPN from '../views/doc/RPN.vue'
import Themes from '../views/doc/Themes.vue'
import Reader from '../views/doc/Reader.vue'
import Home from '../views/Home.vue'
import Installer from '../views/Installer.vue'
import NotFound from '../views/NotFound.vue'
import Releases from '../views/Releases.vue'
import Simulator from '../views/Simulator.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/doc/reader',
    name: 'Reader',
    component: Reader
  },
  {
    path: '/doc/themes',
    name: 'Themes',
    component: Themes
  },
  {
    path: '/doc/rpn',
    name: 'RPN',
    component: RPN
  },
  {
    path: '/doc/faq',
    name: 'FAQ',
    component: FAQ
  },
  {
    path: '/install',
    name: 'Installer',
    component: Installer
  },
  {
    path: '/releases',
    name: 'Releases',
    component: Releases
  },
  {
    path: '/simulator',
    name: 'Simulator',
    component: Simulator
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
