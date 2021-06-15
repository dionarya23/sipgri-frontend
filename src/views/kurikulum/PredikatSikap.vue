<template>
  <div class="mata_pelajaran">
    <v-data-table
      :loading="isLoading"
      :headers="headers"
      :items="predikatSikap"
      class="elevation-1"
      sort-by="no"
      :search="search"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-select
            v-model="search"
            :items="['Spiritual', 'Sosial']"
            label="Filter tipe sikap"
            dense
          ></v-select>

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

                    <v-select
                      v-model="editedItem.predikat"
                      label="Nilai Predikat"
                      :rules="[rulesInputForm.requiredRule]"
                      :items="listPredikat"
                      required
                    ></v-select>

                    <v-select
                      v-model="editedItem.type_sikap"
                      label="Tipe Nilai"
                      :rules="[rulesInputForm.requiredRule]"
                      :items="['Spiritual', 'Sosial']"
                      required
                    ></v-select>

                    <v-textarea
                      counter
                      label="Catatan"
                      :rules="[rulesInputForm.requiredRule]"
                      v-model="editedItem.catatan"
                    ></v-textarea>
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
    listPredikat: ["A", "B", "C", "D"],
    search: "",
    dialogDelete: false,
    valid: true,
    dialog: false,
    headers: [
      { text: "Nilai Predikat", value: "predikat", sortable: false },
      { text: "Catatan Penilaian", value: "catatan", sortable: false },
      { text: "Tipe Nilai Sikap", value: "type_sikap" },
      { text: "Action", value: "actions", sortable: false },
    ],
    editedIndex: -1,
    editedItem: {
      id_predikat_sikap: 0,
      predikat: "",
      catatan: "",
      type_sikap: "",
    },
    defaultItem: {
      id_predikat_sikap: 0,
      predikat: "",
      catatan: "",
      type_sikap: "",
    },
    oldPredikatSikap: {},
    rulesInputForm: {
      requiredRule: (v) => !!v || "Wajib diisi",
    },
  }),
  computed: {
    ...mapState({
      isLoading: (state) => state.eskul.isLoading,
      alert: (state) => state.alert,
      predikatSikap: (state) => state.predikatSikap.predikatSikap,
    }),
    formTitle() {
      return this.editedIndex === -1
        ? "Tambah Data Predikat Sikap"
        : "Ubah Data Predikat Sikap";
    },
  },
  mounted() {
    this.$store.dispatch("predikatSikap/getAllPredikatSikap");
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

    editItem(item) {
      this.editedIndex = this.predikatSikap.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.oldPredikatSikap = { ...item };
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
      this.editedIndex = this.predikatSikap.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      const id_predikat_sikap = this.editedItem.id_predikat_sikap;
      this.$store
        .dispatch("predikatSikap/deletePredikatSikap", id_predikat_sikap)
        .then((_) => {
          this.predikatSikap.splice(this.editedIndex, 1);
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
          const isPredikatSikapExist =
            this.predikatSikap.filter(
              (item) =>
                item.predikat.toLowerCase() ===
                  this.editedItem.predikat.toLowerCase() &&
                item.type_sikap.toLowerCase() ===
                  this.editedItem.type_sikap.toLowerCase()
            ).length > 0;

          if (isPredikatSikapExist) {
            this.alertLocal = {
              isShow: true,
              type: "error",
              message: `Data predikat sikap dengan predikat ${
                this.editedItem.predikat
              } dan tipe ${this.editedItem.type_sikap.toLowerCase()} sudah dimasukan sebelumnya!!`,
            };
            setTimeout(() => {
              this.alertLocal.isShow = false;
            }, 6000);
            this.valid = true;
          } else {
            this.$store.dispatch(
              "predikatSikap/createPredikatSikap",
              this.editedItem
            );
            this.close();
          }
        } else {
          const isPredikatSikapExist =
            this.predikatSikap.filter((item) => {
              return (
                item.predikat.toLowerCase() ===
                  this.editedItem.predikat.toLowerCase() &&
                item.type_sikap.toLowerCase() ===
                  this.editedItem.type_sikap.toLowerCase() &&
                item.catatan.toLowerCase() !==
                  this.oldPredikatSikap.catatan.toLowerCase()
              );
            }).length > 0;
          if (isPredikatSikapExist) {
            this.alertLocal = {
              isShow: true,
              type: "error",
              message: `Data predikat sikap dengan predikat ${
                this.editedItem.predikat
              } dan tipe ${this.editedItem.type_sikap.toLowerCase()} sudah dimasukan sebelumnya!!`,
            };
            setTimeout(() => {
              this.alertLocal.isShow = false;
            }, 6000);
            this.valid = true;
          } else {
            const upadatedData = { ...this.editedItem };
            this.$store
              .dispatch("predikatSikap/updatePredikatSikap", {
                id_predikat_sikap: upadatedData.id_predikat_sikap,
                data: upadatedData,
              })
              .then((_) => {
                this.predikatSikap[this.editedIndex].predikat =
                  upadatedData.predikat;
                this.predikatSikap[this.editedIndex].catatan =
                  upadatedData.catatan;
                this.predikatSikap[this.editedIndex].type_sikap =
                  upadatedData.type_sikap;

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
