import Vue from "vue";
import VueRouter from "vue-router";

import User from "../views/tata_usaha/User.vue";
import TahunAjaran from "../views/tata_usaha/TahunAjaran.vue";
import PesertaDidik from "../views/tata_usaha/PesertaDidik.vue";
import TanggalLhbs from "../views/tata_usaha/TanggalLhbs.vue";

import MataPelajaran from "../views/kurikulum/MataPelajaran.vue";
import Eskul from "../views/kurikulum/Eskul.vue";

import Profile from "../views/auth/Profile.vue"
import Password from "../views/auth/Password.vue"

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
        name: "Data User",
        component: User,
        meta: {
          roles: ["tata_usaha"],
        },
      },
      {
        path: "tahun-ajaran",
        name: "Data Tahun Ajaran",
        component: TahunAjaran,
        meta: {
          roles: ["tata_usaha"],
        },
      },
      {
        path: "peserta-didik",
        name: "Data Peserta Didik",
        component: PesertaDidik,
        meta: {
          roles: ["tata_usaha"],
        },
      },
      {
        path: "tanggal-lhbs",
        name: `Data Tanggal LHBS Tahun Ajaran`,
        component: TanggalLhbs,
        meta: {
          roles: ["tata_usaha"]
        }
      },
      {
        path: "mata-pelajaran",
        name: "Data Mata Pelajaran",
        component: MataPelajaran,
        meta : {
          roles: ["kurikulum"]
        }
      },
      {
        path: "eskul",
        name: "Data Esktrakulikuler",
        component: Eskul,
        meta: {
          roles: ["kurikulum"]
        }
      },
      {
        path: "ubah-profile",
        name: "Ubah Profile",
        component: Profile,
        meta: {
          roles: ["kurikulum", "tata_usaha", "guru", "wali_kelas"]
        } 
      },
      {
        path: "ubah-password",
        name: "Ubah Password",
        component: Password,
        meta: {
          roles: ["kurikulum", "tata_usaha", "guru", "wali_kelas"]
        } 
      }
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
              name: "Data User",
            });
            break;

          case "kurikulum":
            next({
              name: "Data Mata Pelajaran",
            });
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
