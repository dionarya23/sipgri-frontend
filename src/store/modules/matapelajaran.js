import axios from "axios";

const matapelajaran = {
  namespaced: true,
  state: {
    mataPelajaran: [],
    isLoading: false,
    mataPelajaranGuru: []
  },
  mutations: {
    SET_MAPEL(state, mata_pelajaran) {
      state.mataPelajaran = mata_pelajaran;
    },
    SET_MATA_PELAJARAN_GURU(state, mata_pelajaran) {
      state.mataPelajaranGuru = mata_pelajaran;
    },
    ADD_MAPEL(state, mata_pelajaran) {
      state.mataPelajaran.unshift(mata_pelajaran);
    }
  },
  actions: {
    getAllMataPelajaran({ commit, state}) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({
          url: "mata-pelajaran/",
          method: "GET",
        })
          .then((res) => {
            commit("SET_MAPEL", res.data.data);
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

    getMataPelajaranGuru({ commit, state}) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({
          url: "mata-pelajaran/pengajar/guru/"
        }).then(res => {
          state.isLoading = false;
          const { data } = res.data;
          commit("SET_MATA_PELAJARAN_GURU", data);
          resolve(res);
        }).catch(err => {
          state.isLoading = false
          reject(err);
        });
      });
    },

    createNewMataPelajaran({ commit, state}, data) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({
          method: "POST",
          url: "mata-pelajaran/",
          data
        }).then(res => {
          state.isLoading = false;
          const { data } = res.data
          const payload = {
            type: "success",
            message: "Berhasil membuat mata pelajaran"
          };
          commit("SHOW_ALERT", payload, { root: true });
          commit("ADD_MAPEL", data);
          resolve(res);
        }).catch(err => {
          console.error(err);
          state.isLoading = false;
          const payload = {
            type: "error",
            message: "Gagal memasukan mata pelajaran"
          };
          commit("SHOW_ALERT", payload, { root: true });
          reject(err);
        }) 
      });
    },

    updateMataPelajaran({ commit, state}, {id_mata_pelajaran, data}) {
      state.isLoading = true
      return new Promise((resolve, reject) => {
        axios({
          method: "PUT",
          url : `mata-pelajaran/${id_mata_pelajaran}/`,
          data
        }).then(res => {
          state.isLoading = false;
          const payload = {
            type: "success",
            message: "Berhasil memperbarui mata pelajaran"
          };
          commit("SHOW_ALERT", payload, { root: true });
          resolve(res);
        }).catch(err => {
          console.error(err);
          state.isLoading = false;
          const payload = {
            type: "error",
            message: "Gagal memperbarui mata pelajaran"
          };
          commit("SHOW_ALERT", payload, { root: true });
          reject(err);
        });
      });
    },

    deleteMataPelajaran({commit, state}, id_mata_pelajaran) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({
          method: "DELETE",
          url: `mata-pelajaran/${id_mata_pelajaran}/`
        }).then(res => {
          state.isLoading = false;
          const payload = {
            type: "success",
            message: "berhasil menghapus mata pelajaran"
          };
          commit("SHOW_ALERT", payload, { root: true });
          resolve(res);
        }).catch(err => {
          console.error(err);
          state.isLoading = false;
          const payload = {
            type: "warning",
            message: "Gagal menghapus mata pelajaran dikarenakan sudah terhubung dengan raport"
          };
          commit("SHOW_ALERT", payload, { root: true });
          reject(err);
        })
      });
    }
  }
};

export default matapelajaran;
