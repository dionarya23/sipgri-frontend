import axios from "axios";

const pesertaDidik = {
  namespaced: true,
  state: {
    pesertaDidik: [],
    isLoading: false,
    isAlreadyNaikKelas: localStorage.getItem("naikKelas"),
  },
  mutations: {
    SET_PESERTA_DIDIK(state, pesertaDidik) {
      state.pesertaDidik = [];
      state.pesertaDidik = pesertaDidik;
    },
    SET_ALREADY_NAIK_KELAS(state, data){
      localStorage.naikKelas = data
      state.isAlreadyNaikKelas = data;
    }
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

    naikKelas({commit, state}) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({
          url: "peserta-didik/kenaikan/kelas/",
          method: "GET"
        }).then(res => {
          state.isLoading = false;
          const { pesertaDidikNew, raportAktif } = res.data.data
          commit("SET_PESERTA_DIDIK", pesertaDidikNew);
          commit("SET_ALREADY_NAIK_KELAS", `true_${raportAktif.jenis_penilaian}${raportAktif.id_raport}`)
          const payload = {
            type: "success",
            message: "Sukses menaikan kelas siswa",
          };
          commit("SHOW_ALERT", payload, { root: true });
          resolve(res);
        }).catch(err => {
            console.error(err);
            state.isLoading = false;
            const payload = {
              type: "error",
              message: "Terjadi Kesalahan saat menaikan tingkat kelas siswa",
            };
            commit("SHOW_ALERT", payload, { root: true });
            reject(err);
        })
      })
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
    },
  
    deletePesertaDidik({commit, state}, id_peserta_didik) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({
          method: "DELETE",
          url: `peserta-didik/${id_peserta_didik}/`
        }).then((res) => {
          const payload = {
            type: "success",
            message: "Berhasil menghapus data peserta didik",
          };
          commit("SHOW_ALERT", payload, { root: true });
          state.isLoading = false;
          state.pesertaDidik = state.pesertaDidik.filter((item) => {
            return item.id_peserta_didik != id_peserta_didik;
          });
          resolve(res);
        }).catch((err) => {
          console.error(err);
          const payload = {
            type: "error",
            message: "Terjadi Kesalahan saat menghapus data",
          };
          commit("SHOW_ALERT", payload, { root: true });
          state.isLoading = false;
          reject(err);
        });
      });
    }
  },
};

export default pesertaDidik;
