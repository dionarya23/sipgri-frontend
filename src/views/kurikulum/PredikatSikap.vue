<template>
  <div class="predikat-sikap">
    <v-data-table
      :loading="isLoading"
      :headers="headers"
      :items="predikatSikap"
      class="elevation-1"
      sort-by="predikat"
      :search="search"
      hide-default-footer
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
                      readonly
                    ></v-select>

                    <v-select
                      v-model="editedItem.type_sikap"
                      label="Tipe Nilai"
                      :rules="[rulesInputForm.requiredRule]"
                      :items="['Spiritual', 'Sosial']"
                      required
                      readonly
                    ></v-select>

                    <v-textarea
                      counter
                      label="Catatan Penilaian"
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
    search: "Spiritual",
    valid: true,
    dialog: false,
    headers: [
      { text: "Nilai Predikat", value: "predikat", sortable: false },
      { text: "Catatan Penilaian", value: "catatan", sortable: false },
      { text: "Tipe Nilai Sikap", value: "type_sikap" },
      { text: "Aksi", value: "actions", sortable: false },
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
      return `Ubah Catatan Nilai Predikat Sikap ${this.editedItem.type_sikap}`
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
