<template>
  <div class="penilaian">
    <v-container>
      <div class="text-center" v-if="isLoading">
         <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
      </div>
    <v-card v-else>
      <v-card-title>
        Daftar Kelas yang Diajar
      </v-card-title>
    <v-data-table
      :headers="headers"
      class="elevation-1"
      :loading="isLoading"
      :items="listKelas"
      hide-default-footer
    >
      <template v-slot:top>
        <v-alert
          :value="alert.isShow"
          :type="alert.type || 'error'"
          transition="slide-y-transition"
        >
          {{ alert.message }}
        </v-alert>
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <v-btn :to="`/detail-isi-nilai/${item.mengajar.kode_mengajar}/${item.id_kelas}`" text color="teal">
          Isi Nilai
        </v-btn>
      </template>
    </v-data-table>
    </v-card>
    </v-container>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  data: () => ({
    headers: [
      {
        text: "Nama Kelas",
        value: "kelas.nama_kelas",
        sortable: false,
      },
      {
        text: "Mata Pelajaran",
        value: "mengajar.mata_pelajaran.mata_pelajaran",
        sortable: false,
      },
      { text: "Aksi", value: "actions", sortable: false },
    ],
  }),
  computed: {
    ...mapState({
      isLoading: (state) => state.nilaiSiswa.isLoading,
      listKelas: (state) => state.nilaiSiswa.listKelas,
      alert: (state) => state.alert,
    }),
  },
  mounted() {
    this.$store.dispatch("nilaiSiswa/getListKelas");
  },
};
</script>
