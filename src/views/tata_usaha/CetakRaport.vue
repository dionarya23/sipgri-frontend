<template>
  <div class="cetak-raport">
    <v-card>
      <v-card-title>
        List Kelas untuk Cetak Raport {{ raport.jenis_penilaian }} Tahun Ajaran
        {{ raport.tahun_ajaran.tahun_awal }}/{{
          raport.tahun_ajaran.tahun_akhir
        }}
      </v-card-title>
      <v-card-subtitle>
        Tanggal LHBS: {{ formatDate(raport.tgl_lhbs) }}
      </v-card-subtitle>
      <v-data-table
        :headers="headers"
        :loading="isLoading"
        :items="filteredListKelas"
        class="elevation-1"
        sort-by="nama_kelas"
        hide-default-footer
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-select
              v-model="tingkatSelected"
              :items="['X', 'XI', 'XII']"
              label="Filter berdasarkan tingkat kelas"
              dense
            ></v-select>
            <v-spacer></v-spacer>
            <v-select
              v-model="jurusanSelected"
              :items="['MIPA', 'IPS']"
              label="Filter berdasarkan Jurusan"
              dense
            ></v-select>
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
          <v-btn text color="teal" :to="`/cetak-raport-kelas/${item.id_kelas}`">
            Detail
          </v-btn>
        </template>

        <template v-slot:[`item.kelas_siswa`]="{ item }">
          <span>
            {{ item.kelas_siswa.length }}
          </span>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>
<script>
import { mapState } from "vuex";

export default {
  data: () => ({
    tingkatSelected: "X",
    jurusanSelected: "IPS",
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
    headers: [
      {
        text: "Nama Kelas",
        value: "nama_kelas",
        sortable: false,
      },
      {
        text: "Wali Kelas",
        value: "wali_kelas.nama",
        sortable: false,
      },
      {
        text: "Tinkat Kelas",
        value: "tingkat",
        align: "center",
      },
      {
        text: "Jurusan",
        value: "jurusan",
        align: "center",
      },
      {
        text: "Jumlah Peserta Didik",
        value: "kelas_siswa",
        align: "center",
        sortable: false,
      },
      { text: "Aksi", value: "actions", align: "center", sortable: false },
    ],
    
  }),
  computed: {
    ...mapState({
      alert: (state) => state.alert,
      listKelas: (state) => state.cetakRaport.listKelas,
      raport: (state) => state.cetakRaport.raportAktif,
      isLoading: (state) => state.cetakRaport.isLoading,
    }),
    filteredListKelas() {
      return this.listKelas.filter(
        (kelas) =>
          kelas.tingkat === this.tingkatSelected &&
          kelas.jurusan === this.jurusanSelected
      );
    },
  },
  mounted() {
    this.$store.dispatch("cetakRaport/getListKelas");
    this.$store.dispatch("cetakRaport/getRaportAktif");
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
  },
};
</script>
