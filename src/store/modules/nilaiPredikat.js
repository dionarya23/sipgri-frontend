import axios from "axios";

const nilaiPredikat = {
  namespaced: true,
  state: {
    nilaiPredikat: [],
    isLoading: false,
  },
  mutations: {
    SET_NILAI_PREDIKAT(state, nilaiPredikat) {
      state.nilaiPredikat = nilaiPredikat;
    },
    ADD_NILAI_PREDIKAT(state, newData) {
      state.nilaiPredikat.unshift(newData);
    },
  },
  actions: {
    getAllNilaiPredikat({ commit, state }) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({
          method: "GET",
          url: "nilai-predikat/",
        })
          .then((res) => {
            commit("SET_NILAI_PREDIKAT", res.data.data);
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

    updateNilaiPredikat({ commit, state }, formData) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({
          method: "PUT",
          url: "nilai-predikat/range/by-tingkat/",
          data: {
            nilai: formData,
          },
        })
          .then((res) => {
            state.isLoading = false;
            const payload = {
              type: "success",
              message: "Berhasil memperbarui nilai predikat",
            };
            commit("SHOW_ALERT", payload, { root: true });
            resolve(res);
          })
          .catch((err) => {
            console.error(err);
            state.isLoading = false;
            const payload = {
              type: "error",
              message: "Gagal memperbarui nilai predikat",
            };
            commit("SHOW_ALERT", payload, { root: true });
            reject(err);
          });
      });
    },
  },
};

export default nilaiPredikat;
