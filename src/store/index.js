import Vue from "vue";
import Vuex from "vuex";

import auth from "./modules/auth";
import user from "./modules/user";
import matapelajaran from "./modules/matapelajaran";
import tahunAjaran from "./modules/tahunAjaran";
import pesertaDidik from "./modules/pesertaDidik";
import raport from "./modules/raport";
import eskul from "./modules/eskul";
import kelas from "./modules/kelas";
import jadwal from "./modules/jadwal";
import predikatSikap from "./modules/predikatSikap";
import nilaiPredikat from "./modules/nilaiPredikat";
import predikatMapel from "./modules/predikatMapel";
import absensi from "./modules/absensi";
import nilaiEskul from "./modules/nilaiEskul";
import predikatEskul from "./modules/predikatEskul";
import nilaiSiswa from "./modules/nilaiSiswa";
import catatanWaliKelas from "./modules/catatanWaliKelas";
import cetakRaport from "./modules/cetakRaport";
import prestasi from "./modules/prestasi";
import tidakNaikKelas from "./modules/tidakNaikKelas";
import pembagianKelas from "./modules/pembagianKelas";

import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    alert: {
      isShow: false,
      type: "",
      message: "",
    },
  },
  mutations: {
    SHOW_ALERT(state, payload) {
      state.alert.isShow = true;
      state.alert.type = payload.type;
      state.alert.message = payload.message;
      if (state.alert.message !== "Link untuk mengubah password salah") {
        setTimeout(() => {
          state.alert.isShow = false;
        }, 6000);
      }
    },
    CLOSE_ALERT(state) {
      state.alert.isShow = false;
    },
  },
  actions: {
    doReload() {
      window.location.reload();
    },
    showError({ commit }, payload) {
      commit("SHOW_ALERT", payload);
    },
  },
  modules: {
    auth,
    user,
    matapelajaran,
    tahunAjaran,
    pesertaDidik,
    raport,
    eskul,
    kelas,
    jadwal,
    predikatSikap,
    nilaiPredikat,
    predikatMapel,
    absensi,
    nilaiEskul,
    predikatEskul,
    nilaiSiswa,
    catatanWaliKelas,
    cetakRaport,
    prestasi,
    tidakNaikKelas,
    pembagianKelas,
  },
  getters: {},
  plugins: [
    createPersistedState({
      paths: ["auth.user"],
      key: ["user"],
    }),
  ],
});
