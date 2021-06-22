<template>
  <div class="nilai-kkm">
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
      { text: "Action", value: "actions", sortable: false },
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
