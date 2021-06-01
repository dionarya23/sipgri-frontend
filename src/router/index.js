import Vue from "vue";
import VueRouter from "vue-router";
import User from "../views/User.vue";
import Login from "../views/Login.vue";
import LostPassword from "../views/LostPassword.vue";
import ChangePassword from "../views/ChangePassword.vue";
import Layout from "../views/Layout.vue";

import store from "../store/index";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Layout",
    redirect: "/user",
    component: Layout,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: "user",
        name: "User",
        component: User
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
  },
  {
    path: "/lost-password",
    name: "LostPassword",
    component: LostPassword,
    beforeEnter: (to, from, next) => {
      if (!store.getters["auth/isLoggedIn"]) {
        next();
        return;
      }
      next("/");
    }
  },
  {
    path: "/change-password/:hash",
    name: "ChangePassword",
    component: ChangePassword,
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
