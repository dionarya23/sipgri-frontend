<template>
  <div class="mata_pelajaran">
    <v-data-table
      :loading="isLoading"
      :headers="headers"
      :items="mataPelajaran"
      class="elevation-1"
      sort-by="no"
      :search="search"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Cari Berdasarkan nama mata pelajaran"
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
                    <v-text-field
                      v-model="editedItem.mata_pelajaran"
                      label="Nama Mata Pelajaran"
                      :rules="[rulesInputForm.requiredRule]"
                      @keyup="capitalizeFirstLetter"
                      required
                    ></v-text-field>

                    <v-autocomplete
                      v-model="editedItem.kelompok"
                      :items="kelompokMataPelajaran"
                      :rules="[rulesInputForm.requiredRule]"
                      label="Kelompok"
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
    dialogDelete : false,
    valid: true,
    dialog: false,
    headers: [
      {
        text: "No",
        alignItems: "start",
        value: "no",
      },
      { text: "Nama Mata Pelajaran", value: "mata_pelajaran" },
      { text: "Kelompok", value: "kelompok", sortable: false },
      { text: "Aksi", value: "actions", sortable: false },
    ],
    editedIndex: -1,
    id_mata_pelajaran: -1,
    editedItem: {
      mata_pelajaran: "",
      kkm_kelas_1: 0,
      kkm_kelas_2: 0,
      kkm_kelas_3: 0,
      kelompok: "",
    },
    defaultItem: {
      mata_pelajaran: "",
      kkm_kelas_1: 0,
      kkm_kelas_2: 0,
      kkm_kelas_3: 0,
      kelompok: "",
    },
    oldMataPelajaran: {},
    kelompokMataPelajaran: [
      "Kelompok A (Umum)",
      "Kelompok B (Umum)",
      "Peminatan",
      "Lintas Minat",
    ],
    rulesInputForm: {
      requiredRule: (v) => !!v || "Wajib diisi",
    },
  }),
  computed: {
    formTitle() {
        return this.editedIndex === -1
          ? "Tambah Data Mata Pelajaran"
          : "Ubah Data Mata Pelajaran";
      },
    ...mapState({
      isLoading: (state) => state.matapelajaran.isLoading,
      alert: (state) => state.alert,
      mataPelajaran: (state) => {
        const { mataPelajaran } = state.matapelajaran;
        mataPelajaran.map((pelajaran, index) => {
          pelajaran.no = index + 1;
        });
        return mataPelajaran;
      },
    }),
  },
  mounted() {
    this.$store.dispatch("matapelajaran/getAllMataPelajaran");
  },

  methods: {
    capitalizeFirstLetter() {
      this.editedItem.mata_pelajaran = this.editedItem.mata_pelajaran.toString();
      this.editedItem.mata_pelajaran = this.editedItem.mata_pelajaran.replace(
        /(?:^|\s)\S/g,
        function(a) {
          return a.toUpperCase();
        }
      );
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        this.id_mata_pelajaran = -1;
      });
      this.$refs.form.resetValidation();
    },

    editItem(item) {
      this.id_mata_pelajaran = item.id_mata_pelajaran;
      this.editedIndex = this.mataPelajaran.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.oldMataPelajaran = { ...item };
      this.dialog = true;
    },

     closeDelete() {
      this.$nextTick(() => {
        this.id_mata_pelajaran = 0;
        this.editedIndex = -1;
      });
      this.dialogDelete = false;
    },

     deleteItem(item) {
      this.editedIndex = this.mataPelajaran.indexOf(item);
      this.id_mata_pelajaran = this.mataPelajaran[this.editedIndex].id_mata_pelajaran;
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      const id_mata_pelajaran = this.id_mata_pelajaran;
      this.$store.dispatch("matapelajaran/deleteMataPelajaran", id_mata_pelajaran).then(res => {
        this.mataPelajaran.splice(this.editedIndex, 1);
        this.closeDelete();
      }).catch(err => {
        this.closeDelete();        
        console.log(err)
      });
    },

    save() {
      if (this.$refs.form.validate()) {
        if (this.editedIndex === -1) {
          const isMataPelajaranExist =
            this.mataPelajaran.filter(
              (pelajaran) =>
                pelajaran.mata_pelajaran.toLowerCase() === this.editedItem.mata_pelajaran.toLowerCase() &&
                pelajaran.kelompok.toLowerCase() === this.editedItem.kelompok.toLowerCase()
            ).length > 0;

          if (isMataPelajaranExist) {
            this.alertLocal = {
              isShow: true,
              type: "error",
              message: `Data mata pelajaran ${this.editedItem.mata_pelajaran} kelompok ${this.editedItem.kelompok} sudah dimasukan sebelumnya!!`,
            };
            setTimeout(() => {
              this.alertLocal.isShow = false;
        }, 6000);
          } else {
            this.$store.dispatch(
              "matapelajaran/createNewMataPelajaran",
              this.editedItem
            );
            this.close();
          }
        } else {
          const isMataPelajaranExist =
            this.mataPelajaran.filter(
              (pelajaran) =>
                (pelajaran.mata_pelajaran.toLowerCase() === this.editedItem.mata_pelajaran.toLowerCase() &&
                this.oldMataPelajaran.mata_pelajaran.toLowerCase() !== pelajaran.mata_pelajaran.toLowerCase()
                  ) &&
                (pelajaran.kelompok.toLowerCase() === this.editedItem.kelompok.toLowerCase() &&
                  this.oldMataPelajaran.kelompok.toLowerCase() !== pelajaran.kelompok.toLowerCase())
            ).length > 0;

          if (isMataPelajaranExist) {
            this.alertLocal = {
              isShow: true,
              type: "error",
              message: `Data mata pelajaran ${this.editedItem.mata_pelajaran} kelompok ${this.editedItem.kelompok} sudah dimasukan sebelumnya!!`,
            };
            setTimeout(() => {
              this.alertLocal.isShow = false;
        }, 6000);
          } else {
            this.$store.dispatch("matapelajaran/updateMataPelajaran", {
              id_mata_pelajaran: this.id_mata_pelajaran,
              data: this.editedItem,
            });
            this.mataPelajaran[
              this.editedIndex
            ].mata_pelajaran = this.editedItem.mata_pelajaran;
            this.mataPelajaran[
              this.editedIndex
            ].kelompok = this.editedItem.kelompok;
            this.close();
          }
        }
      }
      this.valid = false;
    },
  },
};
</script>
