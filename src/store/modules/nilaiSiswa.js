import axios from "axios";

const nilaiSiswa = {
  namespaced: true,
  state: {
    listKelas: [],
    isLoading: false,
    raportStatusAktif: {},
  },
  mutations: {
    SET_LIST_KELAS(state, listKelas) {
      state.listKelas = listKelas;
    },
    SET_RAPORT_STATUS_AKTIF(state, raport) {
      state.raportStatusAktif = raport;
    },
  },

  actions: {
    getListKelas({ commit, state }) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({
          url: "jadwal/kelas/guru/",
          method: "GET",
        })
          .then((res) => {
            state.isLoading = false;
            commit("SET_LIST_KELAS", res.data.data);
            resolve(res);
          })
          .catch((err) => {
            state.isLoading = false;
            const payload = {
              isShow: true,
              type: "error",
              message: "Gagal mengambil list kelas",
            };
            commit("SHOW_ALERT", payload, { root: true });
            reject(err);
          });
      });
    },

    getRaportStatusPelaksanaanAktif({ commit }) {
      return new Promise((resolve, reject) => {
        axios({
          url: "raport/status-pelaksanaan/aktif/",
          method: "GET",
        })
          .then((res) => {
            commit("SET_RAPORT_STATUS_AKTIF", res.data.data);
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
  },
};

export default nilaiSiswa;
