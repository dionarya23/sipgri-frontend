<template>
  <div class="nilai_eskul">
    <v-container>
      <v-row no-gutters class="mb-6">
        <v-col cols="sm" v-for="(tgl, index) in tgl_lhbs" :key="index">
          <v-card  tile class="pa-2" :disabled="tgl.status_pelaksanaan === 'Tidak Aktif'">
            <v-card-title>
              Nilai Eskul {{ formatTitle(tgl.jenis_penilaian) }}
            </v-card-title>
            <v-card-text class="text--primary">
              Nilai Eskul untuk kelas <b>{{ kelas.nama_kelas }}</b> dalam pembuatan raport <br/><b>{{ tgl.jenis_penilaian }}</b>
            </v-card-text>
            <v-card-subtitle class="pb-0">
              <v-icon color="">
                mdi-calendar-clock
              </v-icon>
              Tanggal LHBS : <br/>{{ formatDate(tgl.tgl_lhbs) }}
            </v-card-subtitle>
            <v-card-actions>
              <v-btn :to="`/detail-nilai-eskul/${tgl.id_raport}`" text color="teal accent-4" @click="reveal=true">
                Isi Nilai
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data: () => ({
    bulan: {
      "01": "Januari",
      "02": "Februari",
      "03": "Maret",
      "04": "April",
      "05": "Mei",
      "06": "Juni",
      "07": "Juli",
      "08": "Agustus",
      "09": "September",
      "10": "Oktober",
      "11": "November",
      "12": "Desember",
    },
  }),
  computed: {
    ...mapState({
      tgl_lhbs: (state) => state.absensi.tgl_lhbs,
      kelas: (state) => state.absensi.kelas_diampu
    }),
  },
  mounted() {
    this.$store.dispatch("absensi/getTanggalLHBS");
    this.$store.dispatch("absensi/getKelasYangDiampu");
  },
  methods: {
    formatDate(date) {
      if (date !== null) {
        const [tahun, bulan, tanggal] = date.split("-");
        return `${tanggal} ${this.bulan[bulan]} ${tahun}`;
      } else {
        return "";
      }
    },

    formatTitle(title) {
      if (title === "Penilaian Tengah Semester 1") {
        return "PTS";
      } else if (title === "Penilaian Akhir Semester") {
        return "PAS";
      } else if (title === "Penilaian Tengah Semester 2") {
        return "PTS 2";
      } else if (title === "Penilaian Akhir Tahun") {
        return "PAT";
      }
    }
  },
};
</script>
