import axios from "axios";

const matapelajaran = {
<<<<<<< HEAD
    namespace: true,
    state : {
        mataPelajaran : []
        // isLoading
    },
    mutations: {
        SET_MATAPELAJARAN(state, mata_pelajaran) {
            state.mataPelajaran = mata_pelajaran
        }
    },
    actions: {
        getAllMataPelajaran({commint, state}, )
=======
  namespace: true,
  state: {
    mataPelajaran: [],
    isLoading: false
  },
  mutations: {
    SET_MAPEL(state, mata_pelajaran) {
      state.mataPelajaran = mata_pelajaran;
>>>>>>> development/benno
    }
  },
  actions: {
    getAllMataPelajaran({ commit, state, rootState }) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({
          url: "mata-pelajaran/",
          method: "GET",
          headers: { Authorization: rootState.auth.token }
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
    }
  }
};

export default matapelajaran;
