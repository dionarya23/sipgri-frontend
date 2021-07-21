import axios from "axios";

const catatanWaliKelas = {
  namespaced: true,
  state: {
    isLoading: false,
    raport: {},
    catatan: [],
    tableCatatan: []
  },
  mutations: {
    SET_TABLE_CATATAN(state, data) {
      state.tableCatatan = data;
    },
    SET_RAPORT(state, raport) {
      state.catatan = raport.tanggal.filter((e) => {
        return (
          e.jenis_penilaian === "Penilaian Akhir Semester" ||
          e.jenis_penilaian === "Penilaian Akhir Tahun"
        );
      });
      state.raport = raport;
    }
  },
  actions: {
    getRaport({ commit, state }) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({
          url: "raport/tahun-ajaran/aktif",
          method: "GET"
        })
          .then((res) => {
            state.isLoading = false;
            commit("SET_RAPORT", res.data.data);
            resolve(res);
          })
          .catch((err) => {
            state.isLoading = false;
            reject(err);
          });
      });
    },
    getTableCatatan({ commit, state }) {
      state.isLoading = true; 
      return new Promise((resolve, reject) => {
        axios({
          url: `catatan-wali-kelas/peserta-didik/wali-kelas`,
          method: "GET"
        })
          .then((res) => {
            state.isLoading = false;
            commit("SET_TABLE_CATATAN", res.data.data);
            console.log(res.data.data);
            resolve(res);
          })
          .catch((err) => {
            state.isLoading = false;
            reject(err);
          });
      });
    },
    createCatatanForAll({ commit, state }, data) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({
          method: "POST",
          url: "catatan-wali-kelas/bulk",
          data
        })
          .then((res) => {
            state.isLoading = false;
            const payload = {
              isShow: true,
              type: "success",
              message: "berhasil menambahkan catatan"
            };
            commit("SHOW_ALERT", payload, { root: true });
            resolve(res);
          })
          .catch((err) => {
            state.isLoading = false;
            const payload = {
              isShow: true,
              type: "error",
              message: "gagal menambahkan catatan"
            };
            commit("SHOW_ALERT", payload, { root: true });
            reject(err);
          });
      });
    },
    createCatatan({ commit, state }, data) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({
          method: "POST",
          url: "catatan-wali-kelas",
          data
        })
          .then((res) => {
            state.isLoading = false;
            const payload = {
              isShow: true,
              type: "success",
              message: "berhasil menambahkan catatan"
            };
            commit("SHOW_ALERT", payload, { root: true });
            resolve(res);
          })
          .catch((err) => {
            state.isLoading = false;
            const payload = {
              isShow: true,
              type: "error",
              message: "gagal menambahkan catatan"
            };
            commit("SHOW_ALERT", payload, { root: true });
            reject(err);
          });
      });
    },
    updateCatatan({ commit, state }, { id_catatan, data }) {
      state.isLoading = true;
      console.log(id_catatan, data);
      return new Promise((resolve, reject) => {
        axios({
          method: "PUT",
          url: `catatan-wali-kelas/${id_catatan}/`,
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
    }
  }
};

export default catatanWaliKelas;
