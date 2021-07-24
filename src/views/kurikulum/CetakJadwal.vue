<template>
  <v-col cols="12" md="4">
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-alert
        :value="alert.isShow"
        :type="alert.type || 'error'"
        transition="slide-y-transition"
      >
        {{ alert.message }}
      </v-alert>
      <v-select
        label="Jenis Jadwal"
        :items="['Perkelas', 'Perangkatan']"
        :rules="[(v) => !!v || 'Wajib dipilih']"
        v-model="jenis_jadwal"
      ></v-select>

      <v-autocomplete
        v-if="jenis_jadwal === 'Perangkatan'"
        label="Pilih Angkatan"
        item-text="angkatan"
        item-value="tingkat"
        :rules="[(v) => !!v || 'Wajib dipilih']"
        :items="list_angkatan"
        v-model="tingkat"
      >
      </v-autocomplete>

      <v-autocomplete
        v-else
        label="Pilih Kelas"
        item-text="nama_kelas"
        item-value="id_kelas"
        v-model="id_kelas"
        :rules="[(v) => !!v || 'Wajib dipilih']"
        :items="kelas"
      >
      </v-autocomplete>
    </v-form>
    <v-spacer></v-spacer>

    <v-btn
      color="primary"
      class="text--white"
      depressed
      @click="cetak"
      :disabled="!valid || isLoading"
    >
      Cetak Jadwal
    </v-btn>
  </v-col>
</template>
<script>
import { mapState } from "vuex";
import printJS from "print-js";
import endpoint from "../../config/endpoint";
export default {
  data: () => ({
    isLoading: false,
    valid: true,
    id_kelas: "",
    tingkat: "",
    jenis_jadwal: "Perkelas",
    list_angkatan: [
      {
        angkatan: "Angkatan Kelas 10",
        tingkat: "X",
      },
      {
        angkatan: "Angkatan Kelas 11",
        tingkat: "XI",
      },
      {
        angkatan: "Angkatan Kelas 12",
        tingkat: "XII",
      },
    ],
  }),
  computed: {
    ...mapState({
      alert: (state) => state.alert,
      kelas: (state) => state.kelas.kelas,
      tahunAjaranAktif: (state) => state.tahunAjaran.tahunAjaranAktif,
    }),
  },
  mounted() {
    this.$store.dispatch("kelas/getAllKelas");
    this.$store.dispatch("jadwal/getJadwalByTahunAjaranAktif");
  },
  methods: {
    cetak() {
      if (this.$refs.form.validate()) {
      
      if (this.jenis_jadwal === 'Perangkatan') {
        printJS({
          printable: `${endpoint}jadwal/angkatan/${this.tahunAjaranAktif.id_tahun_ajaran}/${this.tingkat}`,
          type: "pdf",
          modalMessage: "Harap tunggu, sedang mendapatkan jadwal...",
          showModal: true,
          onError: (_) => {
            const payload = {
              isShow: true,
              type: "error",
              message: "Jadwal belum tersedia, harap isi terlebih dahulu",
            };
            this.$store.dispatch("showError", payload);
          },
        });
      } else {
        printJS({
          printable: `${endpoint}jadwal/kelas/${this.id_kelas}/${this.tahunAjaranAktif.id_tahun_ajaran}/document`,
          type: "pdf",
          modalMessage: "Harap tunggu, sedang mendapatkan jadwal...",
          showModal: true,
          onError: (_) => {
            const payload = {
              isShow: true,
              type: "error",
              message: "Jadwal belum tersedia, harap isi terlebih dahulu",
            };
            this.$store.dispatch("showError", payload);
          },
        });
      }

      } else {
        this.valid = false;
      }
    },
  },
};
</script>
