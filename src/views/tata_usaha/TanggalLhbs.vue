<template>
  <v-data-table
    :loading="isLoading"
    :headers="headers"
    :items="tanggal_lhbs"
    sort-by="no"
    class="elevation-1"
    hide-default-footer
  >
    <template v-slot:[`item.tgl_lhbs`]="{ item }">
      {{ formatDate(item.tgl_lhbs) }}
    </template>

    <template v-slot:top>
      <v-toolbar flat>
        <v-spacer></v-spacer>
        <v-dialog persistent v-model="dialog" max-width="500px">
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

                  <v-text-field
                    v-model="editedItem.semester"
                    label="Semester"
                    readonly
                  ></v-text-field>

                  <v-text-field
                    v-model="editedItem.jenis_penilaian"
                    label="Jenis Penilaian"
                    readonly
                  ></v-text-field>

                  <v-text-field
                    v-model="editedItem.tgl_lhbs"
                    label="Tanggal Pembagian Raport"
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

        <v-dialog persistent v-model="dialogMakeActive" max-width="480px">
          <v-card>
            <v-card-title class="headline">Perhatian!</v-card-title>
            <v-card-text
              ><p class="text-h6">
                Apakah anda yakin ingin mengubah pelaksanaan ini
                menjadi aktif ?
              </p></v-card-text
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeMakeActive"
                >Batal</v-btn
              >
              <v-btn color="green" text @click="makeActiveItemConfirm"
                >Ya!</v-btn
              >
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
      <v-row align="center">
      <v-btn
        v-if="item.status_pelaksanaan === 'Tidak Aktif'"
        color="success"
        text
        @click="makeAtive(item)"
      >
        Aktifkan
      </v-btn>
      <v-icon small class="mr-2" @click="editItem(item)">
        mdi-pencil
      </v-icon>
      </v-row>
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
    dialogMakeActive: false,
    alertLocal: {
      isShow: false,
      type: "",
      message: "",
    },
    headers: [
      { text: "Jenis Raport", value: "jenis_penilaian", sortable: false },
      { text: "Semester", value: "semester", sortable: false },
      { text: "Tanggal Pembagian Raport", value: "tgl_lhbs", sortable: false},
      {
        text: "Status Pelaksanaan",
        value: "status_pelaksanaan",
        sortable: false,
      },
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
        : "Ubah Tanggal Pembagian Raport";
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
    mounted() {
      this.$store.dispatch("raport/getTanggalLHBSByStatusAktif");
    },
  },
  methods: {
    formatDate(date) {
      if (date !== null) {
        const [tahun, bulan, tanggal] = date.split("-");
        return `${tanggal} ${this.bulan[bulan]} ${tahun}`;
      } else {
        return "";
      }
    },

    closeMakeActive() {
      this.dialogMakeActive = false;
      this.close();
    },

    makeAtive(item) {
      this.editedIndex = this.tanggal_lhbs.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogMakeActive = true;
    },

    makeActiveItemConfirm() {
      this.$store
        .dispatch("raport/updateStatusPelaksanaan", this.editedItem.id_raport)
        .then((_) => {
          this.tanggal_lhbs.map((item) => {
            if (item.id_raport === this.editedItem.id_raport) {
              item.status_pelaksanaan = "Aktif";
            } else {
              item.status_pelaksanaan = "Tidak Aktif";
            }
          });
          this.closeMakeActive();
        })
        .catch((err) => {
          console.log(err);
          this.closeMakeActive();
        });
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
      this.oldTanggalLHBS = { ...item };
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
            const { tgl_lhbs } = this.editedItem;
            this.$store
              .dispatch("raport/createTanggalLHBS", this.editedItem)
              .then((res) => {
                const { data } = res.data;
                console.log("tgl_lhbs : ", _this.editedItem.tgl_lhbs);
                data.tgl_lhbs = tgl_lhbs;
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
              item.semester === this.editedItem.semester &&
              this.oldTanggalLHBS.semester !== item.semester &&
              item.jenis_penilaian === this.editedItem.jenis_penilaian &&
              this.oldTanggalLHBS.jenis_penilaian !== item.jenis_penilaian
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
            const id_raport = this.editedItem.id_raport;
            delete this.editedItem.id_raport;
            const editedItem = this.tanggal_lhbs[this.editedIndex];
            this.$store
              .dispatch("raport/updateTanggalLHBS", {
                id_raport,
                data: this.editedItem,
              })
              .then((_) => {
                this.editedItem.id_raport = id_raport;
                Object.assign(editedItem, this.editedItem);
                this.close();
              })
              .catch((err) => {
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
