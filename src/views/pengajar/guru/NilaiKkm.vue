<template>
  <div class="nilai-kkm">
    <v-data-table
      :headers="headers"
      class="elevation-1"
      :loading="isLoading"
      :items="mataPelajaranGuru"
      hide-default-footer
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-dialog persistent v-model="dialog" max-width="500px">
            <v-card>
              <v-card-title>
                <span class="headline">Tambah Nilai KKM</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-form ref="form" v-model="valid" lazy-validation>
                    <v-text-field
                      label="Mata Pelajaran"
                      v-model="mataPelajaranSelected.nama"
                      readonly
                      required
                    ></v-text-field>

                    <v-text-field
                      label="KKM Kelas X"
                      v-model="kkmForm.kkm_kelas_1"
                      type="number"
                      :rules="rulesForm.requiredRules"
                      required
                    ></v-text-field>

                    <v-text-field
                      label="KKM Kelas XI"
                      v-model="kkmForm.kkm_kelas_2"
                      type="number"
                      :rules="rulesForm.requiredRules"
                      required
                    ></v-text-field>

                    <v-text-field
                      label="KKM Kelas XII"
                      v-model="kkmForm.kkm_kelas_3"
                      type="number"
                      :rules="rulesForm.requiredRules"
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
    editedIndex: -1,
    kkmForm: {
      kkm_kelas_1: "",
      kkm_kelas_2: "",
      kkm_kelas_3: "",
    },
    rulesForm: {
      requiredRules: [(v) => !!v || "Wajib Diisi"],
    },
    mataPelajaranSelected: {
      id_mata_pelajaran: "",
      nama: "",
    },
    headers: [
      {
        text: "Mata Pelajaran",
        value: "mata_pelajaran",
        sortable: false,
      },
      {
        text: "KKM Kelas X",
        value: "kkm_kelas_1",
        align: "center",
        sortable: false,
      },
      {
        text: "KKM Kelas XI",
        value: "kkm_kelas_2",
        align: "center",
        sortable: false,
      },
      {
        text: "KKM Kelas XII",
        value: "kkm_kelas_3",
        align: "center",
        sortable: false,
      },
      {
        text: "Kelompok Mata Pelajaran",
        value: "kelompok",
        align: "center",
        sortable: false,
      },
      { text: "Action", value: "actions", sortable: false },
    ],
  }),
  computed: {
    ...mapState({
      isLoading: (state) => state.matapelajaran.isLoading,
      mataPelajaranGuru: (state) => state.matapelajaran.mataPelajaranGuru,
      alert: (state) => state.alert,
    }),
  },
  mounted() {
    this.$store.dispatch("matapelajaran/getMataPelajaranGuru");
  },
  methods: {
    save() {
      if (this.$refs.form.validate()) {
        this.$store
          .dispatch("matapelajaran/updateMataPelajaran", {
            id_mata_pelajaran: this.mataPelajaranSelected.id_mata_pelajaran,
            data: this.kkmForm,
          })
          .then((_) => {
            this.mataPelajaranGuru[
              this.editedIndex
            ].kkm_kelas_1 = this.kkmForm.kkm_kelas_1;
            this.mataPelajaranGuru[
              this.editedIndex
            ].kkm_kelas_2 = this.kkmForm.kkm_kelas_2;
            this.mataPelajaranGuru[
              this.editedIndex
            ].kkm_kelas_3 = this.kkmForm.kkm_kelas_3;

            this.close();
          })
          .catch((err) => {
            console.log(err);
            this.close();
          });
      }
      this.valid = false;
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.kkmForm = Object.assign(
          {},
          {
            kkm_kelas_1: "",
            kkm_kelas_2: "",
            kkm_kelas_3: "",
          }
        );
        this.mataPelajaranSelected = Object.assign(
          {},
          {
            id_mata_pelajaran: "",
            nama: "",
          }
        );
        this.editedIndex = -1;
      });
      this.$refs.form.resetValidation();
    },

    editItem(item) {
      this.editedIndex = this.mataPelajaranGuru.indexOf(item);
      this.kkmForm = {
        kkm_kelas_1: item.kkm_kelas_1,
        kkm_kelas_2: item.kkm_kelas_2,
        kkm_kelas_3: item.kkm_kelas_3,
      };
      this.mataPelajaranSelected = {
        id_mata_pelajaran: item.id_mata_pelajaran,
        nama: item.mata_pelajaran,
      };
      this.dialog = true;
    },
  },
};
</script>
