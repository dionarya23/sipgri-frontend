import axios from "axios";

const raport = {
  namespaced: true,
  state: {
    isLoading: false,
    tanggal_lhbs: [],
    tahun_ajaran_aktif: {},
    isLoading: false,
  },
  mutations: {
    SET_TANGGAL_LHBS(state, tanggal_lhbs) {
      state.tanggal_lhbs = tanggal_lhbs;
    },
    SET_TAHUN_AJARAN(state, tahun_ajaran) {
      state.tahun_ajaran_aktif = { ...tahun_ajaran };
    },
  },
  actions: {
    getTanggalLHBSByStatusAktif({ commit, state }) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({
          method: "GET",
          url: "raport/tahun-ajaran/aktif/",
        })
          .then((res) => {
            state.isLoading = false;
            const { tanggal, tahun_ajaran } = res.data.data;
            commit("SET_TANGGAL_LHBS", tanggal);
            commit("SET_TAHUN_AJARAN", tahun_ajaran);
            resolve(res);
          })
          .catch((err) => {
            console.error(err);
            state.isLoading = false;
            const payload = {
              type: "error",
              message: "Gagal memuat tanggal lhbs",
            };
            commit("SHOW_ALERT", payload, { root: true });
            reject(err);
          });
      });
    },

    createTanggalLHBS({ commit, state }, data) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({
          method: "POST",
          url: "raport/",
          data,
        })
          .then((res) => {
            state.isLoading = false;
            const payload = {
              type: "success",
              message: "berhasil menambahkan tanggal lhbs",
            };
            commit("SHOW_ALERT", payload, { root: true });
            resolve(res);
          })
          .catch((err) => {
            console.error(err);
            const payload = {
              type: "error",
              message: "Gagal menambahkan tanggal lhbs",
            };
            commit("SHOW_ALERT", payload, { root: true });
            state.isLoading = false;
            reject(err);
          });
      });
    },
  },
  getters: {
    tahun_ajaran_aktif: (state) =>
      `${state.tahun_ajaran_aktif.tahun_awal}/${state.tahun_ajaran_aktif.tahun_akhir}`,
  },
};

export default raport;
