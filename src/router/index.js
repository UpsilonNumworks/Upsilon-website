import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Latex from '../views/Latex.vue'

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
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
