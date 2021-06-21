import axios from "axios";

// !Ambil peserta didik beserta catatan (untuk table) :
// GET {{url}}/catatan-wali-kelas/peserta-didik/:id_raport

// !Masukin kesemua catatan wali kelas bulk :
// POST {{url}}/catatan-wali-kelas/bulk
// data : {
// "id_raport": 7,
// "id_kelas": 8,
// "catatan": "Selamat atas pembagian raport akhir semester mantap sekalli bujang bujang"
// }

// !Membuat Catatan Wali kelas misal catatan wali kelas null:
// POST {{url}}/catatan-wali-kelas
// data: {
// "id_peserta_didik" : 1,
// "catatan" : "Terimakasih atas perjuangan anda selama ini",
// "id_raport" : 7
// }

// !Update Catatan Wali Kelas misal tidak null catatan wali kelas nya:
// PUT {{url}}/catatan-wali-kelas/:id_catatan
// data: {
//  "catatan" : "Terimakasih atas perjuangan anda selama ini"
// }

const catatanWaliKelas = {
  namespaced: true,
  state: {
    isLoading: false,
    raport: {},
    catatan: []
  },
  mutations: {
    SET_TGL_LHBS_RAPORT(state, tglHBSRaport) {
      state.tgl_lhbs = tglHBSRaport;
    },
    SET_KELAS_DIAMPU(state, kelas) {
      state.kelas_diampu = kelas;
    },
    SET_PESERTA_DIDIK(state, detail_kelas) {
      state.detail_kelas = detail_kelas;
    },
    SET_RAPORT(state, raport) {
      console.log("raport : ", raport);
      state.catatan = raport.tanggal.filter((e) => {
        return (
          e.jenis_penilaian === "Penilaian Akhir Semester" ||
          e.jenis_penilaian === "Penilaian Akhir Tahun"
        );
      });
      state.raport = raport;
    }
  },
  actions: {
    getRaport({ commit }, id_raport) {
      return new Promise((resolve, reject) => {
        axios({
          url: "raport/tahun-ajaran/aktif",
          method: "GET"
        })
          .then((res) => {
            commit("SET_RAPORT", res.data.data);
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      });
    }
  }
};

export default catatanWaliKelas;
