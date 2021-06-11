<template>
  <div class="mata_pelajaran">
    <v-data-table
      :loading="isLoading"
      :headers="headers"
      :items="jadwal"
      class="elevation-1"
      sort-by="no"
      :search="search"
    >
    <template v-slot:[`item.jam_mulai`]="{ item }">
      {{ formatTime(item.jam_mulai) }}
    </template>

    <template v-slot:[`item.jam_selesai`]="{ item }">
      {{ formatTime(item.jam_selesai) }}
    </template>

      <template v-slot:top>
        <v-toolbar flat>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Cari Berdasarkan Kelas, Hari, Mata Pelajaran, Guru"
            single-line
            hide-details
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
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
                        :value="`${tahunAjaranAktif.tahun_awal}/${tahunAjaranAktif.tahun_akhir}`"
                        label="Tahun Ajaran"
                        disabled
                    ></v-text-field>

                    <v-autocomplete
                       v-model="editedItem.id_kelas"
                       item-text="nama_kelas"
                       item-value="id_kelas"
                       label="Kelas"
                       :items="list_kelas"
                       :rules="[rulesInputForm.requiredRule]"
                    >
                     </v-autocomplete>

                    <v-autocomplete
                       v-model="editedItem.hari"
                       label="Hari"
                       :items="list_hari"
                       :rules="[rulesInputForm.requiredRule]"
                    >
                    </v-autocomplete>

                    <v-autocomplete
                       label="Guru"
                       :items="guru_mengajar"
                       item-text="nama"
                       item-value="id_user"
                       :rules="[rulesInputForm.requiredRule]"
                    >
                    </v-autocomplete>
                    
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
    alertLocal: {
      isShow: false,
      type: "error",
      message: "",
    },
    search: "",
    dialogDelete: false,
    valid: true,
    dialog: false,
    headers: [
      {
        text: "No",
        alignItems: "start",
        value: "no",
      },
      { text: "Kelas", value: "kelas.nama_kelas" },
      { text: "Guru", value: "mengajar.guru.nama" },
      { text: "Kode Mengajar", value: "kode_mengajar"},
      { text: "Mata Pelajaran", value: "mengajar.mata_pelajaran.mata_pelajaran"},
      { text: "Hari", value: "hari" },
      { text: "Jam Mulai", value: "jam_mulai" },
      { text: "Jam Selesai", value: "jam_selesai" },
      { text: "Action", value: "actions", sortable: false },
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
            tahun_akhir: ""
        },
        kelas: {
            nama_kelas: ""
        },
        mengajar: {
            kode_mengajar: "",
            id_guru: "",
            id_mata_pelajaran: "",
            guru: {
                nama: ""
            },
            mata_pelajaran: {
                mata_pelajaran: ""
            }
        }
    },
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
            tahun_akhir: ""
        },
        kelas: {
            nama_kelas: ""
        },
        mengajar: {
            kode_mengajar: "",
            id_guru: "",
            id_mata_pelajaran: "",
            guru: {
                nama: ""
            },
            mata_pelajaran: {
                mata_pelajaran: ""
            }
        }
    },
    oldJadwal: {},
    rulesInputForm: {
      requiredRule: (v) => !!v || "Wajib diisi",
    },
  }),
  computed: {
    ...mapState({
      tahunAjaranAktif: (state) => state.tahunAjaran.tahunAjaranAktif,
      isLoading: (state) => state.jadwal.isLoading,
      alert: (state) => state.alert,
      list_kelas: (state) => state.kelas.kelas,
      guru_mengajar: (state) => state.jadwal.guru_mengajar,
      jadwal: (state) => {
        const { jadwal } = state.jadwal;
        jadwal.map((item, index) => {
          item.no = index + 1;
        });
        return jadwal;
      },
    }),
    formTitle() {
      return this.editedIndex === -1
        ? "Tambah Data Jadwal"
        : "Ubah Data Jadwal";
    },
  },
  mounted() {
    this.$store.dispatch("jadwal/getJadwalByTahunAjaranAktif");
    this.$store.dispatch("kelas/getAllKelas");
    this.$store.dispatch("jadwal/getGuruMengajar");
  },

  methods: {
    forceUpper() {
      this.editedItem.jenis = this.editedItem.jenis.toUpperCase();
    },

    formatTime(item) {
        const [ jam, menit, _ ] = item.split(":");
        return `${jam}:${menit}`
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
      this.editedIndex = this.eskul.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.oldEskul = { ...item };
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
      this.editedIndex = this.eskul.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      const id_eskul = this.editedItem.id_esktrakulikuler;
      this.$store
        .dispatch("eskul/deleteEskul", id_eskul)
        .then((_) => {
          this.eskul.splice(this.editedIndex, 1);
          this.closeDelete();
        })
        .catch((err) => {
          this.closeDelete();
          console.log(err);
        });
    },

    save() {
      if (this.$refs.form.validate()) {
        if (this.editedIndex === -1) {
          const isEskulExist =
            this.eskul.filter(
              (item) =>
                item.jenis.toLowerCase() === this.editedItem.jenis.toLowerCase()
            ).length > 0;

          if (isEskulExist) {
            this.alertLocal = {
              isShow: true,
              type: "error",
              message: `Data nama eskul ${this.editedItem.jenis} sudah dimasukan sebelumnya!!`,
            };
            setTimeout(() => {
              this.alertLocal.isShow = false;
            }, 6000);
          } else {
            this.$store.dispatch("eskul/createEskul", this.editedItem);
            this.close();
          }
        } else {
          const isEskulExist =
            this.eskul.filter(
              (item) =>
                item.jenis.toLowerCase() ===
                  this.editedItem.jenis.toLowerCase() &&
                item.jenis.toLowerCase() !== this.oldEskul.jenis.toLowerCase()
            ).length > 0;

          if (isEskulExist) {
            this.alertLocal = {
              isShow: true,
              type: "error",
              message: `Data nama eskul ${this.editedItem.jenis} sudah dimasukan sebelumnya!!`,
            };
            setTimeout(() => {
              this.alertLocal.isShow = false;
            }, 6000);
          } else {
            const upadatedData = { ...this.editedItem };
            this.$store
              .dispatch("eskul/updateEskul", {
                id_esktrakulikuler: upadatedData.id_esktrakulikuler,
                data: upadatedData,
              })
              .then((_) => {
                this.eskul[this.editedIndex].jenis = upadatedData.jenis;
                this.close();
              })
              .catch((err) => {
                console.log(err);
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
