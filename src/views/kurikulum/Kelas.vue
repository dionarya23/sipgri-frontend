<template>
  <div class="mata_pelajaran">
    <v-data-table
      :loading="isLoading"
      :headers="headers"
      :items="kelas"
      class="elevation-1"
      sort-by="no"
      :search="search"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Cari Berdasarkan nama kelas atau ruangan"
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

                    <v-autocomplete
                        v-model="editedItem.tingkat"
                        :items="['X', 'XI', 'XII']"
                        label="Tingkat Kelas"
                       :rules="[rulesInputForm.requiredRule]"

                    >
                    </v-autocomplete>
                    

                    <v-autocomplete
                        v-model="editedItem.jurusan"
                        :items="['MIPA', 'IPS']"
                        label="Jurusan"
                       :rules="[rulesInputForm.requiredRule]"

                    >
                    </v-autocomplete>

                    <v-text-field
                      v-model="editedItem.ruangan"
                      label="Ruangan Kelas"
                      :rules="[rulesInputForm.requiredRule]"
                      @keyup="forceRuanganUpper"
                      required
                    ></v-text-field>

                    <v-text-field
                      v-model="no_kelas"
                      label="Nama Kelas"
                      type="number"
                      :prefix="`${editedItem.tingkat}.${editedItem.jurusan}.`"
                      :rules="[rulesInputForm.requiredRule, rulesInputForm.maxCharacter]"
                      @keyup="storeToEditedNamaKelas"
                      :disabled="isTingkatAndJurusanNotNull"
                      required
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
      { text: "Nama Kelas", value: "nama_kelas" },
      { text: "Ruangan Kelas", value: "ruangan" },
      { text: "Jurusan", value: "jurusan" },
      { text: "Tingkat", value: "tingkat" },
      { text: "Action", value: "actions", sortable: false },
    ],
    editedIndex: -1,
    no_kelas: "",
    editedItem: {
      id_kelas: 0,
      nama_kelas: "",
      ruangan : "",
      jurusan: "",
      tingkat: ""
    },
    defaultItem: {
      id_kelas: 0,
      nama_kelas: "",
      ruangan : "",
      jurusan: "",
      tingkat: ""
    },
    oldKelas: {},
    rulesInputForm: {
      requiredRule: (v) => !!v || "Wajib diisi",
      maxCharacter: (v) => v.length === 1 || 'Maksimal 1 karakter'
    },
  }),
  computed: {
    ...mapState({
      isLoading: (state) => state.kelas.isLoading,
      alert: (state) => state.alert,
      kelas: (state) => {
        const { kelas } = state.kelas;
        kelas.map((item, index) => {
          item.no = index + 1;
        });
        return kelas;
      },
    }),
    formTitle() {
        return this.editedIndex === -1
          ? "Tambah Kelas"
          : "Ubah Kelas";
      },
      isTingkatAndJurusanNotNull() {
          return this.editedItem.tingkat === '' || this.editedItem.jurusan === ''
      }
  },
  mounted() {
    this.$store.dispatch("kelas/getAllKelas");
  },

  methods: {
    storeToEditedNamaKelas() {
      this.editedItem.nama_kelas = `${this.editedItem.tingkat}.${this.editedItem.jurusan}.${this.no_kelas}`;
    },

    forceRuanganUpper() {
      this.editedItem.ruangan = this.editedItem.ruangan.toUpperCase();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        this.no_kelas = "";
      });
      this.$refs.form.resetValidation();
    },

    editItem(item) {
      this.editedIndex = this.kelas.indexOf(item);
      const [ _, __, no_urut ] = item.nama_kelas.split(".");
      this.editedItem = Object.assign({}, item);
      this.no_kelas = no_urut;
      this.oldKelas = { ...item };
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
      this.editedIndex = this.kelas.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      const id_kelas = this.editedItem.id_kelas;
      this.$store
        .dispatch("kelas/deleteKelas", id_kelas)
        .then((_) => {
          this.kelas.splice(this.editedIndex, 1);
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
          const isKelasExist =
            this.kelas.filter(
              (item) =>
                item.nama_kelas === this.editedItem.nama_kelas 
                || item.ruangan.toLowerCase() === this.editedItem.ruangan.toLowerCase()
            ).length > 0;

          if (isKelasExist) {
            this.alertLocal = {
              isShow: true,
              type: "error",
              message: `Data nama kelas ${this.editedItem.nama_kelas} dan rungan ${this.editedItem.ruangan} sudah dimasukan sebelumnya!!`,
            };
        setTimeout(() => {
              this.alertLocal.isShow = false;
        }, 6000);
          } else {
            this.$store.dispatch("kelas/createKelas", this.editedItem);
            this.close();
          }
        } else {
          const iskelasExist =
            this.kelas.filter(
              (item) =>
                (item.nama_kelas.toLowerCase() ===
                  this.editedItem.nama_kelas.toLowerCase() &&
                item.nama_kelas.toLowerCase() !== this.oldKelas.nama_kelas.toLowerCase()) ||
                (item.ruangan.toLowerCase() === this.editedItem.ruangan.toLowerCase() && item.ruangan.toLowerCase() !== this.oldKelas.ruangan.toLowerCase())
            ).length > 0;

          if (iskelasExist) {
            this.alertLocal = {
              isShow: true,
              type: "error",
              message: `Data nama kelas ${this.editedItem.nama_kelas} dan rungan ${this.editedItem.ruangan} sudah dimasukan sebelumnya!!`,
            };
            setTimeout(() => {
              this.alertLocal.isShow = false;
        }, 6000);
          } else {
            const upadatedData = { ...this.editedItem };
            this.$store.dispatch("kelas/updateKelas", {
              id_kelas: upadatedData.id_kelas,
              data: upadatedData,
            }).then(_ => {
                this.kelas[this.editedIndex].nama_kelas = upadatedData.nama_kelas;
                this.kelas[this.editedIndex].ruangan = upadatedData.ruangan;

                this.close();
            }).catch(err => {
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
