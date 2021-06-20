import axios from "axios";

const absensi = {
  namespaced: true,
  state: {
    tgl_lhbs: [],
  },
  mutations: {
    SET_TGL_LHBS_RAPORT(state, tglHBSRaport) {
      state.tgl_lhbs = tglHBSRaport;
    },
  },
  actions: {
    getTanggalLHBS({ commit }) {
      return new Promise((resolve, reject) => {
        axios({
          method: "GET",
          url: "raport/tahun-ajaran/aktif/",
        })
          .then((res) => {
            commit("SET_TGL_LHBS_RAPORT", res.data.data.tanggal);
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
  },
};

export default absensi;
