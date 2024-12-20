import axios from "axios";

const absensi = {
  namespaced: true,
  state: {
    isLoading: false,
    tgl_lhbs: [],
    kelas_diampu: {},
    detail_kelas: {},
    raport: {}
  },
  mutations: {
    SET_TGL_LHBS_RAPORT(state, tglHBSRaport) {
      state.tgl_lhbs = tglHBSRaport;
    },
    SET_KELAS_DIAMPU(state, kelas) {
      state.kelas_diampu = kelas;
    },
    SET_PESERTA_DIDIK(state, detail_kelas) {
      state.detail_kelas = detail_kelas;
    },
    SET_RAPORT(state, raport) {
      state.raport = raport;
    }
  },
  actions: {
    getRaport({ commit }) {
      return new Promise((resolve, reject) => {
        axios({
          url: `raport/status-pelaksanaan/aktif/`,
          method: "GET"
        })
          .then((res) => {
            commit("SET_RAPORT", res.data.data);
            console.log("absensi raport : ", res.data.data);
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },

    getTanggalLHBS({ commit, state }) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({
          method: "GET",
          url: "raport/tahun-ajaran/aktif/"
        })
          .then((res) => {
            state.isLoading = false;
            commit("SET_TGL_LHBS_RAPORT", res.data.data.tanggal);
            resolve(res);
          })
          .catch((err) => {
            state.isLoading = false;
            reject(err);
          });
      });
    },

    getKelasYangDiampu({ commit }) {
      return new Promise((resolve, reject) => {
        axios({
          method: "GET",
          url: "peserta-didik/by/wali-kelas/"
        })
          .then((res) => {
            commit("SET_KELAS_DIAMPU", res.data.data);
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },

    createAbsensi({ commit, state }, data) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({
          method: "POST",
          url: "absensi/",
          data
        })
          .then((res) => {
            state.isLoading = false;
            const payload = {
              isShow: true,
              type: "success",
              message: "berhasil menambahkan absensi"
            };
            commit("SHOW_ALERT", payload, { root: true });
            resolve(res);
          })
          .catch((err) => {
            state.isLoading = false;
            const payload = {
              isShow: true,
              type: "error",
              message: "gagal menambahkan absensi"
            };
            commit("SHOW_ALERT", payload, { root: true });
            reject(err);
          });
      });
    },

    updateAbsensi({ commit, state }, { id_absensi, data }) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({
          method: "PUT",
          url: `absensi/${id_absensi}/`,
          data
        })
          .then((res) => {
            state.isLoading = false;
            const payload = {
              isShow: true,
              type: "success",
              message: "berhasil mengupdate absensi"
            };
            commit("SHOW_ALERT", payload, { root: true });
            resolve(res);
          })
          .catch((err) => {
            state.isLoading = false;
            const payload = {
              isShow: true,
              type: "error",
              message: "gagal mengupdate absensi"
            };
            commit("SHOW_ALERT", payload, { root: true });
            reject(err);
          });
      });
    },

    getAbsensiByWaliKelas({ commit, state }) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({
          method: "GET",
          url: `absensi/wali-kelas/`
        })
          .then((res) => {
            state.isLoading = false;
            commit("SET_PESERTA_DIDIK", res.data.data);
            console.log("Absensi : ", res.data.data);
            resolve(res);
          })
          .catch((err) => {
            state.isLoading = false;
            const payload = {
              isShow: true,
              type: "error",
              message: "gagal mengambil peserta didik"
            };
            commit("SHOW_ALERT", payload, { root: true });
            reject(err);
          });
      });
    }
  }
};

export default absensi;
