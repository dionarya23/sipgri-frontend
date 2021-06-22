<template>
  <div class="detail-catatan">
    <v-card>
      <v-card-title>
        Kelas {{ tableCatatan.nama_kelas }} catatan untuk
        {{ raport.jenis_penilaian }}
      </v-card-title>
      <v-data-table
        :loading="isLoading"
        :headers="headers"
        :items="tableCatatan.kelas_siswa"
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
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  depressed
                  class="mb-2 text--white"
                  v-bind="attrs"
                  v-on="on"
                  :loading="isLoading"
                  :disabled="isLoading"
                >
                  Tambah Catatan untuk semua
                </v-btn>
              </template>
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
                        v-if="editedItem.nama !== ''"
                        label="Nama Peserta Didik"
                        v-model="editedItem.nama"
                        readonly
                      >
                      </v-text-field>

                      <v-text-field
                        v-else
                        label="Nama Kelas"
                        v-model="tableCatatan.nama_kelas"
                        readonly
                      >
                      </v-text-field>

                      <v-textarea
                        label="Catatan"
                        v-model="editedItem.catatan"
                        :rules="[rulesInputForm.requiredRule]"
                      >
                      </v-textarea>
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
      </v-data-table>
    </v-card>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  data: () => ({
    search: "",
    alertLocal: {
      isShow: false,
      type: "error",
      message: ""
    },
    rulesInputForm: {
      requiredRule: (v) => !!v || "Wajib diisi",
      notMinus: (v) => Number(v) >= 0 || "Tidak boleh kurang dari 0"
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
        text: "Catatan",
        value: "peserta_didik.catatan_wali_kelas.catatan",
        sortable: false
      },
      { text: "Action", value: "actions", sortable: false }
    ],
    editedItem: {
      id_catatan: -1,
      nama: "",
      id_peserta_didik: -1,
      id_raport: -1,
      catatan: ""
    },
    defaultItem: {
      id_catatan: -1,
      nama: "",
      id_peserta_didik: -1,
      id_raport: -1,
      catatan: ""
    },
    editedIndex: -1
  }),
  computed: {
    ...mapState({
      alert: (state) => state.alert,
      isLoading: (state) => state.catatanWaliKelas.isLoading,
      tableCatatan: (state) => state.catatanWaliKelas.tableCatatan,
      raport: (state) => state.absensi.raport
    }),
    tahunAjaranSemester() {
      return `${this.raport.tahun_ajaran.tahun_awal}/${this.raport.tahun_ajaran.tahun_akhir} - Semester ${this.raport.semester}`;
    },
    formTitle() {
      return this.editedIndex === -1
        ? "Tambah Catatan Wali Kelas (Semua Murid)"
        : "Ubah Catatan Wali Kelas per Peserta";
    }
  },
  mounted() {
    this.$store.dispatch(
      "catatanWaliKelas/getTableCatatan",
      this.$route.params.id_raport
    );
    this.$store.dispatch("absensi/getRaport", this.$route.params.id_raport);
  },
  methods: {
    save() {
      if (this.$refs.form.validate()) {
        const { id_peserta_didik, catatan } = this.editedItem;
        let id_raport = parseInt(this.$route.params.id_raport);
        console.log(this.editedIndex);
        if (this.editedIndex === -1) {
          let data = {
            id_raport,
            id_kelas: this.tableCatatan.id_kelas,
            catatan
          };

          this.$store
            .dispatch("catatanWaliKelas/createCatatanForAll", data)
            .then(() => {
              let source = { catatan_wali_kelas: { catatan } };

              this.tableCatatan.kelas_siswa.forEach((e) => {
                Object.assign(e.peserta_didik, source);
              });
              this.close();
            })
            .catch((err) => {
              console.error(err);
              this.close();
            });
        } else if (this.editedItem.id_catatan !== -1) {
          console.log(
            this.tableCatatan.kelas_siswa[this.editedIndex].peserta_didik
              .catatan_wali_kelas.catatan
          );
          // update data
          this.$store
            .dispatch("catatanWaliKelas/updateCatatan", {
              id_catatan: this.editedItem.id_catatan,
              data: {
                catatan
              }
            })
            .then(() => {
              this.tableCatatan.kelas_siswa[
                this.editedIndex
              ].peserta_didik.catatan_wali_kelas.catatan = catatan;
              this.close();
            })
            .catch((err) => {
              console.error(err);
              this.close();
            });
        } else {
          let data = {
            catatan,
            id_peserta_didik,
            id_raport
          };

          this.$store
            .dispatch("catatanWaliKelas/createCatatan", data)
            .then(() => {
              let source = { catatan_wali_kelas: { catatan } };
              Object.assign(
                this.tableCatatan.kelas_siswa[this.editedIndex].peserta_didik,
                source
              );
              this.close();
            })
            .catch((err) => {
              console.error(err);
              this.close();
            });
        }
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

    editItem(item) {
      this.editedIndex = this.tableCatatan.kelas_siswa.indexOf(item);
      console.log(item);
      const { nama } = item.peserta_didik;
      const id_peserta_didik = item.id_peserta_didik;
      if (item.peserta_didik.catatan_wali_kelas !== null) {
        const {
          catatan,
          id_catatan,
          id_raport
        } = item.peserta_didik.catatan_wali_kelas;
        console.log(item.peserta_didik);
        this.editedItem = Object.assign(
          {},
          {
            id_catatan,
            nama,
            id_peserta_didik,
            id_raport,
            catatan
          }
        );
      } else {
        this.editedItem = Object.assign(
          {},
          {
            nama,
            id_peserta_didik,
            id_catatan: -1,
            id_raport: this.raport.id_raport,
            catatan_wali_kelas: null
          }
        );
      }
      this.dialog = true;
    }
  }
};
</script>
