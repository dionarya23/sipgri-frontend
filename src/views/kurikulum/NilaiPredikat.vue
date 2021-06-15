<template>
  <div class="nilai-predikat">
    <v-data-table
      :loading="isLoading"
      :headers="headers"
      :items="filterPredikatNilai"
      class="elevation-1"
      sort-by="predikat"
      hide-default-footer
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-select
            v-model="search"
            :items="['X', 'XI', 'XII']"
            label="Filter berdasarkan tingkat kelas"
            dense
          ></v-select>

          <v-spacer></v-spacer>
          <v-dialog persistent v-model="dialog" max-width="500px">
            <template v-slot:activator="{ attrs }">
              <v-btn
                color="primary"
                depressed
                class="mb-2 text--white"
                v-bind="attrs"
                :loading="isLoading"
                :disabled="isLoading"
                @click="openDialog"
              >
                Ubah Predikat Nilai
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

                    <v-container>
                      <v-row
                        v-for="(nilai, index) in predikatNilaiForm"
                        :key="index"
                      >
                        <v-col cols="12" sm="4">
                          <v-text-field
                            v-model="predikatNilaiForm[index].predikat"
                            label="Predikat"
                            readonly
                          ></v-text-field>
                        </v-col>

                        <v-col cols="12" sm="4">
                          <v-text-field
                            label="Nilai Minimum"
                            type="number"
                            v-model="predikatNilaiForm[index].nilai_minimum"
                            :rules="[
                              rulesInputForm.requiredRule,
                              rulesInputForm.min,
                              rulesInputForm.max,
                            ]"
                            @keyup="checkRangeDuplicate(index)"
                          ></v-text-field>
                        </v-col>

                        <v-col cols="12" sm="4">
                          <v-text-field
                            label="Nilai Maksimum"
                            type="number"
                            @keyup="checkRangeDuplicate(index)"
                            v-model="predikatNilaiForm[index].nilai_maksimum"
                            :rules="[
                              rulesInputForm.requiredRule,
                              rulesInputForm.min,
                              rulesInputForm.max,
                            ]"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
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
    search: "X",
    valid: true,
    dialog: false,
    headers: [
      { text: "Predikat", value: "predikat", sortable: false },
      { text: "Nilai Minimum", value: "nilai_minimum", sortable: false },
      { text: "Nilai Maksimum", value: "nilai_maksimum", sortable: false },
      { text: "Tingkat Kelas", value: "tingkat" },
    ],
    rulesInputForm: {
      requiredRule: (v) => !!v || "Wajib diisi",
      max: (v) => Number(v) <= 100 || "Tidak boleh lebih dari 100",
      min: (v) => Number(v) > 0 || "Tidak boleh kurang dari 1",
    },
    predikatNilaiForm: [],
    indexPredikatNilai: [],
  }),
  computed: {
    ...mapState({
      isLoading: (state) => state.eskul.isLoading,
      alert: (state) => state.alert,
      nilaiPredikat: (state) => state.nilaiPredikat.nilaiPredikat,
    }),
    formTitle() {
      return `Ubah Data Nilai Predikat Tingkat Kelas ${this.search}`;
    },
    filterPredikatNilai() {
      return this.nilaiPredikat.filter(({ tingkat }) => {
        return tingkat === this.search;
      });
    },
  },
  mounted() {
    this.$store.dispatch("nilaiPredikat/getAllNilaiPredikat");
  },

  methods: {
    checkRangeDuplicate(index) {

        if (typeof Number.prototype.isBetween === "undefined") {
        Number.prototype.isBetween = function(min, max, notBoundaries) {
          var between = false;
          if (notBoundaries) {
            if (this < max && this > min) between = true;
          } else {
            if (this <= max && this >= min) between = true;
          }
          return between;
        };
      }

      if (typeof Array.prototype.isRangeCrossed === "undefined") {
        Array.prototype.isRangeCrossed = function(target, notBoundaries) {
          var result = false;
          if (
            target[0].isBetween(this[0], this[1], notBoundaries) ||
            target[1].isBetween(this[0], this[1], notBoundaries)
          ) {
            result = true;
          }
          return result;
        };
      }

      const rangeWantToCompare = [
        Number(this.predikatNilaiForm[index].nilai_minimum),
        Number(this.predikatNilaiForm[index].nilai_maksimum),
      ];

      const predikatNilaiFiltered = [
        ...this.predikatNilaiForm.filter((_, i) => i != index),
      ];

      let resultBoolean = [];
      predikatNilaiFiltered.map(({ nilai_minimum, nilai_maksimum }) => {
        resultBoolean.push(
          [Number(nilai_minimum), Number(nilai_maksimum)].isRangeCrossed(
            rangeWantToCompare,
            false
          )
        );
      });

      if (resultBoolean.includes(true)) {
        this.alertLocal = {
          isShow: true,
          type: "error",
          message:
            "periksa kembali nilai minimum dan nilai maksimum terjadi bentrok",
        };

        setTimeout(() => {
              this.alertLocal.isShow = false;
            }, 10000);

        this.valid = false
      }else{
        this.alertLocal = {
          isShow: false,
          type: "error",
          message: "",
        };
        this.valid = true
      }
    },

    openDialog() {
      this.dialog = true;
      this.nilaiPredikat.map((e, index) => {
        if (e.tingkat === this.search) {
          this.indexPredikatNilai.push(index);
          this.predikatNilaiForm.push({
            ...e,
          });
        }
      });
    },

    close() {
      this.dialog = false;
      this.predikatNilaiForm = [];
      this.indexPredikatNilai = [];
      this.$refs.form.resetValidation();
    },

    save() {
      if (this.$refs.form.validate()) {
        this.$store
          .dispatch("nilaiPredikat/updateNilaiPredikat", this.predikatNilaiForm)
          .then((_) => {
            this.indexPredikatNilai.map((value) => {
              this.nilaiPredikat[value].nilai_minimum = this.predikatNilaiForm[
                value
              ].nilai_minimum;
              this.nilaiPredikat[value].nilai_maksimum = this.predikatNilaiForm[
                value
              ].nilai_maksimum;
            });

            this.close();
          })
          .catch((err) => {
            console.log("error : ", err);
            this.close();
          });
      }
      this.valid = false;
    },
  },
};
</script>
