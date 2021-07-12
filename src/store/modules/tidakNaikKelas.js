import axios from "axios";

const tidakNaikKelas = {
  namespaced: true,
  state: {
    isLoading: false,
    pesertaDidik: [],
    tahunAjaran: {},
  },
  mutations: {
    SET_PESERTA_DIDIK(state, pesertaDidik) {
      state.pesertaDidik = pesertaDidik;
    },
    SET_TAHUN_AJARAN(state, tahunAjaran) {
      state.tahunAjaran = tahunAjaran;
    },
  },
  actions: {
   
    getPesertaDidikTidakMemenuhiSyarat({ commit, state }) {
        state.isLoading = true;
        return new Promise((resolve, reject) => {
          axios({
            url: "peserta-didik/syarat/tidak-naik/",
            method: "GET",
          })
            .then((res) => {
              const {pesertaDidik, tahunAjaran} = res.data.data
              commit("SET_PESERTA_DIDIK", pesertaDidik);
              commit("SET_TAHUN_AJARAN", tahunAjaran);
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


  },
};

export default tidakNaikKelas;
