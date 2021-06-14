<template>
  <div class="dasboard">
    <v-card>
      <v-card-title>
        Jadwal Mengajar Tahun Ajaran {{ tahunAjaranAktif.tahun_awal }}/{{ tahunAjaranAktif.tahun_akhir }}
      </v-card-title>
      <v-data-table :headers="headers" :items="jadwal" hide-default-footer>

        <template v-slot:[`item.senin`]="{ item }">
          <div class="table-content">
            <span>
              {{ item.senin.waktu }}
            </span>
            <span>
              {{ item.senin.nama_kelas }}
            </span>
            <span>
              {{ item.senin.mata_pelajaran }}
            </span>
          </div>
        </template>

        <template v-slot:[`item.selasa`]="{ item }">
          <div class="table-content">
            <span>
              {{ item.selasa.waktu }}
            </span>
            <span>
              {{ item.selasa.nama_kelas }}
            </span>
            <span>
              {{ item.selasa.mata_pelajaran }}
            </span>
          </div>
        </template>

        <template v-slot:[`item.rabu`]="{ item }">
          <div class="table-content">
            <span>
              {{ item.rabu.waktu }}
            </span>
            <span>
              {{ item.rabu.nama_kelas }}
            </span>
            <span>
              {{ item.rabu.mata_pelajaran }}
            </span>
          </div>
        </template>

        <template v-slot:[`item.kamis`]="{ item }">
          <div class="table-content">
            <span>
              {{ item.kamis.waktu }}
            </span>
            <span>
              {{ item.kamis.nama_kelas }}
            </span>
            <span>
              {{ item.kamis.mata_pelajaran }}
            </span>
          </div>
        </template>

        <template v-slot:[`item.jumat`]="{ item }">
          <div class="table-content">
            <span>
              {{ item.jumat.waktu }}
            </span>
            <span>
              {{ item.jumat.nama_kelas }}
            </span>
            <span>
              {{ item.jumat.mata_pelajaran }}
            </span>
          </div>
        </template>

        <template v-slot:[`item.sabtu`]="{ item }">
          <div class="table-content">
            <span>
              {{ item.sabtu.waktu }}
            </span>
            <span>
              {{ item.sabtu.nama_kelas }}
            </span>
            <span>
              {{ item.sabtu.mata_pelajaran }}
            </span>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data: () => ({
    headers: [
      {
        text: "Senin",
        value: "senin",
        align: "center",
        sortable: false,
      },
      {
        text: "Selasa",
        value: "selasa",
        align: "center",
        sortable: false,
      },
      {
        text: "Rabu",
        value: "rabu",
        align: "center",
        sortable: false,
      },
      {
        text: "Kamis",
        value: "kamis",
        align: "center",
        sortable: false,
      },
      {
        text: "Jum'at",
        value: "jumat",
        align: "center",
        sortable: false,
      },
      {
        text: "Sabtu",
        value: "sabtu",
        align: "center",
        sortable: false,
      },
    ],
  }),
  computed: {
    ...mapState({
      jadwal: (state) => state.jadwal.jadwal_guru,
      tahunAjaranAktif: (state) => state.tahunAjaran.tahunAjaranAktif,
    }),
  },
  mounted() {
    this.$store.dispatch("tahunAjaran/getTahunAjaranAktif");
    this.$store.dispatch("jadwal/getJadwalGuru");
  },
};
</script>

<style scoped>
.table-content span {
  display: table;
  margin: 0 auto;
  margin-bottom: 0.5rem;
}

.table-content:first-child {
  margin-top: 0.5rem;
}
</style>
