import Vue from "vue";
import VueRouter from "vue-router";

import User from "../views/tata_usaha/User.vue";
import TahunAjaran from "../views/tata_usaha/TahunAjaran.vue";
import PesertaDidik from "../views/tata_usaha/PesertaDidik.vue";

import Login from "../views/auth/Login.vue";
import LostPassword from "../views/auth/LostPassword.vue";
import ChangePassword from "../views/auth/ChangePassword.vue";
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
      requiresAuth: true,
    },
    children: [
      {
        path: "user",
        name: "User",
        component: User,
        meta: {
          roles: ["tata_usaha"],
        },
      },
      {
        path: "tahun-ajaran",
        name: "Tahun Ajaran",
        component: TahunAjaran,
        meta: {
          roles: ["tata_usaha"],
        },
      },
      {
        path: "peserta-didik",
        name: "Peserta Didik",
        component: PesertaDidik,
        meta: {
          roles: ["tata_usaha"],
        },
      },
    ],
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
    },
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
    },
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
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (store.getters["auth/isLoggedIn"]) {
      if (to.meta.roles.includes(store.getters["auth/role"])) {
        return next();
      } else {
        switch (store.getters["auth/role"]) {
          case "tata_usaha":
            next({
              name: "User",
            });
            break;

          case "kurikulum":
            // next({
            //   name: "Peserta Didik",
            // });
            break;

          case "guru":
            // next({
            //   name: "Peserta Didik",
            // });
            break;

          case "wali_kelas":
            // next({
            //   name: "Peserta Didik",
            // });
            break;

          default:
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("role");
            delete axios.defaults.headers.common["Authorization"];
            next({
              name: "Login",
            });
            break;
        }
      }
    } else {
      console.log("masuk login kesini")
      next();
      return;
    }
  }

  next();
});

export default router;
