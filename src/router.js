import Vue from "vue";
import VueRouter from "vue-router";
import {} from "./utils/constants";
import Single from "./views/Single.vue";
import Multiple from "./views/Multiple.vue";

export const ROUTE_SINGLE = "single";
export const ROUTE_MULTIPLE = "multiple";
export const ROUTE_NAMES = [ROUTE_SINGLE, ROUTE_MULTIPLE];

Vue.use(VueRouter);

const routes = [
  {
    path: "/multiple",
    name: ROUTE_MULTIPLE,
    component: Multiple
  },
  {
    path: "/single",
    name: ROUTE_SINGLE,
    component: Single
  },
  {
    path: "/*",
    redirect: { name: ROUTE_SINGLE }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
