import axios from "axios";

const nilaiEskul = {
  namespaced: true,
  state: {
    isLoading: false,
    anakWali: {},
  },
  mutations: {
    SET_ANAK_WALI(state, pesertaDidik) {
      state.anakWali = pesertaDidik;
    },
  },
  actions: {
    getAnakWali({ commit, state }) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({
          url: `nilai-eskul/anak-wali/get-wali-kelas/`,
          method: "GET",
        })
          .then((res) => {
            state.isLoading = false;
            commit("SET_ANAK_WALI", res.data.data);
            resolve(res);
          })
          .catch((err) => {
            state.isLoading = false;
            const payload = {
              isShow: true,
              type: "error",
              message: "Gagal mengambil anak wali",
            };

            commit("SHOW_ALERT", payload, { root: true });
            reject(err);
          });
      });
    },

    cretePenilaianEskul({commit, state}, data) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({
          url: "nilai-eskul/",
          method: "POST",
          data
        }).then(res => {
          state.isLoading = false;          
          const payload = {
            isShow: true,
            type: "success",
            message: "Berhasil meperbarui nilai eskul",
          };
          commit("SHOW_ALERT", payload, { root: true });
          resolve(res);
        }).catch(err => {
          state.isLoading = false;

          const payload = {
            isShow: true,
            type: "error",
            message: "Gagal meperbarui nilai eskul",
          };

          commit("SHOW_ALERT", payload, { root: true });
          reject(err);
        })
      });
    }
  },
};

export default nilaiEskul;
