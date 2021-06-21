<template>
  <div class="predikat-eskul">
    <v-data-table
      :items="listNilaiPredikat"
      :headers="headers"
      class="elevation-1"
      hide-default-footer
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-select
            v-model="selectedEskul"
            :items="eskuList"
            item-value="index"
            item-text="jenis"
            label="Filter Esktrakulikuler"
            dense
          ></v-select>
          <v-spacer></v-spacer>

          <v-spacer></v-spacer>

          <v-dialog persistent v-model="dialog" max-width="500px">
            <v-card>
              <v-card-title>
                <span class="headline"
                  >Ubah Catatan Nilai Predikat Eskul
                  {{ selectedEskul.jenis }}</span
                >
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-form ref="form" v-model="valid" lazy-validation>
                    <v-text-field
                      label="Estrakulikuler"
                      v-model="editedItem.eskul"
                      readonly
                    >
                    </v-text-field>

                    <v-text-field
                      label="Nilai Predikat"
                      v-model="editedItem.predikat"
                      readonly
                    >
                    </v-text-field>

                    <v-textarea
                      counter
                      label="Catatan Penilaian"
                      :rules="[rulesForm.requiredRules]"
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
    </v-data-table>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data: () => ({
    valid: true,
    dialog: false,
    headers: [
      { text: "Nilai Predikat", value: "predikat", sortable: false },
      { text: "Catatan Penilaian", value: "catatan", sortable: false },
      { text: "Action", value: "actions", sortable: false },
    ],
    rulesForm: {
      requiredRules: (v) => !!v || "Wajib Diisi",
    },
    selectedEskul: {
      index: 0,
    },
    editedIndex: -1,
    editedItem: {
      id_predikat_eskul: "",
      id_esktrakulikuler: "",
      eskul: "",
      predikat: "",
      catatan: "",
    },
    defaultItem: {
      id_predikat_eskul: "",
      id_esktrakulikuler: "",
      eskul: "",
      predikat: "",
      catatan: "",
    },
  }),
  computed: {
    ...mapState({
      alert: (state) => state.alert,
      isLoading: (state) => state.predikatEskul.isLoading,
      eskul: (state) => state.predikatEskul.eskul,
    }),
    firstEskul() {
      return typeof this.eskul[0] !== "undefined" ? this.eskul[0] : {};
    },
    eskuList() {
      return this.eskul.map((eskul, index) => ({
        index,
        id_esktrakulikuler: eskul.id_esktrakulikuler,
        jenis: eskul.jenis,
        predikat_eskul: eskul.predikat_eskul,
      }));
    },
    listNilaiPredikat() {
      let index =
        typeof this.selectedEskul.index === "undefined"
          ? this.selectedEskul
          : this.selectedEskul.index;
      let listPredikat = [];
      this.eskuList.map((eskul) => {
        if (eskul.index === index) {
          eskul.predikat_eskul.map((item) => {
            listPredikat.push({
              id_predikat_eskul: item.id_predikat_eskul,
              id_esktrakulikuler: item.id_esktrakulikuler,
              eskul: eskul.jenis,
              predikat: item.predikat,
              catatan: item.catatan,
            });
          });
        }
      });
      return listPredikat;
    },
  },
  mounted() {
    this.$store.dispatch("predikatEskul/getAllPredikatEskul");
  },
  methods: {
    save() {
      if (this.$refs.form.validate()) {
        this.$store
          .dispatch("predikatEskul/updateCatatanPredikatNilaiEskul", {
            id_predikat_eskul: this.editedItem.id_predikat_eskul,
            catatan: this.editedItem.catatan,
          })
          .then((_) => {
            this.listNilaiPredikat[
              this.editedIndex
            ].catatan = this.editedItem.catatan;
            this.close();
          })
          .catch((err) => {
            console.error(err);
            this.close();
          });
      }
    },

    editItem(item) {
      this.editedIndex = this.listNilaiPredikat.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
      this.$refs.form.resetValidation();
    },
  },
};
</script>
