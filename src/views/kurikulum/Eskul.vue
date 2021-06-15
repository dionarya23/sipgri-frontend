<template>
  <div class="eskul">
    <v-data-table
      :loading="isLoading"
      :headers="headers"
      :items="eskul"
      class="elevation-1"
      sort-by="no"
      :search="search"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Cari Berdasarkan nama Esktrakulikuler"
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
                      v-model="editedItem.jenis"
                      label="Nama Esktrakulikuler"
                      :rules="[rulesInputForm.requiredRule]"
                      @keyup="forceUpper"
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
      { text: "Nama Eskul", value: "jenis" },
      { text: "Action", value: "actions", sortable: false },
    ],
    editedIndex: -1,
    editedItem: {
      id_esktrakulikuler: 0,
      jenis: "",
    },
    defaultItem: {
      id_esktrakulikuler: 0,
      jenis: "",
    },
    oldEskul: {},
    rulesInputForm: {
      requiredRule: (v) => !!v || "Wajib diisi",
    },
  }),
  computed: {
    ...mapState({
      isLoading: (state) => state.eskul.isLoading,
      alert: (state) => state.alert,
      eskul: (state) => {
        const { eskul } = state.eskul;
        eskul.map((item, index) => {
          item.no = index + 1;
        });
        return eskul;
      },
    }),
    formTitle() {
      return this.editedIndex === -1
        ? "Tambah Data Esktrakulikuler"
        : "Ubah Data Esktrakulikuler";
    },
  },
  mounted() {
    this.$store.dispatch("eskul/getAllEskul");
  },

  methods: {
    forceUpper() {
      this.editedItem.jenis = this.editedItem.jenis.toUpperCase();
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
