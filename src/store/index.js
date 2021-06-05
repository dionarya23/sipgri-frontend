import Vue from "vue";
import Vuex from "vuex";

import auth from "./modules/auth";
import user from "./modules/user";
import matapelajaran from "./modules/matapelajaran";
import tahunAjaran from "./modules/tahunAjaran";
import pesertaDidik from "./modules/pesertaDidik";

import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    alert: {
      isShow: false,
      type: "",
      message: "",
    },
  },
  mutations: {
    SHOW_ALERT(state, payload) {
      state.alert.isShow = true;
      state.alert.type = payload.type;
      state.alert.message = payload.message;
      if (state.alert.message !== "Link untuk mengubah password salah") {
        setTimeout(() => {
          state.alert.isShow = false;
        }, 6000);
      }
    },
    CLOSE_ALERT(state) {
      state.alert.isShow = false;
    },
  },
  actions: {},
  modules: { auth, user, matapelajaran, tahunAjaran, pesertaDidik },
  getters: {},
  plugins: [
    createPersistedState({
      paths: ["auth.user"],
      key: ["user"],
    }),
  ],
});
