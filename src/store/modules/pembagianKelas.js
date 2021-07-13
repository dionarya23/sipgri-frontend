import axios from "axios";

const pembagianKelas = {
  namespaced: true,
  state: {
    isLoading: false,
    listKelas: [],
    pembagianKelas: localStorage.getItem("pembagianKelas") || "",
  },
  mutations: {
    SET_LIST_KELAS(state, listKelas) {
      state.listKelas = [];
      state.listKelas = listKelas;
    },
    SET_PEMBAGIAN_KELAS(state, data) {
      localStorage.setItem("pembagianKelas", data);
      state.pembagianKelas = data;
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
              message: "Gagal mengambil list kelas",
            };
            commit("SHOW_ALERT", payload, { root: true });
            reject(err);
          });
      });
    },

    doPembagianKelas({ commit, state }) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({
            url: "peserta-didik/pembagian/kelas/",
            method: "GET",
          })
          .then((res) => {
            state.isLoading = false;
            const { kelas, raportAktif } = res.data.data;
            const payload = {
              isShow: true,
              type: "success",
              message: "Berhasil melakukan pembagian kelas",
            };
            commit("SET_LIST_KELAS", kelas);
            commit(
              "SET_PEMBAGIAN_KELAS",
              `true_${raportAktif.jenis_penilaian}${raportAktif.id_raport}`
            );

            commit("SHOW_ALERT", payload, { root: true });
            resolve(res);
          })
          .catch((err) => {
            state.isLoading = false;
            const payload = {
              isShow: true,
              type: "error",
              message: "Gagal Melakukan pembagian kelas",
            };
            commit("SHOW_ALERT", payload, { root: true });
            reject(err);
          });
      });
    },
  },
};

export default pembagianKelas;
