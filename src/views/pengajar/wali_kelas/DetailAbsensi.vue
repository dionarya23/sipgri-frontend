<template>
  <div class="detail-absensi">
    <v-card>
      <v-card-title>
        Kelas {{ nama_kelas }} absensi untuk
        {{ raport.jenis_penilaian }}
      </v-card-title>
      <v-data-table
        :loading="isLoading"
        :headers="headers"
        :items="detail_kelas"
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
                        label="Absensi untuk Jenis Penilaian"
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

                      <v-text-field
                        label="Tanpa Keterangan"
                        v-model="editedItem.alpha"
                        type="number"
                        :rules="[
                          rulesInputForm.requiredRule,
                          rulesInputForm.notMinus
                        ]"
                      >
                      </v-text-field>

                      <v-text-field
                        label="Sakit"
                        v-model="editedItem.sakit"
                        type="number"
                        :rules="[
                          rulesInputForm.requiredRule,
                          rulesInputForm.notMinus
                        ]"
                      >
                      </v-text-field>

                      <v-text-field
                        label="Izin"
                        v-model="editedItem.izin"
                        type="number"
                        :rules="[
                          rulesInputForm.requiredRule,
                          rulesInputForm.notMinus
                        ]"
                      >
                      </v-text-field>
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
        text: "Tanpa Keterangan",
        value: "peserta_didik.absensi_siswa.alpha",
        sortable: false
      },
      {
        text: "Izin",
        value: "peserta_didik.absensi_siswa.izin",
        sortable: false
      },
      {
        text: "Sakit",
        value: "peserta_didik.absensi_siswa.sakit",
        sortable: false
      },
      { text: "Aksi", value: "actions", sortable: false }
    ],
    editedItem: {
      id_absensi: -1,
      nama: "",
      id_peserta_didik: -1,
      id_raport: -1,
      alpha: "",
      izin: "",
      sakit: ""
    },
    defaultItem: {
      id_absensi: -1,
      nama: "",
      id_peserta_didik: -1,
      id_raport: -1,
      alpha: "",
      izin: "",
      sakit: ""
    },
    editedIndex: -1
  }),
  computed: {
    ...mapState({
      alert: (state) => state.alert,
      isLoading: (state) => state.absensi.isLoading,
      detail_kelas: (state) => state.absensi.detail_kelas.kelas_siswa,
      raport: (state) => state.absensi.raport,
      nama_kelas: (state) => state.absensi.detail_kelas.nama_kelas
    }),
    tahunAjaranSemester() {
      return `${this.raport.tahun_ajaran.tahun_awal}/${this.raport.tahun_ajaran.tahun_akhir} - Semester ${this.raport.semester}`;
    },
    formTitle() {
      return this.editedIndex === -1
        ? "Tambah Data Absensi"
        : "Ubah Data Absensi";
    }
  },
  mounted() {
    this.$store.dispatch(
      "absensi/getAbsensiByWaliKelas",
      this.$route.params.id_raport
    );

    this.$store.dispatch("absensi/getRaport", this.$route.params.id_raport);
  },
  methods: {
    save() {
      if (this.$refs.form.validate()) {
        const {
          id_peserta_didik,
          alpha,
          izin,
          sakit,
          id_raport
        } = this.editedItem;
        if (this.editedItem.id_absensi === -1) {
          // membuat data baru

          this.$store
            .dispatch("absensi/createAbsensi", {
              id_peserta_didik,
              alpha,
              sakit,
              izin,
              id_raport
            })
            .then((res) => {
              const { data } = res.data;
              console.log(
                this.detail_kelas[this.editedIndex].peserta_didik.absensi_siswa
              );
              this.detail_kelas[
                this.editedIndex
              ].peserta_didik.absensi_siswa = {};
              console.log(
                this.detail_kelas[this.editedIndex].peserta_didik.absensi_siswa
              );

              this.detail_kelas[
                this.editedIndex
              ].peserta_didik.absensi_siswa.id_absensi = data.id_absensi;
              this.detail_kelas[
                this.editedIndex
              ].peserta_didik.absensi_siswa.id_raport = data.id_raport;
              this.detail_kelas[
                this.editedIndex
              ].peserta_didik.absensi_siswa.alpha = data.alpha;
              this.detail_kelas[
                this.editedIndex
              ].peserta_didik.absensi_siswa.sakit = data.sakit;
              this.detail_kelas[
                this.editedIndex
              ].peserta_didik.absensi_siswa.izin = data.izin;

              this.close();
            })
            .catch((err) => {
              console.error(err);
              this.close();
            });
        } else {
          // update data
          this.$store
            .dispatch("absensi/updateAbsensi", {
              id_absensi: this.editedItem.id_absensi,
              data: {
                id_peserta_didik,
                alpha,
                sakit,
                izin,
                id_raport
              }
            })
            .then((_) => {
              this.detail_kelas[
                this.editedIndex
              ].peserta_didik.absensi_siswa.alpha = alpha;
              this.detail_kelas[
                this.editedIndex
              ].peserta_didik.absensi_siswa.izin = izin;
              this.detail_kelas[
                this.editedIndex
              ].peserta_didik.absensi_siswa.sakit = sakit;
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
      this.editedIndex = this.detail_kelas.indexOf(item);
      const { nama, id_peserta_didik } = item.peserta_didik;
      if (item.peserta_didik.absensi_siswa !== null) {
        const {
          alpha,
          izin,
          sakit,
          id_absensi,
          id_raport
        } = item.peserta_didik.absensi_siswa;
        this.editedItem = Object.assign(
          {},
          {
            id_absensi,
            nama,
            id_peserta_didik,
            id_raport,
            alpha,
            izin,
            sakit
          }
        );
      } else {
        this.editedItem = Object.assign(
          {},
          {
            nama,
            id_peserta_didik,
            id_absensi: -1,
            id_raport: this.raport.id_raport,
            alpha: null,
            izin: null,
            sakit: null
          }
        );
      }
      this.dialog = true;
    }
  }
};
</script>
