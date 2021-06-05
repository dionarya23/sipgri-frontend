import axios from "axios";

const pesertaDidik = {
  namespaced: true,
  state: {
    pesertaDidik: [],
    isLoading: false,
  },
  mutations: {
    SET_PESERTA_DIDIK(state, pesertaDidik) {
      state.pesertaDidik = pesertaDidik;
    },
  },
  actions: {
    getAllPesertaDidik({ commit, state, rootState }) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({
          url: "peserta-didik/",
          method: "GET",
          headers: { Authorization: rootState.auth.token },
        })
          .then((res) => {
            commit("SET_PESERTA_DIDIK", res.data.data);
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
    uploadExcelFile({ commit, state, rootState }, formData) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({
          method: "POST",
          url: "peserta-didik/export/",
          data: formData,
          headers: {
            Authorization: rootState.auth.token,
            "Content-Type": "multipart/form-data",
          },
        })
          .then((res) => {
            console.log("result : ", res);
            const payload = {
              type: "success",
              message: "Berhasil menambah peserta didik",
            };
            commit("SHOW_ALERT", payload, { root: true });
            state.isLoading = false;
            resolve(res);
          })
          .catch((err) => {
            console.error(err);
            const payload = {
              type: "error",
              message: "Terjadi Kesalahan saat mengupload",
            };
            commit("SHOW_ALERT", payload, { root: true });
            state.isLoading = false;
            reject(err);
          });
      });
    },
  },
};

export default pesertaDidik;
