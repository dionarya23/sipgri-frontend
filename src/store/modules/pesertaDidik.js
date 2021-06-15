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
    
    getAllPesertaDidik({ commit, state }) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({
          url: "peserta-didik/",
          method: "GET",
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

    uploadExcelFile({ commit, state }, formData) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({
          method: "POST",
          url: "peserta-didik/export/",
          data: formData,
          headers: {
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

    createNewPesertaDidik({ commit, state }, newData) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({
          method: "POST",
          url: "peserta-didik/",
          data: newData,
        })
          .then((res) => {
            const payload = {
              type: "success",
              message: "Berhasil menambah data peserta didik",
            };
            commit("SHOW_ALERT", payload, { root: true });
            state.isLoading = false;
            resolve(res);
          })
          .catch((err) => {
            console.error(err);
            const payload = {
              type: "error",
              message: "Terjadi Kesalahan saat menambah data baru",
            };
            commit("SHOW_ALERT", payload, { root: true });
            state.isLoading = false;
            reject(err);
          });
      });
    },

    updatePesertaDidik({ commit, state }, {updatedData}) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        delete updatedData.no;
        axios({
          method: "PUT",
          url: `peserta-didik/${updatedData.id_peserta_didik}/`,
          data: updatedData,
        }).then((res) => {
          const payload = {
            type: "success",
            message: "Berhasil mengubah data peserta didik",
          };
          commit("SHOW_ALERT", payload, { root: true });

          state.isLoading = false;
          resolve(res);
        }).catch((err) => {
          console.error(err);
          const payload = {
            type: "error",
            message: "Terjadi Kesalahan saat mengubah data",
          };
          commit("SHOW_ALERT", payload, { root: true });
          state.isLoading = false;
          reject(err);
        });
      });
    }
  },

  checkAvailable(_, data) {
    return  new Promise((resolve, reject) => {
      axios({
        method: "POST",
        url : "peserta-didik/check/available/",
        data
      }).then(res => resolve(res))
      .catch(err => reject(err))
    })
  }
};

export default pesertaDidik;
