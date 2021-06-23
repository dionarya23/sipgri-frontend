import axios from "axios";

// !update / tambah prestasi peserta didik
// {{url}}/api/prestasi/create-bulk
// data: {
//  "id_peserta_didik": 1,
//     "id_raport": 1,
//     "list_prestasi": [
//         {
//             "jenis_kegiatan": "Juaran Lomba Makan",
//           "keterangan_kegiatan": "Mantap Bujang"
//         }
//     ]
// }

// !ambil peserta didik dengan pretasi berdasarkan id_peserta_didik dan id_raport
// {{url}}/api/prestasi/peserta-didik/raport/:id_peserta_didik/:id_raport

const prestasi = {
  namespaced: true,
  state: {
    isLoading: false,
    prestasi: {}
  },
  mutations: {
    SET_PRESTASI(state, data) {
      state.prestasi = data;
    }
  },
  actions: {
    getPrestasi({ commit, state }, id_raport) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({
          url: `prestasi/peserta-didik/${id_raport}`,
          method: "GET"
        })
          .then((res) => {
            state.isLoading = false;
            console.log(res.data.data);
            commit("SET_PRESTASI", res.data.data);
            resolve(res);
          })
          .catch((err) => {
            state.isLoading = false;
            reject(err);
          });
      });
    },
    createPrestasi({ commit, state }, data) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({
          method: "POST",
          url: "prestasi/create-bulk",
          data
        })
          .then((res) => {
            state.isLoading = false;
            const payload = {
              isShow: true,
              type: "success",
              message: "berhasil menambahkan prestasi"
            };
            commit("SHOW_ALERT", payload, { root: true });
            resolve(res);
          })
          .catch((err) => {
            state.isLoading = false;
            const payload = {
              isShow: true,
              type: "error",
              message: "gagal menambahkan prestasi"
            };
            commit("SHOW_ALERT", payload, { root: true });
            reject(err);
          });
      });
    }
  }
};

export default prestasi;
