import Vue from "vue";
import VueRouter from "vue-router";

// tata usaha
import User from "../views/tata_usaha/User.vue";
import TahunAjaran from "../views/tata_usaha/TahunAjaran.vue";
import PesertaDidik from "../views/tata_usaha/PesertaDidik.vue";
import TanggalLhbs from "../views/tata_usaha/TanggalLhbs.vue";
import CetakRaport from "../views/tata_usaha/CetakRaport.vue";
import DetailCetakRaport from "../views/tata_usaha/DetailCetakRaport.vue";
import TidakNaikKelas from "../views/tata_usaha/TidakNaikKelas.vue";
import UbahTingkatSiswa from "../views/tata_usaha/UbahTingkatSiswa.vue";

// kurikulum
import MataPelajaran from "../views/kurikulum/MataPelajaran.vue";
import Eskul from "../views/kurikulum/Eskul.vue";
import Kelas from "../views/kurikulum/Kelas.vue";
import Jadwal from "../views/kurikulum/Jadwal.vue";
import CetakJadwal from "../views/kurikulum/CetakJadwal.vue";
import PredikatSikap from "../views/kurikulum/PredikatSikap.vue";
import NilaiPredikat from "../views/kurikulum/NilaiPredikat.vue";
import PredikatEskul from "../views/kurikulum/PredikatEskul.vue";
import PembagianKelas from "../views/kurikulum/PembagianKelas.vue";

// guru and wali kelas can access
import Dashboard from "../views/pengajar/Dashboard.vue";
import NilaiKkm from "../views/pengajar/guru/NilaiKkm.vue";
import PredikatMapel from "../views/pengajar/guru/PredikatMapel.vue";
import Penilaian from "../views/pengajar/guru/Penilaian.vue";
import DetailNilai from "../views/pengajar/guru/DetailNilai.vue";
import CatatanWaliKelas from "../views/pengajar/raport/CatatanWaliKelas.vue";
import DetailCatatan from "../views/pengajar/raport/DetailCatatan.vue";
import Prestasi from "../views/pengajar/prestasi/Prestasi.vue";
import DetailPrestasi from "../views/pengajar/prestasi/DetailPrestasi.vue";

// wali kelas can access
import Absensi from "../views/pengajar/wali_kelas/Absensi.vue";
import DetailAbsensi from "../views/pengajar/wali_kelas/DetailAbsensi.vue";
import NilaiEskul from "../views/pengajar/wali_kelas/Eskul.vue";
import DetailNilaiEskul from "../views/pengajar/wali_kelas/DetailNilaiEskul.vue";

// all role user can access
import Profile from "../views/auth/Profile.vue";
import Password from "../views/auth/Password.vue";

import Login from "../views/auth/Login.vue";
import LostPassword from "../views/auth/LostPassword.vue";
import ChangePassword from "../views/auth/ChangePassword.vue";
import Layout from "../views/Layout.vue";

import store from "../store/index";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Layout",
    redirect: "/user",
    component: Layout,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: "user",
        name: "Data User",
        component: User,
        meta: {
          roles: ["tata_usaha"]
        }
      },
      {
        path: "tahun-ajaran",
        name: "Data Tahun Ajaran",
        component: TahunAjaran,
        meta: {
          roles: ["tata_usaha"]
        }
      },
      {
        path: "peserta-didik",
        name: "Data Peserta Didik",
        component: PesertaDidik,
        meta: {
          roles: ["tata_usaha"]
        }
      },
      {
        path: "tanggal-lhbs",
        name: `Data Tanggal LHBS Tahun Ajaran`,
        component: TanggalLhbs,
        meta: {
          roles: ["tata_usaha"]
        }
      },
      {
        path: "cetak-raport",
        name: `Cetak Raport`,
        component: CetakRaport,
        meta: {
          roles: ["tata_usaha"]
        }
      },
      {
        path: "cetak-raport-kelas/:id_kelas",
        name: `Cetak Raport Peserta Didik`,
        component: DetailCetakRaport,
        meta: {
          roles: ["tata_usaha"]
        }
      },
      {
        path: "laporan-tidak-naik-kelas",
        name: `Laporan Tidak Naik Kelas`,
        component: TidakNaikKelas,
        meta: {
          roles: ["tata_usaha"]
        }
      },
      {
        path: "ubah-tingkat-siswa",
        name: `Ubah Tingkat Siswa`,
        component: UbahTingkatSiswa,
        meta: {
          roles: ["tata_usaha"]
        }
      },
      {
        path: "mata-pelajaran",
        name: "Data Mata Pelajaran",
        component: MataPelajaran,
        meta: {
          roles: ["kurikulum"]
        }
      },
      {
        path: "nilai-predikat",
        name: "Data Nilai Predikat",
        component: NilaiPredikat,
        meta: {
          roles: ["kurikulum"]
        }
      },
      {
        path: "predikat-sikap",
        name: "Data Predikat Sikap",
        component: PredikatSikap,
        meta: {
          roles: ["kurikulum"]
        }
      },
      {
        path: "predikat-eskul",
        name: "Data Predikat Nilai Eskul",
        component: PredikatEskul,
        meta: {
          roles: ["kurikulum"]
        }
      },
      {
        path: "eskul",
        name: "Data Esktrakulikuler",
        component: Eskul,
        meta: {
          roles: ["kurikulum"]
        }
      },
      {
        path: "data-kelas",
        name: "Data Kelas",
        component: Kelas,
        meta: {
          roles: ["kurikulum"]
        }
      },
      {
        path: "data-jadwal",
        name: "Data Jadwal",
        component: Jadwal,
        meta: {
          roles: ["kurikulum"]
        }
      },
      {
        path: "pembagian-kelas",
        name: "Pembagian Kelas",
        component: PembagianKelas,
        meta: {
          roles: ["kurikulum"]
        }
      },
      {
        path: "jadwal-kelas",
        name: "Cetak Jadwal Kelas",
        component: CetakJadwal,
        meta: {
          roles: ["kurikulum"]
        }
      },
      {
        path: "dashboard",
        name: "Dashboard",
        component: Dashboard,
        meta: {
          roles: ["guru", "wali_kelas"]
        }
      },
      {
        path: "nilai-kkm",
        name: "Nilai KKM Mata Pelajaran",
        component: NilaiKkm,
        meta: {
          roles: ["guru", "wali_kelas"]
        }
      },
      {
        path: "predikat-mapel",
        name: "Nilai Predikat Mata Pelajaran",
        component: PredikatMapel,
        meta: {
          roles: ["guru", "wali_kelas"]
        }
      },
      {
        path: "penilaian",
        name: "Penilaian Mata Pelajaran",
        component: Penilaian,
        meta: {
          roles: ["guru", "wali_kelas"]
        }
      },
      {
        path: "detail-isi-nilai/:kode_mengajar/:id_kelas",
        name: "Pengisian Nilai Peserta Didik",
        component: DetailNilai,
        meta: {
          roles: ["guru", "wali_kelas"]
        }
      },
      {
        path: "absensi",
        name: "Absensi Peserta Didik",
        component: Absensi,
        meta: {
          roles: ["wali_kelas"]
        }
      },
      {
        path: "detail-absensi/:id_raport",
        name: "Pengisian Absensi",
        component: DetailAbsensi,
        meta: {
          roles: ["wali_kelas"]
        }
      },
      {
        path: "nilai-eskul",
        name: "Nilai Eskul",
        component: NilaiEskul,
        meta: {
          roles: ["wali_kelas"]
        }
      },
      {
        path: "detail-nilai-eskul/:id_raport",
        name: "Pengisian Nilai Eskul",
        component: DetailNilaiEskul,
        meta: {
          roles: ["wali_kelas"]
        }
      },
      {
        path: "catatan-wali-kelas",
        name: "Catatan Wali Kelas",
        component: CatatanWaliKelas,
        meta: {
          roles: ["wali_kelas"]
        }
      },
      {
        path: "catatan-wali-kelas/:id_raport",
        name: "Pengisian Catatan Wali Kelas",
        component: DetailCatatan,
        meta: {
          roles: ["wali_kelas"]
        }
      },
      {
        path: "prestasi-siswa",
        name: "Prestasi Siswa",
        component: Prestasi,
        meta: {
          roles: ["wali_kelas"]
        }
      },
      {
        path: "prestasi-siswa/:id_raport",
        name: "Detail Prestasi Siswa",
        component: DetailPrestasi,
        meta: {
          roles: ["wali_kelas"]
        }
      },
      {
        path: "ubah-profile",
        name: "Ubah Profile",
        component: Profile,
        meta: {
          roles: ["kurikulum", "tata_usaha", "guru", "wali_kelas"]
        }
      },
      {
        path: "ubah-password",
        name: "Ubah Password",
        component: Password,
        meta: {
          roles: ["kurikulum", "tata_usaha", "guru", "wali_kelas"]
        }
      }
    ]
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    beforeEnter: (to, from, next) => {
      if (!store.getters["auth/isLoggedIn"]) {
        next();
        return;
      }
      next("/");
    }
  },
  {
    path: "/lost-password",
    name: "LostPassword",
    component: LostPassword,
    beforeEnter: (to, from, next) => {
      if (!store.getters["auth/isLoggedIn"]) {
        next();
        return;
      }
      next("/");
    }
  },
  {
    path: "/change-password/:hash",
    name: "ChangePassword",
    component: ChangePassword,
    beforeEnter: (to, from, next) => {
      if (!store.getters["auth/isLoggedIn"]) {
        next();
        return;
      }
      next("/");
    }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (store.getters["auth/isLoggedIn"]) {
      if (to.meta.roles.includes(store.getters["auth/role"])) {
        return next();
      } else {
        switch (store.getters["auth/role"]) {
          case "tata_usaha":
            next({
              name: "Data User"
            });
            break;

          case "kurikulum":
            next({
              name: "Data Mata Pelajaran"
            });
            break;

          case "guru":
            next({
              name: "Dashboard"
            });
            break;

          case "wali_kelas":
            next({
              name: "Dashboard"
            });
            break;

          default:
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("role");
            delete axios.defaults.headers.common["Authorization"];
            next({
              name: "Login"
            });
            break;
        }
      }
    } else {
      console.log("masuk login kesini");
      next();
      return;
    }
  }

  next();
});

export default router;
