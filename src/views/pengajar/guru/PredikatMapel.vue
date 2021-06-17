<template>
  <div class="predikat-mapel">
    <v-data-table
      :items="filterPredikatNilai"
      :headers="headers"
      class="elevation-1"
      hide-default-footer
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-select
            v-model="mapelSelected"
            :items="listMapel"
            item-value="index"
            item-text="mata_pelajaran"
            label="Filter Mata Pelajaran"
            dense
          ></v-select>
          <v-spacer></v-spacer>
          <v-select
            v-model="jenisNilaiSelected"
            :items="['Pengetahuan', 'Keterampilan']"
            label="Filter Jenis Nilai"
            dense
          ></v-select>

          <v-spacer></v-spacer>

          <v-dialog persistent v-model="dialog" max-width="500px">
            <v-card>
              <v-card-title>
                <span class="headline"
                  >Ubah Catatan Nilai Predikat Mata Pelajaran
                  {{ mapelSelected.mata_pelajaran }}</span
                >
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-form ref="form" v-model="valid" lazy-validation>
                    <v-text-field
                      label="Mata Pelajaran"
                      v-model="editedItem.mata_pelajaran"
                      readonly
                    >
                    </v-text-field>

                    <v-text-field
                      label="Nilai Predikat"
                      v-model="editedItem.predikat"
                      readonly
                    >
                    </v-text-field>

                    <v-text-field
                      label="Jenis Nilai"
                      v-model="editedItem.jenis_nilai"
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
      { text: "Mata Pelajaran", value: "mata_pelajaran", sortable: false },
      { text: "Jenis Nilai", value: "jenis_nilai", sortable: false },
      { text: "Nilai Predikat", value: "predikat", sortable: false },
      { text: "Catatan Penilaian", value: "catatan", sortable: false },
      { text: "Action", value: "actions", sortable: false },
    ],
    jenisNilaiSelected: "Pengetahuan",
    rulesForm: {
      requiredRules: [(v) => !!v || "Wajib Diisi"],
    },
    mapelSelected: {
      index: 0,
    },
    editedIndex: -1,
    editedItem: {
      id_predikat_mapel: "",
      mata_pelajaran: "",
      predikat: "",
      jenis_nilai: "",
      catatan: "",
    },
    defaultItem: {
      id_predikat_mapel: "",
      mata_pelajaran: "",
      predikat: "",
      jenis_nilai: "",
      catatan: "",
    },
  }),
  computed: {
    ...mapState({
      alert: (state) => state.alert,
      isLoading: (state) => state.predikatMapel.isLoading,
      firstMapel: (state) => state.predikatMapel.firstMapel,
      predikatMapel: (state) => {
        let predikat_mapel = [];
        console.log( state.predikatMapel.predikatMapel)
        state.predikatMapel.predikatMapel.map(
          ({ mata_pelajaran, nilai_predikat }) => {
            nilai_predikat.map(
              ({ id_predikat_mapel, predikat, catatan, jenis_nilai }) => {
                predikat_mapel.push({
                  mata_pelajaran,
                  id_predikat_mapel,
                  predikat,
                  catatan,
                  jenis_nilai,
                });
              }
            );
          }
        );
        return predikat_mapel;
      },
      listMapel: (state) => {
        return state.predikatMapel.predikatMapel.map(
          ({ mata_pelajaran }, index) => {
            return {
              mata_pelajaran,
              index,
            };
          }
        );
      },
    }),
    filterPredikatNilai() {
      let mapel = "";
     
     this.listMapel.map((e, index) => {
       const indexToCompare = typeof this.mapelSelected.index === "number"
            ? this.mapelSelected.index
            : this.mapelSelected
          console.log("isTrue? : ", indexToCompare, typeof this.mapelSelected.index);

        if (
          index === indexToCompare
        ) {
          mapel = e.mata_pelajaran;
        }

      });
      let filtered = this.predikatMapel.filter((mapelPredikat) => {
        // console.log("mata pelajaran : ", mapelPredikat.mata_pelajaran);
        console.log("mapel : ", mapel);
        // console.log("jenis : ", mapelPredikat.jenis_nilai);
        

        return (
          mapelPredikat.mata_pelajaran === mapel && mapelPredikat.jenis_nilai === this.jenisNilaiSelected
        );
      });

      console.log("filtered : ", filtered);
      return filtered;
    },
  },
  mounted() {
    this.$store.dispatch("predikatMapel/getAllPredikatMapel");
  },
  methods: {
    save() {
      if (this.$refs.form.validate()) {
        this.$store
          .dispatch("predikatMapel/updatePredikatMapel", {
            id_predikat_mapel: this.editedItem.id_predikat_mapel,
            updatedData: {
              catatan: this.editedItem.catatan,
            },
          })
          .then((_) => {
            this.predikatMapel[
              this.editedIndex
            ].catatan = this.editedItem.catatan;
            this.close();
          })
          .catch((err) => {
            console.log(err);
            this.close();
          });
      }
    },

    editItem(item) {
      this.editedIndex = this.predikatMapel.indexOf(item);
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
