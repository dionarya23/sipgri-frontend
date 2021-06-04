import axios from "axios";

const tahunAjaran = {
  namespaced: true,
  state: {
    isLoading: false,
    tahunAjaran: [],
  },
  mutations: {
    SET_TAHUN_AJARAN(state, tahunAjaran) {
      state.tahunAjaran = tahunAjaran;
    },
    ADD_TAHUN_AJARAN(state, newTahunAjaran) {
      state.tahunAjaran.push(newTahunAjaran);
    },
    UPDATE_TAHUN_AJARAN(state, id_tahun_ajaran){
      state.tahunAjaran.map(tahun => {
        if (tahun.id_tahun_ajaran === id_tahun_ajaran) {
          tahun.status_aktif = "Aktif"
        }else{
          tahun.status_aktif = "Tidak Aktif"
        }
      })
    },
    DELETE_TAHUN_AJARAN(state, id_tahun_ajaran) {
      state.tahunAjaran = state.tahunAjaran.filter(tahun_ajaran => tahun_ajaran.id_tahun_ajaran !== id_tahun_ajaran)
    },
  },
  actions: {
    createTahunAjaran({ commit, state, rootState }, newData) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({
          url: "tahun-ajaran/",
          method: "POST",
          data: newData,
          headers: { Authorization: rootState.auth.token },
        })
          .then((res) => {
            const { data } = res.data;
            data.tahun_ajaran = `${data.tahun_awal}/${data.tahun_akhir}`;
            data.status_aktif = "Tidak Aktif";
            commit("ADD_TAHUN_AJARAN", data);
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
    getAllTahunAjaran({ commit, state, rootState }) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({
          url: "tahun-ajaran/",
          method: "GET",
          headers: { Authorization: rootState.auth.token },
        })
          .then((res) => {
            const { data } = res.data;
            data.slice(0).reverse().map((tahun_ajaran, _) => {
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
    updateTahunAjaran({commit, state, rootState}, id_tahun_ajaran) {
      state.isLoading = true
      return new Promise((resolve, reject) => {
        axios({
          url: `tahun-ajaran/${id_tahun_ajaran}`,
          method: "PUT",
          data: {
            status_aktif: "aktif"
          },
          headers: { Authorization: rootState.auth.token },
        }).then(res => {
          commit("UPDATE_TAHUN_AJARAN", id_tahun_ajaran)
          state.isLoading = false
          resolve(res)
        }).catch(err => {
          console.error(err);
          state.isLoading = false;
          reject(err);
        })
      })
    },
    deleteTahunAjaran({commit, state, rootState}, id_tahun_ajaran) {
      state.isLoading = true
      return new Promise((resolve, reject) => {
        axios({
          url: `tahun-ajaran/${id_tahun_ajaran}`,
          method: "DELETE",
          headers: { Authorization: rootState.auth.token },
        }).then(res => {
          commit("DELETE_TAHUN_AJARAN", id_tahun_ajaran)
          state.isLoading = false
          resolve(res)
        }).catch(err => {
          console.error(err);
          state.isLoading = false;
          reject(err);
        })
      })
    },
  },
};

export default tahunAjaran;
