import axios from "axios";

const jadwal = {
  namespaced: true,
  state: {
    jadwal: [],
    isLoading: false,
    guru_mengajar: [],
    jadwal_guru: [],
    kelas: []
  },
  mutations: {
    SET_JADWAL(state, jadwal) {
      state.jadwal = jadwal;
    },
    SET_JADWAL_GURU(state, jadwal_guru) {
      state.jadwal_guru = jadwal_guru;
    },
    SET_GURU_MENGAJAR(state, guru_mengajar) {
      state.guru_mengajar = guru_mengajar;
    },
    ADD_JADWAL(state, newData) {
      state.jadwal.unshift(newData);
    },
    SET_KELAS(state, kelas) {
      state.kelas = kelas
    }
  },
  actions: {
    getJadwalGuru({commit}) {
      return new Promise((resolve, reject) => {
        axios({
          url: `jadwal/guru/mengajar/`,
          method: "GET"
        }).then(res => {
          const { data } = res.data
          commit("SET_JADWAL_GURU", data)
          resolve(res);
        }).catch(err => {
          console.log("error : ", err);
          reject(err);
        }); 
      });
    },

    getGuruMengajar({ commit }) {
      return new Promise((resolve, reject) => {
        axios({
          method: "GET",
          url: "user/guru/mata-pelajaran/",
        })
          .then((res) => {
            const { data } = res.data;
            commit("SET_GURU_MENGAJAR", data);
            resolve(data);
          })
          .catch((err) => {
            console.err(err);
            reject(err);
          });
      });
    },

    getJadwalByTahunAjaranAktif({ commit, state }) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({
          url: "jadwal/tahun-ajaran/aktif/",
          method: "GET",
        })
          .then((res) => {
            state.isLoading = false;
            const { data } = res.data;
            commit("SET_JADWAL", data.jadwal);
            commit("SET_KELAS", data.kelas);
            resolve(res);
          })
          .catch((err) => {
            state.isLoading = false;
            const payload = {
              type: "error",
              message: "Gagal mengambil data jadwal",
            };
            commit("SHOW_ALERT", payload, { root: true });
            reject(err);
          });
      });
    },

    updateJadwal({ commit, state }, payload) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({
          url: `jadwal/${payload.id_jadwal}/`,
          method: "PUT",
          data: payload.data,
        })
          .then((res) => {
            const payload = {
              type: true,
              type: "success",
              message: "Berhasil meperbarui data jadwal yang",
            };
            commit("SHOW_ALERT", payload, { root: true });
            state.isLoading = false;
            resolve(res);
          })
          .catch((err) => {
            console.log(err);
            state.isLoading = false;
            const payload = {
              type: true,
              type: "error",
              message: "Gagal meperbarui data jadwal yang, silahkan coba lagi",
            };
            commit("SHOW_ALERT", payload, { root: true });
            reject(err);
          });
      });
    },

    createJadwal({ commit, state }, data) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({
          url: "jadwal/",
          method: "POST",
          data,
        })
          .then((res) => {
            const { data } = res.data;
            commit("ADD_JADWAL", data);
            const payload = {
              type: true,
              type: "success",
              message: "Sukses membuat jadwal baru",
            };
            commit("SHOW_ALERT", payload, { root: true });
            console.log("jadwal store : ", data);
            state.isLoading = false;
            resolve(res);
          })
          .catch((err) => {
            console.log(err);
            state.isLoading = false;
            const payload = {
              type: true,
              type: "error",
              message:
                "Gagal memasukan data jadwal yang baru, silahkan coba lagi",
            };
            commit("SHOW_ALERT", payload, { root: true });
            reject(err);
          });
      });
    },

    deleteJadwal({commit, state}, id_jadwal) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({
          url: `jadwal/${id_jadwal}`,
          method: "DELETE"
        }).then(res => {
          const payload = {
            type: true,
            type: "success",
            message: "Sukses menghapus jadwal",
          };
          commit("SHOW_ALERT", payload, { root: true });
          state.isLoading = false;
          resolve(res);
        }).catch(err => {
          console.log(err);
          state.isLoading = false;
          const payload = {
            type: true,
            type: "error",
            message:
              "Gagal mengahapus data jadwal yang baru, silahkan coba lagi",
          };
          commit("SHOW_ALERT", payload, { root: true });
          reject(err);
        })
      });
    }
  },
};

export default jadwal;
