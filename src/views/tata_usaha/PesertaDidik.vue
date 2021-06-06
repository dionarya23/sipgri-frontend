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
                <span class="headline">Import Peserta Didik</span>
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
                  <v-form ref="form" v-model="valid" lazy-validation>
                    <v-text-field
                      v-model="editedItem.nama"
                      label="Nama"
                      type="text"
                      @keyup="forceUpper"
                      :rules="requiredRule"
                    ></v-text-field>

                    <v-text-field
                      v-model="editedItem.nisn"
                      label="NISN"
                      type="number"
                      :rules="requiredRule"
                    >
                    </v-text-field>

                    <v-text-field
                      v-model="editedItem.nis"
                      label="NIS"
                      type="number"
                      :rules="requiredRule"
                    >
                    </v-text-field>

                    <v-radio-group
                      v-model="editedItem.jenis_kelamin"
                      column
                      :rules="requiredRule"
                    >
                      <v-radio label="Perempuan" value="perempuan"></v-radio>
                      <v-radio label="Laki-Laki" value="laki-laki"></v-radio>
                    </v-radio-group>

                    <v-autocomplete
                      label="Agama"
                      :items="listAgama"
                      v-model="editedItem.agama"
                      :rules="requiredRule"
                    ></v-autocomplete>

                    <v-text-field
                      v-model="editedItem.tempat_lahir"
                      label="Tempat Lahir"
                      :rules="requiredRule"
                    >
                    </v-text-field>

                    <v-text-field
                      v-model="editedItem.tanggal_lahir"
                      label="Tanggal Lahir"
                      type="date"
                      :rules="requiredRule"
                    >
                    </v-text-field>

                    <v-text-field
                      v-model="editedItem.status_dalam_keluarga"
                      label="Status Dalam Keluarga"
                      :rules="requiredRule"
                    >
                    </v-text-field>

                    <v-text-field
                      v-model="editedItem.anak_ke"
                      label="Anak Ke"
                      type="number"
                      :rules="requiredRule"
                    >
                    </v-text-field>

                    <v-textarea
                      label="Alamat"
                      :rules="requiredRule"
                      v-model="editedItem.alamat"
                    ></v-textarea>

                    <v-text-field
                      v-model="editedItem.nomor_telepon"
                      label="Nomor Telepon"
                      type="number"
                      :rules="phoneNumberRules"
                    >
                    </v-text-field>

                    <v-text-field
                      v-model="editedItem.sekolah_asal"
                      label="Sekolah Asal"
                      :rules="requiredRule"
                    >
                    </v-text-field>

                     <v-text-field
                      v-model="editedItem.tanggal_diterima"
                      label="Tanggal Diterima"
                      type="date"
                      :rules="requiredRule"
                    >
                    </v-text-field>

                    <v-text-field
                      v-model="editedItem.nama_ayah"
                      label="Nama Ayah"
                    >
                    </v-text-field>

                    <v-text-field
                      v-model="editedItem.nama_ibu"
                      label="Nama Ibu"
                    >
                    </v-text-field>

                    <v-text-field
                      v-model="editedItem.nama_wali"
                      label="Nama Wali"
                    >
                    </v-text-field>

                    <v-text-field
                      v-model="editedItem.nomor_telepon_rumah"
                      label="Nomor Telepon Perwakilan Rumah"
                      type="number"
                      :rules="phoneNumberRules"
                    >
                    </v-text-field>

                    <v-text-field
                      v-model="editedItem.nem"
                      label="NEM"
                      type="number"
                      :rules="requiredRule"
                    >
                    </v-text-field>

                    <v-autocomplete
                      label="Jurusan"
                      :items="listJurusan"
                      v-model="editedItem.minat_jurusan"
                      :rules="requiredRule"
                    ></v-autocomplete>

                    <v-autocomplete
                      label="Tingkat Kelas"
                      :items="listTingkatKelas"
                      v-model="editedItem.tingkat"
                      :rules="requiredRule"
                    ></v-autocomplete>
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
          <!-- end of dialog add new data peserta didik -->

          <!-- dialog duplicate peserta didik -->
          <v-dialog v-model="dialogDuplicate" max-width="900px">
            <v-card>
              <v-card-title>
                <span class="headline">Perhatian!!</span>
              </v-card-title>

              <v-card-text>
                <v-alert
                  border="left"
                  color="red"
                  dense
                  icon="mdi-alert"
                  outlined
                  type="error"
                >
                  Berhasil menambahkan {{ jumlah_sukses }} peserta didik dan
                  terdapat {{ fail_insert.length }} peserta didik yang gagal di
                  import, harap cek kembali data nisn, nis agar terhindar
                  duplikasi data
                </v-alert>
              </v-card-text>

              <v-data-table
                :loading="isLoading"
                :headers="headersDuplicate"
                :items="fail_insert"
                sort-by="no"
                class="elevation-1"
              >
              </v-data-table>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  class="text--white"
                  depressed
                  @click="closeDuplicate"
                  :disabled="!valid || isLoading"
                >
                  Ok
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- end of duplicate data peserta didik -->

          <!-- <v-dialog v-model="dialogDelete" max-width="480px">
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
          </v-dialog> -->
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
        <!-- <v-icon small @click="deleteItem(item)">
          mdi-delete
        </v-icon> -->
      </template>

      <template v-slot:no-data>
        <p class="mt-4">Belum ada data yang bisa ditampilkan.</p>
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
    dialogDuplicate: false,
    jumlah_duplicate: 0,
    fail_insert: [],
    jumlah_sukses: 0,
    listAgama: ["Islam", "Kristen", "Hindu", "Buddha", "Konghucu"],
    listTingkatKelas: ["X", "XI", "XII"],
    listJurusan: ["IPA", "IPS"],
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
      { text: "Aksi", value: "actions", sortable: false },
    ],
    headersDuplicate: [
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
    defaultItem: {
      nisn: "",
      nis: "",
      nama: "",
      jenis_kelamin: "",
      agama: "",
      tempat_lahir: "",
      tanggal_lahir: "",
      status_dalam_keluarga: "",
      anak_ke: "",
      alamat: "",
      nomor_telepon: "",
      sekolah_asal: "",
      tanggal_diterima: "",
      nama_ayah: "",
      nama_ibu: "",
      nama_wali: "",
      nomor_telepon_rumah: "",
      nem: "",
      minat_jurusan: "",
      tingkat: "",
    },
    editedItem: {
      nisn: "",
      nis: "",
      nama: "",
      jenis_kelamin: "",
      agama: "",
      tempat_lahir: "",
      tanggal_lahir: "",
      status_dalam_keluarga: "",
      anak_ke: "",
      alamat: "",
      nomor_telepon: "",
      sekolah_asal: "",
      tanggal_diterima: "",
      nama_ayah: "",
      nama_ibu: "",
      nama_wali: "",
      nomor_telepon_rumah: "",
      nem: "",
      minat_jurusan: "",
      tingkat: "",
    },
    editedIndex: -1,
    rulesUploadExel: [
      (v) => !!v || "Wajib diisi",
      (v) =>
        !v ||
        v.size < 2000000 ||
        "Ukuran file excell tidak boleh melebihi 5 MB!",
    ],
    phoneNumberRules: [
      (v) => !!v || "Wajib diisi",
      (v) =>
        /^(^\+62|62|^08)(\d{3,4}-?){2}\d{3,4}$/g.test(v) ||
        "Nomor telepon tidak valid",
    ],
    requiredRule: [(v) => !!v || "Wajib diisi"],
    uploadExcel: {
      isShow: false,
      type: "error",
      message: "",
    },
    bulan: {
      "01" : "Januari",
      "02" : "Februari",
      "03" : "Maret",
      "04" : "April",
      "05" : "Mei",
      "06" : "Juni",
      "07" : "Juli",
      "08" : "Agustus",
      "09" : "September",
      "10" : "Oktober",
      "11" : "November",
      "12" : "Desember"
    }
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
    forceUpper() {
      this.editedItem.nama = this.editedItem.nama.toUpperCase();
    },
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

    save() {
      if (this.$refs.form.validate()) {
        this.editedItem.tanggal_lahir = this.convertInputDateToString(this.editedItem.tanggal_lahir)
        this.editedItem.tanggal_diterima = this.convertInputDateToString(this.editedItem.tanggal_diterima)
        this.$store.dispatch("pesertaDidik/createNewPesertaDidik",this.editedItem )
        .then(res => {
            const { data } = res.data
              this.pesertaDidik.unshift(data);
              this.pesertaDidik.map((v, index) => {
                v.no = index + 1;
              });
              this.close()
        }).catch(err => console.log(err))
      }

    },

    convertInputDateToString(date) {
      let dateArray = date.split("-");

      return `${dateArray[2]} ${this.bulan[dateArray[1]]} ${dateArray[0]}`;
    },

    uploadFile() {
      if (this.$refs.formUpload.validate()) {
        let formData = new FormData();
        console.log(this.excelFile);
        formData.append("excel_file", this.excelFile, this.excelFile.name);
        this.$store
          .dispatch("pesertaDidik/uploadExcelFile", formData)
          .then((res) => {
            const { data } = res.data;

            if (data.fail_insert.length > 0) {
              this.dialogDuplicate = true;
              data.fail_insert.map((v, index) => {
                v.no = index + 1;
              });
              this.fail_insert = data.fail_insert;
            }

            this.jumlah_sukses = data.success_insert.length;
            data.success_insert.map((peserta_didik) => {
              this.pesertaDidik.unshift(peserta_didik);
              this.pesertaDidik.map((v, index) => {
                v.no = index + 1;
              });
            });
          })
          .catch((err) => console.log("error saat upload excel : ", err));
        this.closeUpload();
      }
    },

    closeDuplicate() {
      this.fail_insert = [];
      this.jumlah_sukses = 0;
      this.dialogDuplicate = false;
    },

    closeUpload() {
      this.dialogUpload = false;
      this.$refs.formUpload.resetValidation();
    },

    // deleteItemConfirm() {
    //   const id_peserta_didik = this.editedItem.id_peserta_didik;
    //   this.$store.dispatch("pesertaDidik/deletePesertaDidik", id_peserta_didik);
    //   this.closeDelete();
    // },

    //  deleteItem(item) {
    //   this.editedIndex = this.pesertaDidik.indexOf(item);
    //   this.editedItem = Object.assign({}, item);
    //   this.dialogDelete = true;
    // },
  },
};
</script>
