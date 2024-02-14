import Vue from "vue";
import VueRouter from "vue-router";
import {} from "./utils/constants";

export const ROUTE_LANDING = "landing";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: ROUTE_LANDING,
    component: () => import(/* webpackChunkName: "view" */ "./views/Landing.vue")
  },
  {
    path: "/*",
    redirect: { name: "landing" }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
