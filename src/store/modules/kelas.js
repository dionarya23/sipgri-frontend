import axios from "axios";

const kelas = {
  namespaced: true,
  state: {
    kelas: [],
    calonWaliKelas: [],
    isLoading: false,
  },
  mutations: {
    SET_KELAS(state, kelas) {
      state.kelas = kelas;
    },
    ADD_KELAS(state, newData) {
      state.kelas.unshift(newData);
    },
    SET_CALON_WALI_KELAS(state, calonWaliKelas) {
      state.calonWaliKelas = calonWaliKelas;
    }
  },
  actions: {
    getAllKelas({ commit, state }) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({
          method: "GET",
          url: "kelas/",
        })
          .then((res) => {
            commit("SET_KELAS", res.data.data);
            state.isLoading = false;
            resolve(res);
          })
          .catch((err) => {
            console.log(err);
            state.isLoading = false;
            reject(err);
          });
      });
    },

    getCalonWaliKelas({ commit }) {
      return new Promise((resolve, reject) => {
        axios({
          method: "GET",
          url: "user/calon/wali-kelas/"
        }).then(res => {
          commit("SET_CALON_WALI_KELAS", res.data.data);
          resolve(res);
        }).catch(err => {
          console.error(err);
          reject(err);
        }) 
      });
    },

    createKelas({ commit, state }, data) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({
          method: "POST",
          url: "kelas/",
          data,
        })
          .then((res) => {
            state.isLoading = false;
            const { data } = res.data;
            const payload = {
              type: "success",
              message: "Berhasil membuat kelas",
            };
            commit("SHOW_ALERT", payload, { root: true });
            commit("ADD_KELAS", data);
            resolve(res);
          })
          .catch((err) => {
            console.error(err);
            state.isLoading = false;
            const payload = {
              type: "error",
              message: "Gagal memasukan kelas",
            };
            commit("SHOW_ALERT", payload, { root: true });
            reject(err);
          });
      });
    },

    updateKelas({ commit, state }, { id_kelas, data }) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({
          method: "PUT",
          url: `kelas/${id_kelas}/`,
          data,
        })
          .then((res) => {
            state.isLoading = false;
            const payload = {
              type: "success",
              message: "Berhasil memperbarui kelas",
            };
            commit("SHOW_ALERT", payload, { root: true });
            resolve(res);
          })
          .catch((err) => {
            console.error(err);
            state.isLoading = false;
            const payload = {
              type: "error",
              message: "Gagal memperbarui kelas",
            };
            commit("SHOW_ALERT", payload, { root: true });
            reject(err);
          });
      });
    },

    deleteKelas({ commit, state }, id_kelas) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({
          method: "DELETE",
          url: `kelas/${id_kelas}/`,
        })
          .then((res) => {
            state.isLoading = false;
            const payload = {
              type: "success",
              message: "berhasil menghapus kelas",
            };
            commit("SHOW_ALERT", payload, { root: true });
            resolve(res);
          })
          .catch((err) => {
            console.error(err);
            state.isLoading = false;
            const payload = {
              type: "warning",
              message:
                "Gagal menghapus kelas dikarenakan sudah terhubung dengan raport",
            };
            commit("SHOW_ALERT", payload, { root: true });
            reject(err);
          });
      });
    },
  },
};

export default kelas;
