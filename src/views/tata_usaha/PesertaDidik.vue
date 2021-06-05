<template>
  <div class="peserta_didik">
    <v-data-table
      :loading="isLoading"
      :headers="headers"
      :items="pesertaDidik"
      sort-by="no"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialogUpload" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="secondary"
                depressed
                class="mx-2 text--white"
                v-bind="attrs"
                v-on="on"
                :loading="isLoading"
                :disabled="isLoading"
              >
                Upload Excel Peserta Didik
              </v-btn>
            </template>

            <v-card>
              <v-card-title>
                <span class="headline">Export Peserta Didik</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-alert
                    :value="uploadExcel.isShow"
                    :type="uploadExcel.type || 'error'"
                    transition="slide-y-transition"
                  >
                    {{ uploadExcel.message }}
                  </v-alert>
                  <v-form
                    ref="formUpload"
                    v-model="validUpload"
                    lazy-validation
                  >
                    <v-file-input
                      :rules="rulesUploadExel"
                      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                      placeholder="Choose File"
                      prepend-icon="mdi-upload"
                      label="Choose File"
                      ref="excelFile"
                      v-model="excelFile"
                    ></v-file-input>
                  </v-form>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" outlined @click="closeUpload">
                  Batal
                </v-btn>
                <v-btn
                  color="primary"
                  class="text--white"
                  depressed
                  @click="uploadFile"
                  :disabled="!valid || isLoading"
                >
                  Upload
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- dialog add new data peserta didik -->
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                depressed
                class="mx-2 text--white"
                v-bind="attrs"
                v-on="on"
                :loading="isLoading"
                :disabled="isLoading"
              >
                Tambah Data Peserta Didik
              </v-btn>
            </template>

            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-form ref="form" v-model="valid" lazy-validation> </v-form>
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
          <!-- end of dialog add new data peserta didik -->

          <v-dialog v-model="dialogDelete" max-width="480px">
            <v-card>
              <v-card-title class="headline">Peringatan</v-card-title>
              <v-card-text
                ><p class="text-h6">
                  Apakah anda yakin ingin menghapus data ini?
                </p></v-card-text
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >Batal</v-btn
                >
                <v-btn color="error" text @click="deleteItemConfirm">Ya!</v-btn>
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
    </v-data-table>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data: () => ({
    excelFile: null,
    show1: false,
    valid: true,
    validUpload: true,
    dialog: false,
    dialogUpload: false,
    dialogDelete: false,
    headers: [
      {
        text: "No",
        alignItems: "start",
        value: "no",
      },
      { text: "NISN", value: "nisn", sortable: false },
      { text: "NIS", value: "nis", sortable: false },
      { text: "Nama", value: "nama", sortable: false },
      { text: "Minat Jurusan", value: "minat_jurusan", sortable: false },
      { text: "Tingkat", value: "tingkat" },
    ],
    defaultItem: {},
    editedItem: {},
    editedIndex: -1,
    rulesUploadExel: [
      (v) => !!v || "Wajib diisi",
      (v) =>
        !v ||
        v.size < 2000000 ||
        "Ukuran file excell tidak boleh melebihi 5 MB!",
    ],
    uploadExcel: {
      isShow: false,
      type: "error",
      message: "",
    },
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? "Tambah Data Peserta Didik"
        : "Ubah Data Peserta Didik";
    },
    ...mapState({
      isLoading: (state) => state.pesertaDidik.isLoading,
      alert: (state) => state.alert,
      pesertaDidik: (state) => {
        const { pesertaDidik } = state.pesertaDidik;
        pesertaDidik.map((siswa, index) => {
          siswa.no = index + 1;
        });
        return pesertaDidik;
      },
    }),
  },
  mounted() {
    this.$store.dispatch("pesertaDidik/getAllPesertaDidik");
  },
  methods: {
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
      this.$refs.form.resetValidation();
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {},

    uploadFile() {
      if (this.$refs.formUpload.validate()) {
        let formData = new FormData();
        console.log(this.excelFile);
        formData.append("excel_file", this.excelFile, this.excelFile.name);
        this.$store
          .dispatch("pesertaDidik/uploadExcelFile", formData)
          .then((res) => {
            const { data } = res.data;
            // data.fail_insert masukin ke card baut laporan data yang duplicate
            data.success_insert.map((peserta_didik, index) => {
              this.pesertaDidik.unshift(peserta_didik);
              this.pesertaDidik.map((v, index) => {
                  v.no = index+1
              })
            });
          })
          .catch((err) => console.log("error saat upload excel : ", err));
        this.closeUpload();
      }
    },

    closeUpload() {
      this.dialogUpload = false;
      this.$refs.formUpload.resetValidation();
    },

    deleteItemConfirm() {
      const nip = this.editedItem.nip;
      this.$store.dispatch("user/deleteUser", nip);
      this.closeDelete();
    },
  },
};
</script>
