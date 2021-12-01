import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Cadastro from './views/Cadastro.vue'
import { configRoutes } from 'scsdp-plugin'

Vue.use(Router)
var routes = [
  {
    path: '/',
    name: 'pesquisar',
    component: Home,
    meta: {
      title: 'Pesquisar',
      requiresAuth: true
    }
  },
  {
    name: 'cadastro',
    component: Cadastro,
    path: '/cadastro',
    meta: {
      title: 'Cadastro',
      requiresAuth: true
    }

  },
  {
    name: 'editar',
    component: Cadastro,
    path: '/editar/:id',
    meta: {
      title: 'Editar',
      requiresAuth: true
    }

  }
]
routes = configRoutes(routes)
const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: routes
})
export default router
