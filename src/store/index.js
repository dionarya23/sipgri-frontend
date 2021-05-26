import Vue from "vue";
import Vuex from "vuex";
import auth from "./modules/auth";
import user from "./modules/user";

import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    alert: {
      isShow: false,
      type: "",
      message: ""
    }
  },
  mutations: {
    SHOW_ALERT(state, payload) {
      state.alert.isShow = true;
      state.alert.type = payload.type;
      state.alert.message = payload.message;
      setTimeout(() => {
        state.alert.isShow = false;
      }, 5000);
    }
  },
  actions: {},
  modules: { auth, user },
  getters: {},
  plugins: [
    createPersistedState({
      paths: ["auth.user"],
      key: ["user"]
    })
  ]
});
