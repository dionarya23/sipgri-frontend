<template>
  <div class="detail-prestasi">
    <v-card>
      <v-card-title>
        Kelas {{ prestasi.nama_kelas }} prestasi untuk
        {{ raport.jenis_penilaian }}
      </v-card-title>
      <v-data-table
        :loading="isLoading"
        :headers="headers"
        :items="prestasi.kelas_siswa"
        :expanded.sync="expanded"
        item-key="id_peserta_didik"
        show-expand
        class="elevation-1"
        sort-by="no"
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
            <v-dialog persistent v-model="dialog" max-width="500px">
              <v-card>
                <v-card-title>
                  {{ formTitle }}
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-alert
                      :value="alert.isShow"
                      :type="alert.type || 'error'"
                      transition="slide-y-transition"
                    >
                      {{ alert.message }}
                    </v-alert>
                    <v-form ref="form" v-model="valid" lazy-validation>
                      <v-alert
                        :value="alertLocal.isShow"
                        :type="alertLocal.type || 'error'"
                        transition="slide-y-transition"
                      >
                        {{ alertLocal.message }}
                      </v-alert>

                      <v-text-field
                        label="Tahun Ajaran - Semester"
                        v-model="tahunAjaranSemester"
                        readonly
                      >
                      </v-text-field>

                      <v-text-field
                        label="Jenis Penilaian"
                        v-model="raport.jenis_penilaian"
                        readonly
                      >
                      </v-text-field>

                      <v-text-field
                        label="Nama Peserta Didik"
                        v-model="editedItem.nama"
                        readonly
                      >
                      </v-text-field>

                      <div class="text-left mb-4">
                        <v-btn
                          class="mx-2"
                          fab
                          dark
                          small
                          color="primary"
                          @click="addPrestasi"
                        >
                          <v-icon dark>
                            mdi-plus
                          </v-icon>
                        </v-btn>

                        <v-btn
                          class="mx-2"
                          fab
                          dark
                          small
                          color="danger"
                          v-if="isPrestasiOne"
                          @click="removePrestasi"
                        >
                          <v-icon dark>
                            mdi-minus
                          </v-icon>
                        </v-btn>
                      </div>

                      <div
                        class="mb-2"
                        v-for="(prestasi, index) in editedItem.prestasi"
                        :key="prestasi.id_prestasi"
                      >
                        <span>Prestasi ke-{{ index + 1 }}</span>
                        <v-text-field
                          label="Jenis Kegiatan"
                          v-model="prestasi.jenis_kegiatan"
                          :rules="[rulesInputForm.requiredRule]"
                        >
                        </v-text-field>
                        <v-textarea
                          rows="3"
                          label="Keterangan"
                          v-model="prestasi.keterangan_kegiatan"
                          :rules="[rulesInputForm.requiredRule]"
                        >
                        </v-textarea>
                      </div>
                    </v-form>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" outlined @click="close">
                    Batal
                  </v-btn>
                  <v-btn
                    color="primary"
                    class="text--white"
                    depressed
                    @click="save"
                    :disabled="!valid || isLoading"
                  >
                    Simpan
                  </v-btn>
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

        <template v-slot:[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
        </template>

        <template v-slot:no-data>
          <p class="mt-4">Belum ada data yang bisa ditampilkan.</p>
        </template>
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length" class="pa-2">
            <v-list subheader three-line>
              <v-subheader><h2>Daftar Prestasi</h2></v-subheader>

              <v-list-item v-if="item.peserta_didik.prestasi.length === 0">
                <v-list-item-content>
                  <v-list-item-title>Belum memiliki prestasi</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item
                v-else
                v-for="e in item.peserta_didik.prestasi"
                :key="e.id_prestasi"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ e.jenis_kegiatan }}</v-list-item-title>
                  <v-list-item-subtitle>{{
                    e.keterangan_kegiatan
                  }}</v-list-item-subtitle>
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
export default {
  data: () => ({
    expanded: [],
    search: "",
    alertLocal: {
      isShow: false,
      type: "error",
      message: ""
    },
    rulesInputForm: {
      requiredRule: (v) => !!v || "Wajib diisi"
    },
    valid: true,
    dialog: false,
    headers: [
      {
        text: "NISN",
        value: "peserta_didik.nisn",
        sortable: false
      },
      {
        text: "NIS",
        value: "peserta_didik.nis",
        sortable: false
      },
      {
        text: "Nama",
        value: "peserta_didik.nama"
      },
      {
        text: "Jumlah Prestasi",
        value: "peserta_didik.prestasi.length",
        sortable: false
      },
      { text: "Action", value: "actions", sortable: false },
      { text: "", value: "data-table-expand" }
    ],
    editedItem: {
      nama: "",
      id_peserta_didik: -1,
      id_raport: -1,
      prestasi: []
    },
    defaultItem: {
      nama: "",
      id_peserta_didik: -1,
      id_raport: -1,
      prestasi: []
    },
    editedIndex: -1
  }),
  computed: {
    ...mapState({
      alert: (state) => state.alert,
      isLoading: (state) => state.prestasi.isLoading,
      prestasi: (state) => state.prestasi.prestasi,
      raport: (state) => state.absensi.raport
    }),
    tahunAjaranSemester() {
      return `${this.raport.tahun_ajaran.tahun_awal}/${this.raport.tahun_ajaran.tahun_akhir} - Semester ${this.raport.semester}`;
    },
    formTitle() {
      return "Tambah Prestasi Peserta Didik";
    },
    isPrestasiOne() {
      return this.editedItem.prestasi.length > 1;
    }
  },
  mounted() {
    this.$store.dispatch("prestasi/getPrestasi", this.$route.params.id_raport);
    this.$store.dispatch("absensi/getRaport", this.$route.params.id_raport);
  },
  methods: {
    save() {
      if (this.$refs.form.validate()) {
        const { id_peserta_didik, prestasi } = this.editedItem;
        let id_raport = parseInt(this.$route.params.id_raport);
        let data = {
          id_peserta_didik,
          id_raport,
          list_prestasi: prestasi
        };

        this.$store
          .dispatch("prestasi/createPrestasi", data)
          .then(() => {
            this.prestasi.kelas_siswa[
              this.editedIndex
            ].peserta_didik.prestasi = [...this.editedItem.prestasi];
            this.close();
          })
          .catch((err) => {
            console.error(err);
            this.close();
          });
      }
      this.valid = false;
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        this.oldAbsensi = {};
      });
      this.$refs.form.resetValidation();
    },

    addPrestasi() {
      this.editedItem.prestasi.push({
        jenis_kegiatan: "",
        keterangan_kegiatan: ""
      });
    },

    removePrestasi() {
      this.editedItem.prestasi.pop();
    },

    editItem(item) {
      this.editedIndex = this.prestasi.kelas_siswa.indexOf(item);
      const { nama } = item.peserta_didik;
      const id_peserta_didik = item.id_peserta_didik;
      if (item.peserta_didik.prestasi.length !== 0) {
        this.editedItem = Object.assign(
          {},
          {
            nama,
            id_peserta_didik,
            id_raport: this.$route.params.id_raport,
            prestasi: item.peserta_didik.prestasi
          }
        );
      } else {
        this.editedItem = Object.assign(
          {},
          {
            nama,
            id_peserta_didik,
            id_raport: this.$route.params.id_raport,
            prestasi: [{ jenis_kegiatan: "", keterangan_kegiatan: "" }]
          }
        );
      }
      console.log(this.editedItem);
      this.dialog = true;
    }
  }
};
</script>
