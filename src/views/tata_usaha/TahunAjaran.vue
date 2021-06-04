<template>
  <div class="tahun_ajaran">
    <v-data-table
      :loading="isLoading"
      :headers="headers"
      :items="tahunAjaran"
      sort-by="tahun_ajaran"
      sort-desc="true"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
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
                Tambah Data Tahun Ajaran
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
                    <v-select
                      v-model="editedItem.tahun_awal"
                      :items="years"
                      :rules="requiredRule"
                      label="Tahun Awal"
                      :menu-props="{ top: true, offsetY: true }"
                      @change="changeTahunAkhir"
                    ></v-select>

                    <v-text-field
                      v-model="editedItem.tahun_akhir"
                      type="number"
                      label="Tahun Akhir"
                      disabled
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

          <v-dialog v-model="dialogMakeActive" max-width="480px">
            <v-card>
              <v-card-title class="headline">Perhatian!</v-card-title>
              <v-card-text
                ><p class="text-h6">
                  Apakah anda yakin ingin mengubah tahun ajaran ini menjadi
                  aktif ?
                </p></v-card-text
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeMakeActive"
                  >Batal</v-btn
                >
                <v-btn color="error" text @click="makeActiveItemConfirm"
                  >Ya!</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <!-- <v-icon small class="mr-2" @click="editItem(item)">
          mdi-pencil
        </v-icon> -->
        <v-row v-show="item.status_aktif !== 'Aktif'" align="center">
          <v-btn color="secondary" @click="editItem(item)">
            Aktif
          </v-btn>

          <v-icon large @click="deleteItem(item)">
            mdi-delete
          </v-icon>
        </v-row>
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
    show1: false,
    valid: true,
    dialog: false,
    dialogDelete: false,
    dialogMakeActive: false,
    requiredRule: [(v) => !!v || "Wajib diisi"],
    headers: [
      {
        text: "Tahun Ajaran",
        value: "tahun_ajaran",
      },
      {
        text: "Status",
        value: "status_aktif",
      },
      { text: "Actions", value: "actions", sortable: false },
    ],
    editedIndex: -1,
    editedItem: {
      tahun_awal: 0,
      tahun_akhir: 0,
    },
    defaultItem: {
      tahun_awal: 0,
      tahun_akhir: 0,
    },
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? "Tambah Data Tahun Ajaran"
        : "Ubah Data Tahun Ajaran";
    },
    years() {
      const year = new Date().getFullYear();
      return Array.from(
        { length: year + 5 - year },
        (_, index) => year - 1 + index
      );
    },
    ...mapState({
      isLoading: (state) => state.tahunAjaran.isLoading,
      tahunAjaran: (state) => state.tahunAjaran.tahunAjaran,
      alert: (state) => state.alert,
    }),
  },
  mounted() {
    this.$store.dispatch("tahunAjaran/getAllTahunAjaran");
  },
  methods: {
    save() {
      this.$store
        .dispatch("tahunAjaran/createTahunAjaran", this.editedItem)
        .then((_) => {
          this.editedItem = this.defaultItem;
          this.dialog = false;
        })
        .catch((err) => {
          console.log("error : ", err);
        });
    },
    changeTahunAkhir() {
      this.editedItem.tahun_akhir = this.editedItem.tahun_awal + 1;
    },

    editItem(item) {
      this.editedIndex = this.tahunAjaran.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.oldNip = item.nip;
      this.dialogMakeActive = true;
    },

    deleteItem(item) {
      this.editedIndex = this.tahunAjaran.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      const id_tahun_ajaran = this.editedItem.id_tahun_ajaran;
      this.$store.dispatch("tahunAjaran/deleteTahunAjaran", id_tahun_ajaran);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
      this.$refs.form.resetValidation();
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    makeActiveItemConfirm() {
      const id_tahun_ajaran = this.editedItem.id_tahun_ajaran;
      this.$store.dispatch("tahunAjaran/updateTahunAjaran", id_tahun_ajaran);
      this.closeMakeActive();
    },

    closeMakeActive() {
      this.dialogMakeActive = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
  },
};
</script>
