import axios from "axios";

const nilaiSiswa = {
  namespaced: true,
  state: {
    listKelas: [],
    isLoading: false,
    raportStatusAktif: {},
    pesertaDidikNilai: {},
    raportAktif: {},
    detailMengajar: {},
    nilaiPredikat: [],
  },
  mutations: {
    SET_LIST_KELAS(state, listKelas) {
      state.listKelas = listKelas;
    },
    SET_RAPORT_STATUS_AKTIF(state, raport) {
      state.raportStatusAktif = raport;
    },
    SET_PESERTA_DIDIK_NILAI(state, pesertaDidikNilai) {
      state.pesertaDidikNilai = pesertaDidikNilai;
    },
    SET_RAPORT_AKTIF(state, raport) {
      state.raportAktif = raport;
    },
    SET_DETAIL_MENGAJAR(state, mengajar) {
      state.detailMengajar = mengajar;
    },
    SET_NILAI_PREDIKAT(state, nilaiPredikat) {
      state.nilaiPredikat = nilaiPredikat;
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

    getNilaiPredikat({ commit }) {
      return new Promise((resolve, reject) => {
        axios({
          url: "nilai-predikat/",
          method: "GET",
        })
          .then((res) => {
            commit("SET_NILAI_PREDIKAT", res.data.data);
            resolve(res);
          })
          .catch((err) => {
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

    createPenilaian({commit, state}, data) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({
          url: "penilaian/",
          method: "POST",
          data
        }).then(res => {
          state.isLoading = false;
          const payload = {
            isShow: true,
            type: "success",
            message: "Berhasil memperbarui nilai matapelajaran",
          };
          commit("SHOW_ALERT", payload, { root: true });
          resolve(res);
        }).catch(err => {
          state.isLoading = false;
          const payload = {
            isShow: true,
            type: "error",
            message: "Gagal memperbarui nilai matapelajaran",
          };
          commit("SHOW_ALERT", payload, { root: true });
          reject(err);
        })
      });
    },

    getListPesertaDidik({ commit, state }, { kode_mengajar, id_kelas }) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({
          url: `penilaian/peserta-didik/${kode_mengajar}/${id_kelas}/`,
          method: "GET",
        })
          .then((res) => {
            state.isLoading = false;
            commit("SET_PESERTA_DIDIK_NILAI", res.data.data.kelas);
            commit("SET_RAPORT_AKTIF", res.data.data.raport);
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

    getDetailMengajar({ commit }, kode_mengajar) {
      return new Promise((resolve, reject) => {
        axios({
          method: "GET",
          url: `mengajar/${kode_mengajar}/`,
        })
          .then((res) => {
            commit("SET_DETAIL_MENGAJAR", res.data.data);
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
