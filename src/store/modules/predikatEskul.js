import axios from "axios";

const predikatEskul = {
  namespaced: true,
  state: {
    eskul: [],
    isLoading: false,
  },
  mutations: {
    SET_ESKUL(state, eskul) {
      state.eskul = eskul;
    },
  },

  actions: {
    getAllPredikatEskul({ commit, state }) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({
          url: "eskul/",
          method: "GET",
        })
          .then((res) => {
            commit("SET_ESKUL", res.data.data);
            state.isLoading = false;
            resolve(res);
          })
          .catch((err) => {
            console.error(err);
            state.isLoading = false;
            const payload = {
              type: "error",
              message: "Terjadi Kesalahan saat mengambil data",
            };
            commit("SHOW_ALERT", payload, { root: true });
            reject(err);
          });
      });
    },

    updateCatatanPredikatNilaiEskul(
      { commit, state },
      { id_predikat_eskul, catatan }
    ) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({
          url: `predikat-eskul/${id_predikat_eskul}/`,
          method: "PUT",
          data: {
            catatan,
          },
        })
          .then((res) => {
            state.isLoading = false;
            const payload = {
              type: "success",
              message: "Berhasil memperbarui catatan nilai eskul",
            };
            commit("SHOW_ALERT", payload, { root: true });
            resolve(res);
          })
          .catch((err) => {
            console.error(err);
            state.isLoading = false;
            const payload = {
              type: "error",
              message: "Gagal memperbarui catatan nilai eskul",
            };
            commit("SHOW_ALERT", payload, { root: true });
            reject(err);
          });
      });
    },
  },
};

export default predikatEskul;
