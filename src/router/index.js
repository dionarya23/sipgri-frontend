import Vue from "vue";
import VueRouter from "vue-router";
import Guru from "../views/Guru.vue";
import Login from "../views/Login.vue";
import Layout from "../views/Layout.vue";

import store from "../store/index";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Layout",
    redirect: "/guru",
    component: Layout,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: "guru",
        name: "Guru",
        component: Guru
      }
    ]
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    beforeEnter: (to, from, next) => {
      if (!store.getters["auth/isLoggedIn"]) {
        next();
        return;
      }
      next("/");
    }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (store.getters["auth/isLoggedIn"]) {
      next();
      return;
    }
    next("/login");
  } else {
    next();
  }
});

export default router;
