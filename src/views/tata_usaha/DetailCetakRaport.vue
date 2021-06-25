<template>
  <div class="detail-cetak-raport">
    <v-card>
      <v-card-title>
        Cetak Raport {{ raport.jenis_penilaian }} untuk Kelas
        {{ kelas.nama_kelas }} Tahun Ajaran
        {{ raport.tahun_ajaran.tahun_awal }}/{{
          raport.tahun_ajaran.tahun_akhir
        }}
      </v-card-title>
      <v-card-subtitle>
        Tanggal LHBS: {{ formatDate(raport.tgl_lhbs) }}
      </v-card-subtitle>
      <v-data-table
        :headers="headers"
        :items="list_peserta_didik"
        :search="search"
        :loading="isLoading"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-text-field
              v-model="search"
              label="Cari berdasarkan nama"
              dense
            ></v-text-field>
            <v-spacer></v-spacer>
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

        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            :disabled="
              item.peserta_didik.nilai_nilai.length === 0 &&
                item.peserta_didik.kegiatan_eskul_murid.length === 0 &&
                item.peserta_didik.absensi_siswa === null
            "
            text
            color="teal"
            @click="cetakRaport(item)"
          >
            Cetak
          </v-btn>
        </template>

        <template v-slot:[`item.status_raport`]="{ item }">
          <span>
            {{ checkStatusRaport(item) }}
          </span>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
import printJS from "print-js";
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
    search: "",
    headers: [
      {
        text: "NISN",
        value: "peserta_didik.nisn",
        align: "center",
      },
      {
        text: "NIS",
        value: "peserta_didik.nis",
        align: "center",
        sortable: false,
      },
      {
        text: "Nama",
        value: "peserta_didik.nama",
        align: "center",
        sortable: false,
      },
      {
        text: "Status Raport",
        value: "status_raport",
        align: "center",
        sortable: false,
      },
      { text: "Aksi", value: "actions", align: "center", sortable: false },
    ],
  }),
  computed: {
    ...mapState({
      list_peserta_didik: (state) => state.cetakRaport.kelas.kelas_siswa,
      kelas: (state) => state.cetakRaport.kelas,
      raport: (state) => state.cetakRaport.raportAktif,
      isLoading: (state) => state.cetakRaport.isLoading,
      alert: (state) => state.alert,
    }),
  },
  mounted() {
    this.$store.dispatch(
      "cetakRaport/getDetailKelas",
      this.$route.params.id_kelas
    );
    this.$store.dispatch("cetakRaport/getRaportAktif");
  },
  methods: {
    cetakRaport(item) {
      if (
        this.raport.jenis_penilaian === "Penilaian Tengah Semester 1" ||
        this.raport.jenis_penilaian === "Penilaian Tengah Semester 2"
      ) {
        printJS({
          printable: `http://localhost:9000/api/raport/cetak/${item.id_peserta_didik}/peserta-didik/${this.raport.id_raport}/${item.peserta_didik.nama}`,
          type: "pdf",
          modalMessage: "Harap tunggu, sedang mendapatkan raport...",
          showModal: true,
          onError: _ => {
            const payload = {
              isShow: true,
              type: "error",
              message: "Gagal mengambil mencetak raport",
            };
            this.$store.dispatch("showError", payload)
          }
        });
      }else{
         printJS({
          printable: `http://localhost:9000/api/raport/pat/cetak/${item.id_peserta_didik}/peserta-didik/${this.raport.id_raport}/${item.peserta_didik.nama}`,
          type: "pdf",
          modalMessage: "Harap tunggu, sedang mendapatkan raport...",
          showModal: true,
          onError: _ => {
            const payload = {
              isShow: true,
              type: "error",
              message: "Gagal mengambil mencetak raport",
            };
            this.$store.dispatch("showError", payload)
          }
        });
      }
    },
    checkStatusRaport(item) {
      return item.peserta_didik.nilai_nilai.length === 0 &&
        item.peserta_didik.kegiatan_eskul_murid.length === 0 &&
        item.peserta_didik.absensi_siswa === null
        ? "Sedang dalam proses pembuatan"
        : "Siap dicetak";
    },
    formatDate(date) {
      if (date !== null) {
        const [tahun, bulan, tanggal] = date.split("-");
        return `${tanggal} ${this.bulan[bulan]} ${tahun}`;
      } else {
        return "";
      }
    },
  },
};
</script>
