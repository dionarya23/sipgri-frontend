import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: "",
    user: {},
    loading: false
  },
  mutations: {
    AUTH_SUCCESS(state, user) {
      state.token = "Bearer " + user.token;
      state.user = user;
    },
    LOGOUT(state) {
      state.token = "";
    }
  },
  actions: {
    login({ commit, state }, user) {
      state.loading = true;
      return new Promise((resolve, reject) => {
        axios({ url: "guru/login/", data: user, method: "POST" })
          .then((res) => {
            const user = res.data.data;
            localStorage.setItem("token", `Bearer ${user.token}`);
            axios.defaults.headers.common["Authorization"] =
              "Bearer " + user.token;
            commit("AUTH_SUCCESS", user);
            state.loading = false;
            resolve(res);
          })
          .catch((err) => {
            console.error(err);
            // commit("error_alert", "Incorrect Email or Password!");
            localStorage.removeItem("token");
            state.loading = false;
            reject(err);
          });
      });
    },
    logout({ commit }) {
      return new Promise((resolve, reject) => {
        commit("LOGOUT");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        delete axios.defaults.headers.common["Authorization"];
        resolve();
      });
    }
  },
  modules: {},
  getters: {
    isLoggedIn: (state) => !!state.token
  },
  plugins: [
    createPersistedState({
      paths: ["user"],
      key: ["user"]
    })
  ]
});
