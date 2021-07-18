<template>
  <div class="peserta_didik">
    <v-data-table
      :loading="isLoading"
      :headers="headers"
      :items="pesertaDidik"
      :search="search"
      sort-by="no"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Cari Berdasarkan Nama, Minat Jurusan, Nis, Nisn"
            single-line
            hide-details
          ></v-text-field>
          <v-spacer></v-spacer>

          <v-dialog persistent v-model="dialogNaikKelas" max-width="480px">
                 <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  depressed
                  class="mx-2 texr--white"
                  :loading="isLoading"
                  :disabled="isLoading || raportAktif.jenis_penilaian !== 'Penilaian Akhir Tahun' || isAlreadyNaikKelas"
                  v-bind="attrs"
                  v-on="on"
                >
                Naikan Kelas Siswa
                </v-btn>
                </template>

                <v-card>
                  <v-card-title class="headline">Peringatan</v-card-title>
                  <v-card-text
                    ><p class="text-h6">
                      Apakah anda yakin ingin menaikan kelas siswa?
                    </p></v-card-text
                  >
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeNaikanKelas"
                      >Batal</v-btn
                    >
                    <v-btn color="success" text @click="naikKelasConfirm">Ya!</v-btn>
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>


          <v-dialog persistent v-model="dialogUpload" max-width="500px">
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
                Import dari Excel
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
                      :rules="[rulesValidation.required, rulesValidation.size]"
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
          <v-dialog persistent v-model="dialog" max-width="500px">
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
                Tambah Data
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
                      :rules="[rulesValidation.required]"
                    ></v-text-field>

                    <v-text-field
                      v-model="editedItem.nisn"
                      :error-messages="is_nisn_avail"
                      @keyup="checkAvailable('nisn')"
                      label="NISN"
                      type="number"
                      :rules="[rulesValidation.required]"
                    >
                    </v-text-field>

                    <v-text-field
                      v-model="editedItem.nis"
                      :error-messages="is_nis_avail"
                      @keyup="checkAvailable('nis')"
                      label="NIS"
                      type="number"
                      :rules="[rulesValidation.required]"
                    >
                    </v-text-field>

                    <v-radio-group
                      v-model="editedItem.jenis_kelamin"
                      column
                      :rules="[rulesValidation.required]"
                    >
                      <v-radio label="Perempuan" value="Perempuan"></v-radio>
                      <v-radio label="Laki-Laki" value="Laki-Laki"></v-radio>
                    </v-radio-group>

                    <v-autocomplete
                      label="Agama"
                      :items="listAgama"
                      v-model="editedItem.agama"
                      :rules="[rulesValidation.required]"
                    ></v-autocomplete>

                    <v-text-field
                      v-model="editedItem.tempat_lahir"
                      label="Tempat Lahir"
                      :rules="[rulesValidation.required]"
                    >
                    </v-text-field>

                    <v-text-field
                      v-model="editedItem.tanggal_lahir"
                      label="Tanggal Lahir"
                      type="date"
                      :rules="[rulesValidation.required]"
                    >
                    </v-text-field>

                    <v-text-field
                      v-model="editedItem.status_dalam_keluarga"
                      label="Status Dalam Keluarga"
                      :rules="[rulesValidation.required]"
                    >
                    </v-text-field>

                    <v-text-field
                      v-model="editedItem.anak_ke"
                      label="Anak Ke"
                      type="number"
                      :rules="[rulesValidation.required]"
                    >
                    </v-text-field>

                    <v-textarea
                      label="Alamat"
                      :rules="[rulesValidation.required]"
                      v-model="editedItem.alamat"
                    ></v-textarea>

                    <v-text-field
                      v-model="editedItem.nomor_telepon"
                      label="Nomor Telepon"
                      :error-messages="is_nomor_telepon_avail"
                      @keyup="checkAvailable('nomor_telepon')"
                      type="text"
                      :rules="[
                        rulesValidation.required,
                        rulesValidation.phoneNumberFormat,
                      ]"
                    >
                    </v-text-field>

                    <v-text-field
                      v-model="editedItem.sekolah_asal"
                      label="Sekolah Asal"
                      :rules="[rulesValidation.required]"
                    >
                    </v-text-field>

                    <v-text-field
                      v-model="editedItem.tanggal_diterima"
                      label="Tanggal Diterima"
                      type="date"
                      :rules="[rulesValidation.required]"
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
                      :error-messages="is_nomor_telepon_rumah_avail"
                      @keyup="checkAvailable('nomor_telepon_rumah')"
                      type="text"
                      :rules="[
                        rulesValidation.required,
                        rulesValidation.phoneNumberFormat,
                      ]"
                    >
                    </v-text-field>

                    <v-text-field
                      v-model="editedItem.nem"
                      label="NEM"
                      type="number"
                      :rules="[rulesValidation.required]"
                    >
                    </v-text-field>

                    <v-autocomplete
                      label="Jurusan"
                      :items="listJurusan"
                      v-model="editedItem.minat_jurusan"
                      :rules="[rulesValidation.required]"
                    ></v-autocomplete>

                    <v-autocomplete
                      label="Tingkat Kelas"
                      :items="listTingkatKelas"
                      v-model="editedItem.tingkat"
                      :rules="[rulesValidation.required]"
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
          <v-dialog persistent v-model="dialogDuplicate" max-width="900px">
            <v-card>
              <v-card-title>
                <span class="headline">Perhatian!!</span>
              </v-card-title>

              <v-card-text>
                <v-alert
                  border="left"
                  color="red"
                  dense
                  icon="mdi-alert-circle-outline"
                  outlined
                  type="error"
                >
                  {{ messageBerhasil(jumlah_sukses) }}
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
          <v-dialog persistent v-model="dialogDelete" max-width="480px">
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

      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon small @click="deleteItem(item)">
          mdi-delete
        </v-icon>
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
    dialogNaikKelas: false,
    is_nis_avail: "",
    is_nisn_avail: "",
    is_nomor_telepon_avail: "",
    is_nomor_telepon_rumah_avail: "",
    jumlah_duplicate: 0,
    fail_insert: [],
    jumlah_sukses: 0,
    search: "",
    listAgama: ["Islam", "Kristen", "Hindu", "Buddha", "Konghucu"],
    listTingkatKelas: ["X", "XI", "XII"],
    listJurusan: ["MIPA", "IPS"],
    headers: [
      {
        text: "No",
        alignItems: "start",
        value: "no",
      },
      { text: "NISN", value: "nisn", sortable: false },
      { text: "NIS", value: "nis", sortable: false },
      { text: "Nama", value: "nama", sortable: false },
      { text: "Jenis Kelamin", value: "jenis_kelamin", sortable: false },
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
      { text: "Jenis Kelamin", value: "jenis_kelamin", sortable: false },
      { text: "Jurusan", value: "minat_jurusan", sortable: false },
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
      nomor_telepon: 0,
      sekolah_asal: "",
      tanggal_diterima: "",
      nama_ayah: "",
      nama_ibu: "",
      nama_wali: "",
      nomor_telepon_rumah: 0,
      nem: "",
      minat_jurusan: "",
      tingkat: "",
    },
    oldPesertaDidik: {},
    editedIndex: -1,
    rulesValidation: {
      required: (v) => !!v || "Wajib diisi",
      phoneNumberFormat: (v) =>
        /^(^\+62|62|^08)(\d{3,4}-?){2}\d{3,4}$/g.test(v) ||
        "Nomor telepon tidak valid",
      size: (v) =>
        !v ||
        v.size < 2000000 ||
        "Ukuran file excell tidak boleh melebihi 5 MB!",
    },
    uploadExcel: {
      isShow: false,
      type: "error",
      message: "",
    },
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
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? "Tambah Data Peserta Didik"
        : "Ubah Data Peserta Didik";
    },

    ...mapState({
      isLoading: (state) => state.pesertaDidik.isLoading,
      naikKelas: (state) => state.pesertaDidik.isAlreadyNaikKelas,
      alert: (state) => state.alert,
      pesertaDidik: (state) => {
        const { pesertaDidik } = state.pesertaDidik;
        pesertaDidik.map((siswa, index) => {
          siswa.no = index + 1;
        });
        return pesertaDidik;
      },
      raportAktif: (state) => state.cetakRaport.raportAktif
    }),

    isAlreadyNaikKelas() {
      return this.naikKelas === `true_${this.raportAktif.jenis_penilaian}${this.raportAktif.id_raport}`
    }
  },
  mounted() {
    this.$store.dispatch("pesertaDidik/getAllPesertaDidik");
    this.$store.dispatch("cetakRaport/getRaportAktif");
  },
  methods: {
    closeNaikanKelas(){
      this.dialogNaikKelas = false;
    },

    // confirm untuk naik kelas
    naikKelasConfirm(){
      this.$store.dispatch("pesertaDidik/naikKelas");
      this.closeNaikanKelas();
    },

    messageBerhasil(jumlahBerhasil) {
      return jumlahBerhasil !== 0 ? `Berhasil menambahkan ${jumlahBerhasil} peserta didik dan` : ""
    },
    forceUpper() {
      this.editedItem.nama = this.editedItem.nama.toUpperCase();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
      this.oldPesertaDidik = {};
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
        this.editedItem.tanggal_lahir = this.convertInputDateToString(
          this.editedItem.tanggal_lahir
        );
        this.editedItem.tanggal_diterima = this.convertInputDateToString(
          this.editedItem.tanggal_diterima
        );
        
        if (this.editedIndex > -1) {
          const editedItem = this.pesertaDidik[this.editedIndex];
          this.$store
            .dispatch("pesertaDidik/updatePesertaDidik", {
              updatedData: this.editedItem,
            })
            .then((_) => {
              this.editedItem.no = this.editedIndex + 1;
              Object.assign(editedItem, this.editedItem);
              this.close();
            })
            .catch((err) => console.log(err));
        } else {
          this.$store
            .dispatch("pesertaDidik/createNewPesertaDidik", this.editedItem)
            .then((res) => {
              const { data } = res.data;
              this.pesertaDidik.unshift(data);
              this.pesertaDidik.map((v, index) => {
                v.no = index + 1;
              });
              this.close();
            })
            .catch((err) => console.log(err));
        }
      }
    },

    convertInputDateToString(date) {
      let [tahun, bulan, tanggal] = date.split("-");

      return `${tanggal} ${this.bulan[bulan]} ${tahun}`;
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

    editItem(item) {
      this.editedIndex = this.pesertaDidik.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.oldPesertaDidik = { ...item };
      let [
        tanggal_lahir,
        bulan_lahir,
        tahun_lahir,
      ] = this.editedItem.tanggal_lahir.split(" ");
      let [
        tanggal_diterima,
        bulan_diterima,
        tahun_diterima,
      ] = this.editedItem.tanggal_diterima.split(" ");
      this.editedItem.tanggal_lahir = `${tahun_lahir}-${this.getKeyByValue(
        this.bulan,
        bulan_lahir
      )}-${tanggal_lahir}`;
      this.editedItem.tanggal_diterima = `${tahun_diterima}-${this.getKeyByValue(
        this.bulan,
        bulan_diterima
      )}-${tanggal_diterima}`;
      this.dialog = true;
    },

    deleteItemConfirm() {
      const id_peserta_didik = this.editedItem.id_peserta_didik;
      this.$store.dispatch("pesertaDidik/deletePesertaDidik", id_peserta_didik);
      this.closeDelete();
    },

     deleteItem(item) {
      this.editedIndex = this.pesertaDidik.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    getKeyByValue(object, value) {
      return Object.keys(object).find((key) => object[key] === value);
    },

    checkAvailable(typeAttribute) {
      let isPesertaDidikExist = this.pesertaDidik.filter(
        (siswa) => siswa[typeAttribute] === this.editedItem[typeAttribute]
      );
      if (this.editedIndex === -1) {
        this[`is_${typeAttribute}_avail`] =
          isPesertaDidikExist.length !== 0
            ? `${typeAttribute} sudah digunakan oleh peserta didik yang lain`
            : "";
      } else {
        this[`is_${typeAttribute}_avail`] =
          this.oldPesertaDidik[typeAttribute] !==
            this.editedItem[typeAttribute] && isPesertaDidikExist.length !== 0
            ? `${typeAttribute} sudah digunakan oleh peserta didik yang lain`
            : "";
      }
    },
  },
};
</script>
