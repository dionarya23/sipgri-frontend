<template>
  <div class="pembagian-kelas">
    <v-card>
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
           
           <v-dialog persistent v-model="dialogPembagianKelas" max-width="480px">
                 <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  depressed
                  class="mx-2 texr--white"
                  :loading="isLoading"
                  :disabled="isLoading || raportAktif.jenis_penilaian !== 'Penilaian Tengah Semester 1' || isAlreadyPembagianKelas"
                  v-bind="attrs"
                  v-on="on"
                >
                Lakukan Pembagian Kelas
                </v-btn>
                </template>

                <v-card>
                  <v-card-title class="headline">Peringatan</v-card-title>
                  <v-card-text
                    ><p class="text-h6">
                      Apakah anda yakin ingin melakukan pembagian kelas untuk siswa kelas X?
                    </p></v-card-text
                  >
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closePembagianKelas"
                      >Batal</v-btn
                    >
                    <v-btn color="success" text @click="confirmPembagianKelas">Ya!</v-btn>
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>

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
          <v-btn @click="cetakDaftarSiswa(item.id_kelas)" text color="teal" :disabled="item.kelas_siswa.length === 0">
            Cetak 
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
import printJS from "print-js";
import endpoint from '../../config/endpoint'

export default {
  data: () => ({
    dialogPembagianKelas: false,
    tingkatSelected: "X",
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
      listKelas: (state) => state.pembagianKelas.listKelas,
      isLoading: (state) => state.pembagianKelas.isLoading,
      pembagianKelas: (state) => state.pembagianKelas.pembagianKelas,
      raportAktif: (state) => state.cetakRaport.raportAktif,
    }),
    filteredListKelas() {
      return this.listKelas.filter(
        (kelas) =>
          kelas.tingkat === this.tingkatSelected
      );
    },
    isAlreadyPembagianKelas() {
      let jumlah_kelas = 0;
      this.listKelas.map((kelas) => {
        jumlah_kelas += kelas.kelas_siswa.length
      });
      return jumlah_kelas !== 0;
    }
  },
  mounted() {
    this.$store.dispatch("pembagianKelas/getListKelas");
    this.$store.dispatch("cetakRaport/getRaportAktif");
  },
  methods: {
    closePembagianKelas(){
      this.dialogPembagianKelas = false;
    },
    confirmPembagianKelas(){
      this.$store.dispatch("pembagianKelas/doPembagianKelas");
      this.closePembagianKelas();
    },
    cetakDaftarSiswa(id_kelas){
       printJS({
          printable: `${endpoint}kelas/list-peserta-didik/${id_kelas}`,
          type: "pdf",
          modalMessage: "Harap tunggu, sedang mendapatkan daftar peserta didik...",
          showModal: true,
          onError: (_) => {
            const payload = {
              isShow: true,
              type: "error",
              message: "Terjadi kesalahan saat mendapatkan peserta didik",
            };
            this.$store.dispatch("showError", payload);
          },
        });
    }
  },
};
</script>
