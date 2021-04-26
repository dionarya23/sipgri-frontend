import axios from "axios";

const guru = {
  namespaced: true,
  state: {
    guru: [],
    isLoading: false,
    alert: {
      type: "",
      message: ""
    }
  },
  mutations: {
    SET_GURU(state, data) {
      state.guru = data;
    }
  },
  actions: {
    getAllGuru({ commit, state, rootState }) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({
          url: "guru/",
          method: "GET",
          headers: { Authorization: rootState.auth.token }
        })
          .then((res) => {
            commit("SET_GURU", res.data.data);
            state.isLoading = false;
            resolve(res);
          })
          .catch((err) => {
            console.error(err);
            state.isLoading = false;
            reject(err);
          });
      });
    },
    createUser({ commit, state }, data) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({ url: "guru/register", method: "POST", data })
          .then((res) => {
            state.alert.type = "success";
            state.alert.message = "Berhasil menambah data guru";
            commit("SHOW_ALERT", state.alert, { root: true });
            state.isLoading = false;
            resolve(res);
          })
          .catch((err) => {
            console.error(err);
            state.alert.type = "error";
            state.alert.message = "Gagal menambah data guru";
            commit("SHOW_ALERT", state.alert, { root: true });
            state.isLoading = false;
            reject(err);
          });
      });
    },
    updateUser({ commit, state }, data) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({ url: `guru/${data.oldNip}`, method: "PUT", data })
          .then((res) => {
            state.alert.type = "success";
            state.alert.message = "Berhasil mengubah data guru";
            commit("SHOW_ALERT", state.alert, { root: true });
            state.isLoading = false;
            resolve(res);
          })
          .catch((err) => {
            console.error(err);
            state.alert.type = "error";
            state.alert.message = "Gagal mengubah data guru";
            commit("SHOW_ALERT", state.alert, { root: true });
            state.isLoading = false;
            reject(err);
          });
      });
    },
    deleteUser({ commit, state }, nip) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({ url: `guru/${nip}`, method: "DELETE" })
          .then((res) => {
            state.isLoading = false;
            state.alert.type = "success";
            state.alert.message = "Berhasil menghapus data guru";
            commit("SHOW_ALERT", state.alert, { root: true });
            state.guru = state.guru.filter((item) => {
              return item.nip != nip;
            });
            resolve(res);
          })
          .catch((err) => {
            state.isLoading = false;
            state.alert.type = "error";
            state.alert.message = "Gagal menghapus data guru";
            commit("SHOW_ALERT", state.alert, { root: true });
            reject(err);
          });
      });
    },
    checkNip(_, data) {
      return new Promise((resolve, reject) => {
        axios({ url: "guru/check-nip", method: "POST", data })
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    checkEmail(_, data) {
      return new Promise((resolve, reject) => {
        axios({ url: "guru/check-email", method: "POST", data })
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      });
    }
  }
};

export default guru;
