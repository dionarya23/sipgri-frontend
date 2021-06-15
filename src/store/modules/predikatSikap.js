import axios from "axios";

const predikatSikap = {
  namespaced: true,
  state: {
    predikatSikap: [],
    isLoading: false,
  },
  mutations: {
    SET_PREDIKAT_SIKAP(state, predikatSikap) {
      state.predikatSikap = predikatSikap;
    },
    ADD_PREDIKAT_SIKAP(state, newData) {
      state.predikatSikap.unshift(newData);
    },
  },
  actions: {
    getAllPredikatSikap({ commit, state }) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({
          method: "GET",
          url: "predikat-sikap/",
        })
          .then((res) => {
            commit("SET_PREDIKAT_SIKAP", res.data.data);
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

    createPredikatSikap({ commit, state }, data) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({
          method: "POST",
          url: "predikat-sikap/",
          data,
        })
          .then((res) => {
            state.isLoading = false;
            const { data } = res.data;
            const payload = {
              type: "success",
              message: "Berhasil membuat predikat sikap",
            };
            commit("SHOW_ALERT", payload, { root: true });
            commit("ADD_PREDIKAT_SIKAP", data);
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

    updatePredikatSikap({ commit, state }, { id_predikat_sikap, data }) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({
          method: "PUT",
          url: `predikat-sikap/${id_predikat_sikap}/`,
          data,
        })
          .then((res) => {
            state.isLoading = false;
            const payload = {
              type: "success",
              message: "Berhasil memperbarui predikat sikap",
            };
            commit("SHOW_ALERT", payload, { root: true });
            resolve(res);
          })
          .catch((err) => {
            console.error(err);
            state.isLoading = false;
            const payload = {
              type: "error",
              message: "Gagal memperbarui predikat sikap",
            };
            commit("SHOW_ALERT", payload, { root: true });
            reject(err);
          });
      });
    },

    deletePredikatSikap({ commit, state }, id_predikat_sikap) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({
          method: "DELETE",
          url: `predikat-sikap/${id_predikat_sikap}/`,
        })
          .then((res) => {
            state.isLoading = false;
            const payload = {
              type: "success",
              message: "berhasil menghapus predikat sikap",
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
                "Gagal menghapus predikat sikap",
            };
            commit("SHOW_ALERT", payload, { root: true });
            reject(err);
          });
      });
    },
  },
};

export default predikatSikap;
