<template>
  <div class="mata_pelajaran">
    <v-data-table
      :loading="isLoading"
      :headers="headers"
      :items="jadwal"
      class="elevation-1"
      sort-by="no"
    >
      <template v-slot:[`item.jam_mulai`]="{ item }">
        {{ formatTime(item.jam_mulai) }}
      </template>

      <template v-slot:[`item.jam_selesai`]="{ item }">
        {{ formatTime(item.jam_selesai) }}
      </template>

      <template v-slot:top>
        <v-toolbar flat>
          <v-autocomplete
            class="mt-8"
            v-model="kelasSelected"
            :items="lisKelasWithIndex"
            :loading="isLoading"
            item-text="nama_kelas"
            item-value="index"
            color="white"
            label="Filter Berdasarkan Kelas"
            @change="changeEditedItemIdKelas"
          ></v-autocomplete>

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
                Tambah Data
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
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
                      :value="
                        `${tahunAjaranAktif.tahun_awal}/${tahunAjaranAktif.tahun_akhir}`
                      "
                      label="Tahun Ajaran"
                      readonly
                    ></v-text-field>

                    <v-autocomplete
                      v-model="editedItem.id_kelas"
                      item-text="nama_kelas"
                      item-value="id_kelas"
                      label="Kelas"
                      :items="list_kelas"
                      disabled
                    >
                    </v-autocomplete>

                    <v-autocomplete
                      v-model="editedItem.hari"
                      label="Hari"
                      :items="list_hari"
                      :rules="[rulesInputForm.requiredRule]"
                      @change="setKeterangan"
                    >
                    </v-autocomplete>

                    <v-select
                      v-model="editedItem.keterangan"
                      label="Keterangan Jadwal"
                      :items="list_keterangan"
                      :rules="[rulesInputForm.requiredRule]"
                      :disabled="keteranganAvail"
                      @change="setWaktu"
                    >
                    </v-select>

                    <v-autocomplete
                      v-model="id_mata_pelajaran"
                      label="Mata Pelajaran"
                      item-text="mata_pelajaran"
                      item-value="id_mata_pelajaran"
                      :items="guru_mengajar_filtered"
                      :rules="[rulesInputForm.requiredRule]"
                      @change="setPengajar"
                      v-if="editedItem.keterangan == 'Mata Pelajaran'"
                    >
                    </v-autocomplete>

                    <v-autocomplete
                      v-if="editedItem.keterangan == 'Mata Pelajaran'"
                      v-model="idGuruSelected"
                      label="Guru Mata Pelajaran"
                      item-text="guru.nama"
                      item-value="id_guru"
                      :items="pengajar"
                      :rules="[rulesInputForm.requiredRule]"
                      :disabled="id_mata_pelajaran === ''"
                      @change="changeKodeMengajar"
                    >
                    </v-autocomplete>

                    <v-text-field
                      v-if="editedItem.keterangan == 'Mata Pelajaran'"
                      :value="editedItem.kode_mengajar"
                      label="Kode Mengajar"
                      readonly
                    >
                    </v-text-field>

                    <v-col cols="11" sm="5">
                      <v-menu
                        ref="menu"
                        v-model="menuJamMulai"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="editedItem.jam_mulai"
                            label="Jam Mulai"
                            prepend-icon="mdi-clock-time-four-outline"
                            readonly
                            disabled
                            v-bind="attrs"
                            v-on="on"
                            :rules="[rulesInputForm.requiredRule]"
                          ></v-text-field>
                        </template>

                        <v-time-picker
                          v-if="menuJamMulai"
                          v-model="editedItem.jam_mulai"
                          full-width
                          format="24hr"
                          @click:minute="setJamMulaiDanSelesai"
                          :max="editedItem.jam_selesai"
                        ></v-time-picker>

                      </v-menu>
                    </v-col>

                    <v-col cols="11" sm="5">
                      <v-menu
                        ref="menu2"
                        v-model="menuJamSelesai"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="editedItem.jam_selesai"
                            label="Jam Selesai"
                            prepend-icon="mdi-clock-time-four-outline"
                            readonly
                            disabled
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                       
                      </v-menu>
                    </v-col>
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
        <v-icon
          v-if="item.keterangan === 'Mata Pelajaran'" 
          small
          class="mr-2" 
          @click="editItem(item)">
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
import moment from "moment";
export default {
  data: () => ({
    alertLocal: {
      isShow: false,
      type: "error",
      message: "",
    },
    dialogDelete: false,
    valid: true,
    kelasSelected: {
      index: 0,
    },
    dialog: false,
    id_mata_pelajaran: "",
    pengajar: [],
    durasi_belajar: 0,
    menuJamMulai: false,
    menuJamSelesai: false,
    idGuruSelected: "",
    headers: [
      {
        text: "No",
        alignItems: "start",
        value: "no",
      },
      { text: "Kelas", value: "kelas.nama_kelas" },
      {
        text: "Keterangan",
        value: "keterangan",
      },
      { text: "Guru", value: "mengajar.guru.nama" },
      { text: "Kode Mengajar", value: "kode_mengajar" },
      {
        text: "Mata Pelajaran",
        value: "mengajar.mata_pelajaran.mata_pelajaran",
      },
      { text: "Hari", value: "hari" },
      { text: "Jam Mulai", value: "jam_mulai" },
      { text: "Jam Selesai", value: "jam_selesai" },
      { text: "Aksi", value: "actions", sortable: false },
    ],
    editedIndex: -1,
    list_hari: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"],
    editedItem: {
      id_jadwal: "",
      id_tahun_ajaran: "",
      id_kelas: "",
      kode_mengajar: "",
      jam_mulai: "",
      jam_selesai: "",
      hari: "",
      keterangan: "",
      tahun_ajaran: {
        tahun_awal: "",
        tahun_akhir: "",
      },
      kelas: {
        nama_kelas: "",
      },
      mengajar: {
        kode_mengajar: "",
        id_guru: "",
        id_mata_pelajaran: "",
        guru: {
          nama: "",
        },
        mata_pelajaran: {
          mata_pelajaran: "",
        },
      },
    },
    list_keterangan: ["Mata Pelajaran"],
    defaultItem: {
      id_jadwal: "",
      id_tahun_ajaran: "",
      id_kelas: "",
      kode_mengajar: "",
      jam_mulai: "",
      jam_selesai: "",
      hari: "",
      keterangan: "",
      tahun_ajaran: {
        tahun_awal: "",
        tahun_akhir: "",
      },
      kelas: {
        nama_kelas: "",
      },
      mengajar: {
        kode_mengajar: "",
        id_guru: "",
        id_mata_pelajaran: "",
        guru: {
          nama: "",
        },
        mata_pelajaran: {
          mata_pelajaran: "",
        },
      },
    },
    oldJadwal: {},
    rulesInputForm: {
      requiredRule: (v) => !!v || "Wajib diisi",
    },
    id_kelas_selected: "",
    keteranganAvail: true,
    guruMengajarBackup: [],
    durasiBelajar: ["45", "90"],
  }),
  computed: {
    ...mapState({
      tahunAjaranAktif: (state) => state.tahunAjaran.tahunAjaranAktif,
      isLoading: (state) => state.jadwal.isLoading,
      alert: (state) => state.alert,
      list_kelas: (state) => state.jadwal.kelas,
      guru_mengajar: (state) => state.jadwal.guru_mengajar,
      jadwal2: (state) => {
        const { jadwal } = state.jadwal;
        jadwal.map((item, index) => {
          if (item.keterangan === "Mata Pelajaran") {
            item.no = index + 1;
          } else {
            item.no = index + 1;
            item.kode_mengajar = "-";
            item.mengajar = {
              mata_pelajaran: {
                mata_pelajaran: "-",
              },
              guru: {
                nama: "-",
              },
            };
          }
        });
        return jadwal;
      },
    }),
    jadwal() {
      let index =
        typeof this.kelasSelected.index === "undefined"
          ? this.kelasSelected
          : this.kelasSelected.index;
      this.id_kelas_selected = this.list_kelas[index].id_kelas;
      return this.jadwal2.filter(
        (jadwal) => jadwal.id_kelas == this.list_kelas[index].id_kelas
      );
    },

    formTitle() {
      return this.editedIndex === -1
        ? "Tambah Data Jadwal"
        : "Ubah Data Jadwal";
    },

    lisKelasWithIndex() {
      this.list_kelas.sort((a, b) =>
        a.nama_kelas > b.nama_kelas ? 1 : b.nama_kelas > a.nama_kelas ? -1 : 0
      );
      return this.list_kelas.map((e, index) => ({
        index,
        nama_kelas: e.nama_kelas,
        id_kelas: e.id_kelas,
      }));
    },

    guru_mengajar_filtered() {
      let mapelFiltered = [];
      this.guru_mengajar.map(mapel => {
      
        if (this.durasiBelajar.includes(mapel.durasi_belajar)) {
          mapelFiltered.push(mapel);
        }
        
      })
      return mapelFiltered;
    }
  },

  mounted() {
    Promise.all([
      this.$store.dispatch("jadwal/getJadwalByTahunAjaranAktif"),
      this.$store.dispatch("jadwal/getGuruMengajar"),
    ])
      .then((values) => {
        const [res1, _] = values;
        const { kelas } = res1.data.data;
        this.editedItem.id_kelas =
          typeof kelas[0] !== "undefined" ? kelas[0].id_kelas : "";
      })
      .catch((err) => {
        console.log("Error : ", err);
      });
  },

  methods: {
    openDialoag() {
      this.dialog = true;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        this.id_mata_pelajaran = "";
        this.idGuruSelected = "";
        this.pengajar = [];
      });
      this.$refs.form.resetValidation();
    },

    setKeterangan() {
      const jadwalFiltered = this.jadwal.filter(
        (j) => j.hari == this.editedItem.hari
      );

      let durasiMenit = 0;
      jadwalFiltered.map(jadwal => {
        let jam_selesai = moment(jadwal.jam_selesai, "HH:mm:ss");
        let jam_mulai_array = jadwal.jam_mulai.split(":");
        let jam_mulai = moment(`${jam_mulai_array[0]}:${jam_mulai_array[1]}:00`, "HH:mm:ss");
        durasiMenit += jam_selesai.diff(jam_mulai, "minutes");
      });

      if (this.editedItem.hari === "Senin") {
        if (jadwalFiltered.length === 0) {
          this.list_keterangan = ["Upacara", "Baca Al-Quran dan Shalat Dhuha"];
        } else if (durasiMenit === 90 || durasiMenit === 255) {
          this.durasiBelajar = ["45"];
        } else if (durasiMenit === 135) {
          this.list_keterangan = ["Istirahat Pertama"];
        } else if (durasiMenit < 300 && durasiMenit > 135) {
          this.list_keterangan = ["Mata Pelajaran"];
        } else if (durasiMenit === 300) {
          this.list_keterangan = ["Istirahat Kedua"];
        } else if (durasiMenit > 300) {
          this.list_keterangan = ["Mata Pelajaran"];
        }
      }else{
        if (jadwalFiltered.length === 0) {
          this.list_keterangan = ["Baca Al-Quran dan Shalat Dhuha"];
        } else if (durasiMenit === 105 || durasiMenit === 270) {
          this.durasiBelajar = ["45"];
        } else if (durasiMenit === 150) {
          this.list_keterangan = ["Istirahat Pertama"];
        } else if (durasiMenit < 315 && durasiMenit > 150) {
          this.list_keterangan = ["Mata Pelajaran"];
        } else if (durasiMenit === 315) {
          this.list_keterangan = ["Istirahat Kedua"];
        } else if (durasiMenit > 315) {
          this.list_keterangan = ["Mata Pelajaran"];
        }

      }

      this.keteranganAvail = false;
    },

    // setwaktu jadwal
    setWaktu() {
      if (this.editedItem.keterangan === "Upacara") {
        this.editedItem.jam_mulai = "07:15";
        this.editedItem.jam_selesai = "08:00";
      } else if (this.editedItem.keterangan === "Baca Al-Quran dan Shalat Dhuha") {
        this.editedItem.jam_mulai = "07:00";
        this.editedItem.jam_selesai = "07:15";
      } else if (this.editedItem.keterangan === "Istirahat Pertama" || this.editedItem.keterangan === "Istirahat Kedua") {
        const jadwalFiltered = this.jadwal.filter(
          (j) => j.hari == this.editedItem.hari
        );

          const lastJadwal = jadwalFiltered[0];
          let arrayJamMulai = lastJadwal.jam_selesai.split(":");
          this.editedItem.jam_mulai = `${arrayJamMulai[0]}:${arrayJamMulai[1]}`;
          this.editedItem.jam_selesai = moment(this.editedItem.jam_mulai, "HH:mm")
          .add(30, "minutes").format("HH:mm");
      }
    
    },

    changeEditedItemIdKelas() {
      let kelasSelected = this.list_kelas[this.kelasSelected];
      this.editedItem.id_kelas = kelasSelected.id_kelas;
    },

    setPengajar() {
      this.idGuruSelected = "";
      this.editedItem.kode_mengajar = "";
      const pengajar = this.guru_mengajar.filter(
        (e) => e.id_mata_pelajaran == this.id_mata_pelajaran
      );

       this.durasi_belajar = parseInt(pengajar[0].durasi_belajar);
       const jadwalFiltered = this.jadwal.filter(
        (j) => j.hari == this.editedItem.hari
      );

       const lastJadwal = jadwalFiltered[0];
       let arrayJamMulai = lastJadwal.jam_selesai.split(":");
       this.editedItem.jam_mulai = `${arrayJamMulai[0]}:${arrayJamMulai[1]}`;
       this.editedItem.jam_selesai = moment(this.editedItem.jam_mulai, "HH:mm")
       .add(this.durasi_belajar, "minutes").format("HH:mm");
       this.pengajar = pengajar[0].pengajar;
    },

    changeKodeMengajar() {
      this.editedItem.kode_mengajar = "";
      const pengajarSelected = this.pengajar.filter(
        (item) => item.id_guru == this.idGuruSelected
      )[0];
      this.editedItem.kode_mengajar = pengajarSelected.kode_mengajar;
    },

    formatTime(item) {
      const [jam, menit, _] = item.split(":");
      return `${jam}:${menit}`;
    },

    close() {
      this.dialog = false;
      this.defaultItem.id_kelas = this.id_kelas_selected;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        this.id_mata_pelajaran = "";
        this.idGuruSelected = "";
        this.pengajar = [];
      });
       this.keteranganAvail = true;
      this.$refs.form.resetValidation();
    },

    editItem(item) {
      this.editedIndex = this.jadwal.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.oldJadwal = { ...item };
      this.editedItem.jam_mulai = this.formatTime(this.editedItem.jam_mulai);
      this.editedItem.jam_selesai = this.formatTime(
        this.editedItem.jam_selesai
      );
      if (this.editedItem.keterangan === "Mata Pelajaran") {
        this.id_mata_pelajaran = this.editedItem.mengajar.id_mata_pelajaran;
        const pengajar = this.guru_mengajar.filter(
          (e) => e.id_mata_pelajaran == this.id_mata_pelajaran
        );
        this.pengajar = pengajar[0].pengajar;
        this.idGuruSelected = this.editedItem.mengajar.id_guru;
      }

      this.dialog = true;
    },

    closeDelete() {
      this.$nextTick(() => {
        this.editedItem = this.defaultItem;
        this.editedIndex = -1;
      });
      this.dialogDelete = false;
    },

    deleteItem(item) {
      this.editedIndex = this.jadwal.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      const id_jadwal = this.editedItem.id_jadwal;
      this.$store
        .dispatch("jadwal/deleteJadwal", id_jadwal)
        .then((_) => {
          this.jadwal.splice(this.editedIndex, 1);
          this.closeDelete();
        })
        .catch((err) => {
          this.closeDelete();
          console.log(err);
        });
    },

    setJamMulaiDanSelesai() {
      let jam_selesai = moment(
        `${this.editedItem.jam_mulai}:10 AM`,
        "h:mm:ss A"
      )
        .add(this.durasi_belajar, "minutes")
        .format("LTS")
        .split(":");
      this.editedItem.jam_selesai = `${jam_selesai[0]}:${jam_selesai[1]}`;
      this.$refs.menu.save(this.editedItem.jam_mulai);
    },

    save() {
      if (this.$refs.form.validate()) {
        if (this.editedIndex === -1) {
          const {
            id_kelas,
            kode_mengajar,
            jam_mulai,
            jam_selesai,
            hari,
            keterangan,
          } = this.editedItem;

          const jadwalFromInput = {
            id_tahun_ajaran: this.tahunAjaranAktif.id_tahun_ajaran,
            id_kelas,
            kode_mengajar,
            jam_mulai: `${jam_mulai}:10`,
            jam_selesai: `${jam_selesai}:00`,
            hari,
            id_guru: this.idGuruSelected,
            keterangan,
          };

          const isJadwalGuruExist =
            this.jadwal.filter((item) => {
              const jamMulaiCurrent = new Date(
                `01/01/2001 ${item.jam_mulai}`
              ).getTime();
              const jamSelesaiCurrent = new Date(
                `01/01/2001 ${item.jam_selesai}`
              ).getTime();

              const jamMulaiInput = new Date(
                `01/01/2001 ${jadwalFromInput.jam_mulai}`
              ).getTime();
              const jamSelesaiInput = new Date(
                `01/01/2001 ${jadwalFromInput.jam_selesai}`
              ).getTime();

              const guruScheduleExist =
                item.hari === jadwalFromInput.hari &&
                item.mengajar.id_guru === this.idGuruSelected &&
                Math.min(jamMulaiCurrent, jamSelesaiCurrent) <=
                  Math.max(jamMulaiInput, jamSelesaiInput) &&
                Math.max(jamMulaiCurrent, jamSelesaiCurrent) >=
                  Math.min(jamMulaiInput, jamSelesaiInput);
              return guruScheduleExist;
            }).length > 0;

          // validasi apakah ada guru yang jadwal nya bentrok
          if (jadwalFromInput.keterangan === "Mata Pelajaran") {
            if (isJadwalGuruExist) {
              this.alertLocal = {
                isShow: true,
                type: "error",
                message: `Guru memiliki jadwal yang bentrok pada hari dan jam yang sama`,
              };

              setTimeout(() => {
                this.alertLocal.isShow = false;
              }, 6000);
              this.valid = true;
            }
          }

          const isClassScheduleExist =
            this.jadwal.filter((item) => {
              const jamMulaiCurrent = new Date(
                `01/01/2001 ${item.jam_mulai}`
              ).getTime();
              const jamSelesaiCurrent = new Date(
                `01/01/2001 ${item.jam_selesai}`
              ).getTime();

              const jamMulaiInput = new Date(
                `01/01/2001 ${jadwalFromInput.jam_mulai}`
              ).getTime();
              const jamSelesaiInput = new Date(
                `01/01/2001 ${jadwalFromInput.jam_selesai}`
              ).getTime();

              const classScheduleExist =
                item.hari === jadwalFromInput.hari &&
                item.id_kelas === jadwalFromInput.id_kelas &&
                Math.min(jamMulaiCurrent, jamSelesaiCurrent) <=
                  Math.max(jamMulaiInput, jamSelesaiInput) &&
                Math.max(jamMulaiCurrent, jamSelesaiCurrent) >=
                  Math.min(jamMulaiInput, jamSelesaiInput);
              return classScheduleExist;
            }).length > 0;

          if (isClassScheduleExist) {
            this.alertLocal = {
              isShow: true,
              type: "error",
              message: `Jadwal yang dimasukan mengalami bentrok di hari dan jam yang sama harap periksa kembali`,
            };

            setTimeout(() => {
              this.alertLocal.isShow = false;
            }, 6000);
            this.valid = true;
          } else {
            this.$store.dispatch("jadwal/createJadwal", jadwalFromInput);
            this.close();
          }
        } else {
          const {
            id_kelas,
            kode_mengajar,
            jam_mulai,
            jam_selesai,
            hari,
            keterangan,
          } = this.editedItem;

          const jadwalFromInput = {
            id_tahun_ajaran: this.tahunAjaranAktif.id_tahun_ajaran,
            id_kelas,
            kode_mengajar,
            jam_mulai: `${jam_mulai}:10`,
            jam_selesai: `${jam_selesai}:00`,
            hari,
            id_guru: this.idGuruSelected,
            keterangan: keterangan === "" ? "Mata Pelajaran" : keterangan,
          };
          const isJadwalGuruExist =
            this.jadwal.filter((item) => {
              const jamMulaiCurrent = new Date(
                `01/01/2001 ${item.jam_mulai}:01`
              ).getTime();
              const jamSelesaiCurrent = new Date(
                `01/01/2001 ${item.jam_selesai}:00`
              ).getTime();

              const jamMulaiInput = new Date(
                `01/01/2001 ${jadwalFromInput.jam_mulai}`
              ).getTime();
              const jamSelesaiInput = new Date(
                `01/01/2001 ${jadwalFromInput.jam_selesai}`
              ).getTime();

              const guruScheduleExist =
                item.id_jadwal !== this.editedItem.id_jadwal
                  ? item.hari === jadwalFromInput.hari &&
                    item.mengajar.id_guru === this.idGuruSelected &&
                    Math.min(jamMulaiCurrent, jamSelesaiCurrent) <=
                      Math.max(jamMulaiInput, jamSelesaiInput) &&
                    Math.max(jamMulaiCurrent, jamSelesaiCurrent) >=
                      Math.min(jamMulaiInput, jamSelesaiInput)
                  : item.no === 0;

              return guruScheduleExist;
            }).length > 0;

          const isClassScheduleExist =
            this.jadwal.filter((item) => {
              const jamMulaiCurrent = new Date(
                `01/01/2001 ${item.jam_mulai}`
              ).getTime();
              const jamSelesaiCurrent = new Date(
                `01/01/2001 ${item.jam_selesai}`
              ).getTime();

              const jamMulaiInput = new Date(
                `01/01/2001 ${jadwalFromInput.jam_mulai}`
              ).getTime();
              const jamSelesaiInput = new Date(
                `01/01/2001 ${jadwalFromInput.jam_selesai}`
              ).getTime();

              const classScheduleExist =
                item.id_jadwal !== this.editedItem.id_jadwal
                  ? item.hari === jadwalFromInput.hari &&
                    item.id_kelas === jadwalFromInput.id_kelas &&
                    Math.min(jamMulaiCurrent, jamSelesaiCurrent) <=
                      Math.max(jamMulaiInput, jamSelesaiInput) &&
                    Math.max(jamMulaiCurrent, jamSelesaiCurrent) >=
                      Math.min(jamMulaiInput, jamSelesaiInput)
                  : item.no === 0;
              return classScheduleExist;
            }).length > 0;

          if (isJadwalGuruExist) {
            this.alertLocal = {
              isShow: true,
              type: "error",
              message: `Guru memiliki jadwal yang bentrok pada hari dan jam yang sama`,
            };

            setTimeout(() => {
              this.alertLocal.isShow = false;
            }, 6000);
            this.valid = true;
          } else if (isClassScheduleExist) {
            this.alertLocal = {
              isShow: true,
              type: "error",
              message: `Jadwal yang dimasukan mengalami bentrok di hari dan jam yang sama harap periksa kembali`,
            };

            setTimeout(() => {
              this.alertLocal.isShow = false;
            }, 6000);
            this.valid = true;
          } else {
            const update = {
              id_jadwal: this.editedItem.id_jadwal,
              data: jadwalFromInput,
            };
            this.$store
              .dispatch("jadwal/updateJadwal", update)
              .then((res) => {
                // const {
                //   id_kelas,
                //   kode_mengajar,
                //   jam_mulai,
                //   jam_selesai,
                //   hari,
                //   keterangan,
                //   tahun_ajaran,
                //   kelas,
                //   mengajar,
                // } = res.data.data;
                // console.log(
                //   "Data Sebelum diubah : ",
                //   this.jadwal[this.editedIndex],
                //   this.jadwal[this.editedIndex].hari
                // );
                // this.jadwal[this.editedIndex].id_kelas = id_kelas;
                // this.jadwal[this.editedIndex].kode_mengajar = kode_mengajar;
                // this.jadwal[this.editedIndex].jam_mulai = jam_mulai;
                // this.jadwal[this.editedIndex].jam_selesai = jam_selesai;
                // this.jadwal[this.editedIndex].hari = hari;
                // this.jadwal[this.editedIndex].keterangan = keterangan;
                // this.jadwal[this.editedIndex].tahun_ajaran = tahun_ajaran;
                // this.jadwal[this.editedIndex].kelas = kelas;
                // this.jadwal[this.editedIndex].mengajar = mengajar;
                // console.log(
                //   "Data Sesudah diubah : ",
                //   this.jadwal[this.editedIndex],
                //   this.jadwal[this.editedIndex].hari
                // );
                this.close();
              })
              .catch((err) => {
                console.log("error : ", err);
                this.close();
              });
          }
        }
      }
      this.valid = false;
    },
  },
};
</script>
