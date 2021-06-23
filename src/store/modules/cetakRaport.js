import axios from "axios";

const cetakRaport = {
  namespaced: true,
  state: {
    isLoading: false,
    listKelas: [],
    raportAktif: {},
    kelas: {},
  },
  mutations: {
    SET_LIST_KELAS(state, listKelas) {
      state.listKelas = listKelas;
    },
    SET_RAPORT_KELAS(state, raport) {
      state.raportAktif = raport;
    },
    SET_KELAS(state, kelas) {
      state.kelas = kelas;
    },
  },

  actions: {
    getListKelas({ commit, state }) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({
          url: "kelas/",
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
              message: "Gagagl mengambil list kelas",
            };
            commit("SHOW_ALERT", payload, { root: true });
            reject(err);
          });
      });
    },

    getRaportAktif({ commit }) {
      return new Promise((resolve, reject) => {
        axios({
          url: "raport/status-pelaksanaan/aktif/",
          method: "GET",
        })
          .then((res) => {
            commit("SET_RAPORT_KELAS", res.data.data);
            resolve(res);
          })
          .catch((err) => {
            const payload = {
              isShow: true,
              type: "error",
              message: "Gagagl mengambil raport aktif",
            };
            commit("SHOW_ALERT", payload, { root: true });
            reject(err);
          });
      });
    },

    getDetailKelas({ commit, state }, id_kelas) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({
          url: `kelas/${id_kelas}/`,
          method: "GET",
        })
          .then((res) => {
            state.isLoading = false;
            commit("SET_KELAS", res.data.data);
            resolve(res);
          })
          .catch((err) => {
            state.isLoading = false;
            const payload = {
              isShow: true,
              type: "error",
              message: "Gagagl mengambil detail kelas",
            };
            commit("SHOW_ALERT", payload, { root: true });
            reject(err);
          });
      });
    },
  },
};

export default cetakRaport;
