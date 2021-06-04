import axios from "axios";

const user = {
  namespaced: true,
  state: {
    mengajar: [
      {
        kode_mengajar: "",
        id_mata_pelajaran: 0
      }
    ],
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
    },
    ADD_MENGAJAR(state, data) {
      state.mengajar.push(data);
    },
    REMOVE_MENGAJAR(state) {
      state.mengajar.pop();
    },
    UPDATE_MENGAJAR(state, data) {
      state.mengajar[data.index] = data.mengajar;
    }
  },
  actions: {
    addMengajar({ commit }) {
      commit("ADD_MENGAJAR", {
        kode_mengajar: "",
        id_mata_pelajaran: 0
      });
    },
    removeMengajar({ commit }) {
      commit("REMOVE_MENGAJAR");
    },
    updateMengajar({ commit }, data) {
      commit("UPDATE_MENGAJAR", data);
    },
    getAllUser({ commit, state, rootState }) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({
          url: "user/",
          method: "GET",
          headers: { Authorization: rootState.auth.token }
        })
          .then((res) => {
            res.data.data.map((e) => {
              let string_array = e.type_user.split("_");
              if (string_array.length > 1) {
                e.type_user = `${string_array[0].charAt(0).toUpperCase() +
                  string_array[0].slice(1)} ${string_array[1]
                  .charAt(0)
                  .toUpperCase() + string_array[1].slice(1)}`;
              } else {
                e.type_user = `${e.type_user.charAt(0).toUpperCase() +
                  e.type_user.slice(1)}`;
              }
            });
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
    }
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
