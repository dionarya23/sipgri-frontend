import axios from "axios";

const eskul = {
  namespaced: true,
  state: {
    eskul: [],
    isLoading: false,
  },
  mutations: {
    SET_ESKUL(state, eskul) {
      state.eskul = eskul;
    },
    ADD_ESKUL(state, newData) {
      state.eskul.unshift(newData);
    },
  },
  actions: {
    getAllEskul({ commit, state }) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({
          method: "GET",
          url: "eskul/",
        })
          .then((res) => {
            commit("SET_ESKUL", res.data.data);
            state.isLoading = false;
            resolve(res);
          })
          .catch((err) => {
            console.log(err);
            state.isLoading = false;
            reject(err);
          });
      });
    },

    createEskul({ commit, state }, data) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({
          method: "POST",
          url: "eskul/",
          data,
        })
          .then((res) => {
            state.isLoading = false;
            const { data } = res.data;
            const payload = {
              type: "success",
              message: "Berhasil membuat eskul",
            };
            commit("SHOW_ALERT", payload, { root: true });
            commit("ADD_ESKUL", data);
            resolve(res);
          })
          .catch((err) => {
            console.error(err);
            state.isLoading = false;
            const payload = {
              type: "error",
              message: "Gagal memasukan eskul",
            };
            commit("SHOW_ALERT", payload, { root: true });
            reject(err);
          });
      });
    },

    updateEskul({ commit, state }, { id_esktrakulikuler, data }) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({
          method: "PUT",
          url: `eskul/${id_esktrakulikuler}/`,
          data,
        })
          .then((res) => {
            state.isLoading = false;
            const payload = {
              type: "success",
              message: "Berhasil memperbarui eskul",
            };
            commit("SHOW_ALERT", payload, { root: true });
            resolve(res);
          })
          .catch((err) => {
            console.error(err);
            state.isLoading = false;
            const payload = {
              type: "error",
              message: "Gagal memperbarui eskul",
            };
            commit("SHOW_ALERT", payload, { root: true });
            reject(err);
          });
      });
    },

    deleteEskul({ commit, state }, id_esktrakulikuler) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({
          method: "DELETE",
          url: `eskul/${id_esktrakulikuler}/`,
        })
          .then((res) => {
            state.isLoading = false;
            const payload = {
              type: "success",
              message: "berhasil menghapus eskul",
            };
            commit("SHOW_ALERT", payload, { root: true });
            resolve(res);
          })
          .catch((err) => {
            console.error(err);
            state.isLoading = false;
            const payload = {
              type: "warning",
              message:
                "Gagal menghapus eskul dikarenakan sudah terhubung dengan raport",
            };
            commit("SHOW_ALERT", payload, { root: true });
            reject(err);
          });
      });
    },
  },
};

export default eskul;
