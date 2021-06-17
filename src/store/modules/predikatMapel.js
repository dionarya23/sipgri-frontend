import axios from "axios";

const predikatMapel = {
  namespaced: true,
  state: {
    predikatMapel: [],
    firstMapel: "",
    isLoading: false,
  },
  mutations: {
    SET_PREDIKAT_MAPEL(state, predikatMapel) {
      state.firstMapel = predikatMapel[0].mata_pelajaran
      state.predikatMapel = predikatMapel;
    },
  },

  actions: {
    getAllPredikatMapel({ commit, state }) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({
          url: "mata-pelajaran/pengajar/guru/",
          method: "GET",
        })
          .then((res) => {
            commit("SET_PREDIKAT_MAPEL", res.data.data);
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

    updatePredikatMapel({ commit, state }, { id_predikat_mapel, updatedData }) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        delete updatedData.no;
        axios({
          method: "PUT",
          url: `predikat-mapel/${id_predikat_mapel}/`,
          data: updatedData,
        })
          .then((res) => {
            const payload = {
              type: "success",
              message: "Berhasil mengubah predikat mata pelajaran",
            };
            commit("SHOW_ALERT", payload, { root: true });

            state.isLoading = false;
            resolve(res);
          })
          .catch((err) => {
            console.error(err);
            const payload = {
              type: "error",
              message: "Terjadi Kesalahan saat mengubah predikat mata pelajaran",
            };
            commit("SHOW_ALERT", payload, { root: true });
            state.isLoading = false;
            reject(err);
          });
      });
    },
  },
};

export default predikatMapel;
