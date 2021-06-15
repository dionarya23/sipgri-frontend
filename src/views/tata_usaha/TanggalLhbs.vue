<template>
  <v-data-table
    :loading="isLoading"
    :headers="headers"
    :items="tanggal_lhbs"
    sort-by="no"
    class="elevation-1"
  >
    <template v-slot:[`item.tgl_lhbs`]="{ item }">
      {{ formatDate(item.tgl_lhbs) }}
    </template>

    <template v-slot:top>
      <v-toolbar flat>
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
              Tambah Tanggal LHBS
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-alert
                    :value="alertLocal.isShow"
                    :type="alertLocal.type || 'error'"
                    transition="slide-y-transition"
                  >
                    {{ alertLocal.message }}
                  </v-alert>

                  <v-text-field
                    v-model="tahun_aktif"
                    label="Tahun Ajaran Aktif"
                    readonly
                  ></v-text-field>

                  <v-select
                    v-model="editedItem.semester"
                    :items="[1, 2]"
                    :rules="requiredRule"
                    label="Semester"
                  ></v-select>
                  <v-select
                    v-model="editedItem.jenis_penilaian"
                    :items="jenis_penilaian"
                    :rules="requiredRule"
                    label="Jenis Penilaian"
                    :disabled="editedItem.semester == 0 ? true : false"
                  ></v-select>

                  <v-text-field
                    v-model="editedItem.tgl_lhbs"
                    label="Tanggal LHBS"
                    :rules="requiredRule"
                    type="date"
                  ></v-text-field>
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
</template>
<script>
import { mapState } from "vuex";
export default {
  data: () => ({
    valid: true,
    alertLocal: {
      isShow: false,
      type: "",
      message: "",
    },
    headers: [
      { text: "Tanggal LHBS", value: "tgl_lhbs" },
      { text: "Semester", value: "semester", sortable: false },
      { text: "Jenis Penilaian", value: "jenis_penilaian", sortable: false },
      { text: "Aksi", value: "actions", sortable: false },
    ],
    editedIndex: -1,
    dialog: false,
    editedItem: {
      id_raport: 0,
      tgl_lhbs: "",
      id_tahun_ajaran: 0,
      semester: 0,
      jenis_penilaian: "",
    },
    defaultItem: {
      id_raport: 0,
      tgl_lhbs: "",
      id_tahun_ajaran: 0,
      semester: 0,
      jenis_penilaian: "",
    },
    oldTanggalLHBS: {},
    requiredRule: [(v) => !!v || "Wajib Diisi"],
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
        ? "Tambah Tanggal LHBS"
        : "Ubah Tanggal LHBS";
    },
    ...mapState({
      isLoading: (state) => state.raport.isLoading,
      tanggal_lhbs: (state) => state.raport.tanggal_lhbs,
      tahun_ajaran_aktif: (state) => state.raport.tahun_ajaran_aktif,
      tahun_aktif: (state) =>
        `${state.raport.tahun_ajaran_aktif.tahun_awal}/${state.raport.tahun_ajaran_aktif.tahun_akhir}`,
      alert: (state) => state.alert,
      jenis_penilaian() {
        if (this.editedItem.semester === 1) {
          return ["Penilaian Tengah Semester 1", "Penilaian Akhir Semester"];
        } else if (this.editedItem.semester === 2) {
          return ["Penilaian Tengah Semester 2", "Penilaian Akhir Tahun"];
        }
      },
    }),
  },

  methods: {
    formatDate(date) {
      const [tahun, bulan, tanggal] = date.split("-");
      return `${tanggal} ${this.bulan[bulan]} ${tahun}`;
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
      this.$refs.form.resetValidation();
    },

    editItem(item) {
      this.editedIndex = this.tanggal_lhbs.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.oldTanggalLHBS = {...item}
      this.dialog = true;
    },

    save() {
      if (this.$refs.form.validate()) {
         
        if (this.editedIndex === -1) {
          delete this.editedItem.id_raport;
          this.editedItem.id_tahun_ajaran = this.tahun_ajaran_aktif.id_tahun_ajaran;
          const isTanggalLHBSExist = this.tanggal_lhbs.filter(
            (item) =>
              item.semester === this.editedItem.semester &&
              item.jenis_penilaian === this.editedItem.jenis_penilaian
          );

          if (isTanggalLHBSExist.length > 0) {
            this.alertLocal = {
              isShow: true,
              type: "error",
              message: `Data Semester ${this.editedItem.semester} dan ${this.editedItem.jenis_penilaian} yang anda masukan sudah ada`,
            };
            setTimeout(() => {
              this.alertLocal.isShow = false;
            }, 6000);
            this.valid = false;
          } else {
            let _this = this;
            const { tgl_lhbs } = this.editedItem
            this.$store
              .dispatch("raport/createTanggalLHBS", this.editedItem)
              .then((res) => {
                const { data } = res.data;
                console.log("tgl_lhbs : ", _this.editedItem.tgl_lhbs);
                data.tgl_lhbs = tgl_lhbs
                _this.tanggal_lhbs.push(data);
              })
              .catch((err) => {
                console.log(err);
              });
            this.close();
          }
        } else {
          //update data
          const isTanggalLHBSExist = this.tanggal_lhbs.filter(
            (item) =>
              (item.semester === this.editedItem.semester && this.oldTanggalLHBS.semester !== item.semester) &&
              (item.jenis_penilaian === this.editedItem.jenis_penilaian && this.oldTanggalLHBS.jenis_penilaian !== item.jenis_penilaian)
          );

          if (isTanggalLHBSExist.length > 0) {
            this.alertLocal = {
              isShow: true,
              type: "error",
              message: `Data Semester ${this.editedItem.semester} dan ${this.editedItem.jenis_penilaian} yang anda masukan sudah ada`,
            };
            setTimeout(() => {
              this.alertLocal.isShow = false;
            }, 6000);
            this.valid = false;
          } else {
            this.editedItem.id_tahun_ajaran = this.tahun_ajaran_aktif.id_tahun_ajaran;
            const id_raport = this.editedItem.id_raport
            delete this.editedItem.id_raport
            const editedItem = this.tanggal_lhbs[this.editedIndex];
            this.$store.dispatch("raport/updateTanggalLHBS", {id_raport, data : this.editedItem})
            .then(_ => {
              this.editedItem.id_raport = id_raport;
              Object.assign(editedItem, this.editedItem);
              this.close();
            }).catch(err => {
              console.log(err);
              this.close();
            });
          }

        }
      } else {
        this.valid = false;
      }
    },
  },
};
</script>
