import axios from "axios";

const auth = {
  namespaced: true,
  state: {
    token: localStorage.getItem("token") || "",
    user: JSON.parse(localStorage.getItem("user")) || {},
    isLoading: false,
    isHashverif: false,
  },
  mutations: {
    AUTH_SUCCESS(state, user) {
      state.token = "Bearer " + user.token;
      state.user = user;
    },
    LOGOUT(state) {
      state.token = "";
    },
  },
  actions: {
    login({ commit, state }, user) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({ url: "user/login", data: user, method: "POST" })
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
                  : "Email atau password salah",
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
    },
    lostPassword({ commit, state }, phoneOrEmail) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({ url: "user/lost-password", data: phoneOrEmail, method: "POST" })
          .then((res) => {
            const payload = {
              type: "success",
              message: "Link berhasil dikirim, harap periksa whatsapp anda",
            };
            commit("SHOW_ALERT", payload, { root: true });
            state.isLoading = false;
            resolve(res);
          })
          .catch((err) => {
            const payload = {
              type: "error",
              message:
                err.response.status === 404
                  ? "Email atau nomor telepon tidak terdaftar"
                  : "Email atau nomor telepon tidak valid",
            };
            commit("SHOW_ALERT", payload, { root: true });
            state.isLoading = false;
            reject(err);
          });
      });
    },
    changePassword({ commit, state }, newPassword) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({
          url: "user/change-password",
          data: newPassword,
          method: "POST",
        })
          .then((res) => {
            const payload = {
              type: "success",
              message:
                "Password anda berhasil diganti silahkan login dengan password baru",
            };
            commit("SHOW_ALERT", payload, { root: true });
            state.isLoading = false;
            resolve(res);
          })
          .catch((err) => {
            const payload = {
              type: "error",
              message:
                err.response.status === 400
                  ? "Terjadi kesalahan saat mengganti password"
                  : "link ini tidak valid saat mengganti password",
            };
            commit("SHOW_ALERT", payload, { root: true });
            state.isLoading = false;
            reject(err);
          });
      });
    },
    verifyHash({ commit, state }, hash) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({ url: `user/hash/${hash}`, method: "GET" })
          .then((res) => {
            state.isHashverif = true;
            state.isLoading = false;
            resolve(res);
          })
          .catch((err) => {
            const payload = {
              type: "error",
              message: "link untuk mengubah password salah",
            };
            commit("SHOW_ALERT", payload, { root: true });
            state.isHashverif = false;
            state.isLoading = false;
            reject(err);
          });
      });
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.token,
  },
};

export default auth;
