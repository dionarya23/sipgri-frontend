import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Layout from "../views/Layout.vue";

import store from "../store/index";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Layout",
    redirect: "/dashboard",
    component: Layout,
    meta: {
      requiresAuth: true
    },
    beforeEnter: (to, from, next) => {
      if (store.getters.isLoggedIn) {
        next();
        return;
      }
      next("/login");
    },
    children: [
      {
        path: "dashboard",
        name: "Dasboard",
        component: Home
      }
    ]
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    beforeEnter: (to, from, next) => {
      if (!store.getters.isLoggedIn) {
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
    if (store.getters.isLoggedIn) {
      next();
      return;
    }
    next("/login");
  } else {
    next();
  }
});

export default router;
