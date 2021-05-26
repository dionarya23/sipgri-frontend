import axios from "axios";

const user = {
  namespaced: true,
  state: {
    user: [],
    isLoading: false,
    alert: {
      type: "",
      message: ""
    }
  },
  mutations: {
    SET_USER(state, data) {
      state.user = data;
    }
  },
  actions: {
    getAllUser({ commit, state, rootState }) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({
          url: "user/",
          method: "GET",
          headers: { Authorization: rootState.auth.token }
        })
          .then((res) => {
            commit("SET_USER", res.data.data);
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
        axios({ url: "user/", method: "POST", data })
          .then((res) => {
            state.alert.type = "success";
            state.alert.message = "Berhasil menambah data user";
            commit("SHOW_ALERT", state.alert, { root: true });
            state.isLoading = false;
            resolve(res);
          })
          .catch((err) => {
            console.error(err);
            state.alert.type = "error";
            state.alert.message = "Gagal menambah data user";
            commit("SHOW_ALERT", state.alert, { root: true });
            state.isLoading = false;
            reject(err);
          });
      });
    },
    updateUser({ commit, state }, data) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({ url: `user/${data.oldNip}`, method: "PUT", data })
          .then((res) => {
            state.alert.type = "success";
            state.alert.message = "Berhasil mengubah data user";
            commit("SHOW_ALERT", state.alert, { root: true });
            state.isLoading = false;
            resolve(res);
          })
          .catch((err) => {
            console.error(err);
            state.alert.type = "error";
            state.alert.message = "Gagal mengubah data user";
            commit("SHOW_ALERT", state.alert, { root: true });
            state.isLoading = false;
            reject(err);
          });
      });
    },
    deleteUser({ commit, state }, nip) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({ url: `user/${nip}`, method: "DELETE" })
          .then((res) => {
            state.isLoading = false;
            state.alert.type = "success";
            state.alert.message = "Berhasil menghapus data user";
            commit("SHOW_ALERT", state.alert, { root: true });
            state.user = state.user.filter((item) => {
              return item.nip != nip;
            });
            resolve(res);
          })
          .catch((err) => {
            state.isLoading = false;
            state.alert.type = "error";
            state.alert.message = "Gagal menghapus data user";
            commit("SHOW_ALERT", state.alert, { root: true });
            reject(err);
          });
      });
    },
    // checkNip(_, data) {
    //   return new Promise((resolve, reject) => {
    //     axios({ url: "user/check-nip", method: "POST", data })
    //       .then((res) => {
    //         resolve(res);
    //       })
    //       .catch((err) => {
    //         reject(err);
    //       });
    //   });
    // },
    // checkEmail(_, data) {
    //   return new Promise((resolve, reject) => {
    //     axios({ url: "user/check-email", method: "POST", data })
    //       .then((res) => {
    //         resolve(res);
    //       })
    //       .catch((err) => {
    //         reject(err);
    //       });
    //   });
    // }
  }
};

export default user;
