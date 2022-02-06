import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Latex from '../views/doc/Latex.vue'
import Installer from '../views/Installer.vue'
import RPN from '../views/doc/RPN.vue'
import Releases from '../views/Releases.vue'
import Simulator from '../views/Simulator.vue'
import NotFound from '../views/NotFound.vue'
import Themes from '../views/doc/Themes.vue'

const routes = [{
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
  path: '/doc/themes',
  name: 'Themes',
  component: Themes
},
{
  path: '/install',
  name: 'Installer',
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
