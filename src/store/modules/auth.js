import axios from "axios";

const auth = {
  namespaced: true,
  state: {
    token: localStorage.getItem("token") || "",
    user: JSON.parse(localStorage.getItem("user")) || {},
    isLoading: false
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
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({ url: "guru/login/", data: user, method: "POST" })
          .then((res) => {
            const user = res.data.data;
            localStorage.setItem("token", `Bearer ${user.token}`);
            axios.defaults.headers.common["Authorization"] =
              "Bearer " + user.token;
            commit("AUTH_SUCCESS", user);
            state.isLoading = false;
            resolve(res);
          })
          .catch((err) => {
            const payload = {
              type: "error",
              message:
                err.response.status === 404
                  ? "Akun belum terdaftar"
                  : "Email atau password salah"
            };
            commit("SHOW_ALERT", payload, { root: true });
            localStorage.removeItem("token");
            state.isLoading = false;
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
  getters: {
    isLoggedIn: (state) => !!state.token
  }
};

export default auth;
