<template>
  <div class="prestasi">
    <v-container>
      <div class="text-center" v-if="isLoading">
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
      </div>
      <v-row no-gutters class="mb-6" v-else>
        <v-col cols="sm" v-for="(tgl, index) in card" :key="index">
          <v-card
            tile
            class="pa-2"
            :disabled="tgl.status_pelaksanaan === 'Tidak Aktif'"
          >
            <v-card-title>
              Prestasi {{ formatTitle(tgl.jenis_penilaian) }}
            </v-card-title>
            <v-card-text class="text--primary">
              Prestasi untuk kelas <b>{{ kelas.nama_kelas }}</b> dalam pembuatan
              raport <br /><b>{{ tgl.jenis_penilaian }}</b>
            </v-card-text>
            <v-card-subtitle class="pb-0">
              <v-icon color="">
                mdi-calendar-clock
              </v-icon>
              Tanggal LHBS : {{ formatDate(tgl.tgl_lhbs) }}
            </v-card-subtitle>
            <v-card-actions>
              <v-btn
                :to="`/prestasi-siswa/${tgl.id_raport}`"
                text
                color="teal accent-4"
                @click="reveal = true"
              >
                Detail Prestasi
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
      "12": "Desember"
    }
  }),
  computed: {
    ...mapState({
      isLoading: (state) => state.prestasi.isLoading,
      card: (state) => state.catatanWaliKelas.catatan,
      kelas: (state) => state.absensi.kelas_diampu
    })
  },
  mounted() {
    this.$store.dispatch("catatanWaliKelas/getRaport");
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
  }
};
</script>
