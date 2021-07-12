<template>
  <div class="tidak-naik-kelas">
    <v-card>
      <v-card-title> Tahun Ajaran {{ tahun_ajaran_aktif }} </v-card-title>
      <v-data-table
        :headers="headers"
        :items="pesertaDidik"
        :expanded.sync="expanded"
        item-key="nama"
        show-expand
        class="elevation-1"
        :search="search"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Cari Berdasarkan nama peserta didik"
              single-line
              hide-details
            ></v-text-field>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              depressed
              class="mb-2 text--white"
              v-bind="attrs"
              v-on="on"
              :loading="isLoading"
              :disabled="
                isLoading ||
                  tahunAjaran.jenis_penilaian === 'Penilaian Akhir Tahun'
              "
              @click="cetakLaporan"
            >
              Cetak Laporan
            </v-btn>
          </v-toolbar>
          <v-alert
            :value="alert.isShow"
            :type="alert.type || 'error'"
            transition="slide-y-transition"
          >
            {{ alert.message }}
          </v-alert>
        </template>

        <template v-slot:no-data>
          <p class="mt-4">Belum ada data yang bisa ditampilkan.</p>
        </template>
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length" class="pa-2">
            <v-list subheader>
              <v-subheader
                ><h2>Daftar Mata Pelajaran yang Tidak Lulus</h2></v-subheader
              >

              <v-list-item v-if="item.tidak_lulus.length === 0">
                <v-list-item-content>
                  <v-list-item-title
                    >Tidak ada mata pelajaran yang tidak
                    lulus</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>

              <v-list-item v-else v-for="(e, i) in item.tidak_lulus" :key="i">
                <v-list-item-content>
                  <v-list-item-title
                    >{{ ++i }}. {{ e.mata_pelajaran }}</v-list-item-title
                  >
                  <v-list-item-subtitle
                    >Nilai Predikat Keterampilan
                    {{ e.predikat_keterampilan }}</v-list-item-subtitle
                  >
                  <v-list-item-subtitle
                    >Nilai Predikat Pengetahuan
                    {{ e.predikat_pengetahuan }}</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </td>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>
<script>
import { mapState } from "vuex";
import printJS from "print-js";
import endpoint from "../../config/endpoint";

export default {
  data: () => ({
    expanded: [],
    search: "",
    valid: true,
    dialog: false,
    headers: [
      {
        text: "NISN",
        value: "nisn",
        sortable: false,
      },
      {
        text: "NIS",
        value: "nis",
        sortable: false,
      },
      {
        text: "Nama",
        value: "nama",
      },
      {
        text: "Kelas",
        value: "kelas",
        sortable: false,
      },
      {
        text: "Tingkat",
        value: "tingkat",
        sortable: false,
      },
      {
        text: "Jurusan",
        value: "minat_jurusan",
        sortable: false,
      },
      {
        text: "",
        value: "data-table-expand",
        sortable: false,
      },
    ],
  }),
  computed: {
    ...mapState({
      alert: (state) => state.alert,
      isLoading: (state) => state.tidakNaikKelas.isLoading,
      tahunAjaran : (state) => state.tidakNaikKelas.tahunAjaran,
      pesertaDidik: (state) => state.tidakNaikKelas.pesertaDidik,
    }),
    tahun_ajaran_aktif() {
      return `${this.tahunAjaran.tahun_ajaran.tahun_awal}/${this.tahunAjaran.tahun_ajaran.tahun_akhir}`;
    },
  },
  mounted() {
    this.$store.dispatch("tidakNaikKelas/getPesertaDidikTidakMemenuhiSyarat");
  },
  methods: {
    cetakLaporan() {
      printJS({
        printable: `${endpoint}kelas/tidak-naik`,
        type: "pdf",
        modalMessage: "Harap tunggu, sedang mendapatkan dokumen ..",
        showModal: true,
        onError: (_) => {
          const payload = {
            isShow: true,
            type: "error",
            message: "Gagal mengambil dokumen",
          };
          this.$store.dispatch("showError", payload);
        },
      });
    },
  },
};
</script>
