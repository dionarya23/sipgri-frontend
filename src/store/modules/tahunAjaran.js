import axios from "axios";

const tahunAjaran = {
  namespaced: true,
  state: {
    isLoading: false,
    tahunAjaran: [],
    tahunAjaranAktif: {},
  },
  mutations: {
    SET_TAHUN_AJARAN(state, tahunAjaran) {
      state.tahunAjaran = tahunAjaran;
    },
    ADD_TAHUN_AJARAN(state, newTahunAjaran) {
      state.tahunAjaran.push(newTahunAjaran);
    },
    UPDATE_TAHUN_AJARAN(state, id_tahun_ajaran) {
      state.tahunAjaran.map((tahun) => {
        if (tahun.id_tahun_ajaran === id_tahun_ajaran) {
          tahun.status_aktif = "Aktif";
        } else {
          tahun.status_aktif = "Tidak Aktif";
        }
      });
    },
    DELETE_TAHUN_AJARAN(state, id_tahun_ajaran) {
      state.tahunAjaran = state.tahunAjaran.filter(
        (tahun_ajaran) => tahun_ajaran.id_tahun_ajaran !== id_tahun_ajaran
      );
    },
    SET_TAHUN_AJARAN_AKTIF(state, payload) {
      state.tahunAjaranAktif = payload;
    },
  },
  actions: {
    createTahunAjaran({ commit, state }, newData) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({
          url: "tahun-ajaran/",
          method: "POST",
          data: newData,
        })
          .then((res) => {
            const { data } = res.data;
            data.tahun_ajaran = `${data.tahun_awal}/${data.tahun_akhir}`;
            data.status_aktif = "Tidak Aktif";
            commit("ADD_TAHUN_AJARAN", data);
            const payload = {
              type: "success",
              message: "Tahun Ajaran berhasil ditambahkan",
            };
            commit("SHOW_ALERT", payload, { root: true });
            state.isLoading = false;
            resolve(res);
          })
          .catch((err) => {
            console.error(err);
            const payload = {
              type: "error",
              message: "Tahun Ajaran sudah ditambahkan",
            };
            commit("SHOW_ALERT", payload, { root: true });
            state.isLoading = false;
            reject(err);
          });
      });
    },
    getTahunAjaranAktif({ commit }) {
      return new Promise((resolve, reject) => {
        axios({
          url: "/tahun-ajaran/status/aktif/",
          method: "GET",
        })
          .then((res) => {
            const { data } = res.data;
            commit("SET_TAHUN_AJARAN_AKTIF", data);
            resolve(res);
          })
          .catch((err) => {
            console.error("erorr tahun ajaran aktif : ", err);
            reject(err);
          });
      });
    },
    getAllTahunAjaran({ commit, state }) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({
          url: "tahun-ajaran/",
          method: "GET",
        })
          .then((res) => {
            const { data } = res.data;
            data
              .slice(0)
              .reverse()
              .map((tahun_ajaran, _) => {
                tahun_ajaran.tahun_ajaran = `${tahun_ajaran.tahun_awal}/${tahun_ajaran.tahun_akhir}`;
                let string_array = tahun_ajaran.status_aktif.split("_");
                if (string_array.length > 1) {
                  tahun_ajaran.status_aktif = `${string_array[0]
                    .charAt(0)
                    .toUpperCase() +
                    string_array[0].slice(1)} ${string_array[1]
                    .charAt(0)
                    .toUpperCase() + string_array[1].slice(1)}`;
                } else {
                  tahun_ajaran.status_aktif = `${tahun_ajaran.status_aktif
                    .charAt(0)
                    .toUpperCase() + tahun_ajaran.status_aktif.slice(1)}`;
                }
              });
            commit("SET_TAHUN_AJARAN", data);
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
    updateTahunAjaran({ commit, state }, id_tahun_ajaran) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({
          url: `tahun-ajaran/${id_tahun_ajaran}`,
          method: "PUT",
          data: {
            status_aktif: "aktif",
          },
        })
          .then((res) => {
            commit("UPDATE_TAHUN_AJARAN", id_tahun_ajaran);
            state.isLoading = false;
            const payload = {
              type: "success",
              message: "Tahun Ajaran aktif berhasil diubah",
            };
            commit("SHOW_ALERT", payload, { root: true });
            resolve(res);
          })
          .catch((err) => {
            console.error(err);
            state.isLoading = false;
            reject(err);
          });
      });
    },
    deleteTahunAjaran({ commit, state }, id_tahun_ajaran) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({
          url: `tahun-ajaran/${id_tahun_ajaran}`,
          method: "DELETE",
        })
          .then((res) => {
            commit("DELETE_TAHUN_AJARAN", id_tahun_ajaran);
            const payload = {
              type: "success",
              message: "Tahun Ajaran Berhasil dihapus",
            };
            commit("SHOW_ALERT", payload, { root: true });
            state.isLoading = false;
            resolve(res);
          })
          .catch((err) => {
            console.error(err);
            state.isLoading = false;
            const payload = {
              type: "warning",
              message:
                "Tahun Ajaran tidak dapat dihapus dikarenakan sudah memiliki banyak raport dan kelas",
            };
            commit("SHOW_ALERT", payload, { root: true });
            reject(err);
          });
      });
    },
  },
};

export default tahunAjaran;
