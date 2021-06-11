import axios from "axios";

const jadwal = {
  namespaced: true,
  state: {
    jadwal: [],
    isLoading: false,
    guru_mengajar: [],
  },
  mutations: {
    SET_JADWAL(state, jadwal) {
      state.jadwal = jadwal;
    },
    SET_GURU_MENGAJAR(state, guru_mengajar) {
      state.guru_mengajar = guru_mengajar;
    },
    ADD_JADWAL(state, newData) {
      state.jadwal.unshift(newData);
    },
  },
  actions: {

    getGuruMengajar({ commit }) {
      return new Promise((resolve, reject) => {
        axios({
          method: "GET",
          url : "user/guru/mata-pelajaran/"
        }).then(res => {
          const { data } = res.data;
          commit("SET_GURU_MENGAJAR", data);
          resolve(data);
        }).catch(err => {
          console.err(err);
          reject(err)
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
            commit("SET_JADWAL", data);
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
    
  },
};

export default jadwal;
