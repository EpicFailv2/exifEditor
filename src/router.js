import Vue from 'vue';
import VueRouter from 'vue-router';
import { ROUTE_LANDING, ROUTE_POLICY, ROUTE_PUBLIC, ROUTE_TERMS } from './utils/constants';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: ROUTE_LANDING,
    component: () => import(/* webpackChunkName: "view" */ './views/Landing.vue')
  }, {
    path: '/public',
    name: ROUTE_PUBLIC,
    component: () => import(/* webpackChunkName: "view" */ './views/Public.vue')
  }, {
    path: '/terms',
    name: ROUTE_TERMS,
    component: () => import(/* webpackChunkName: "view" */ './views/Terms.vue')
  }, {
    path: '/pp',
    name: ROUTE_POLICY,
    component: () => import(/* webpackChunkName: "view" */ './views/PrivacyPolicy.vue')
  }, {
    path: '/*',
    redirect: { name: 'landing' }
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
