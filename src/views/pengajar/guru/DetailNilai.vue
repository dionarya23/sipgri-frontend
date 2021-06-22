<template>
  <div class="detail-nilai">
    <v-card>
      <v-card-title>
        {{ raport.jenis_penilaian }} Mata Pelajaran {{ mata_pelajaran }} untuk
        Kelas {{ nama_kelas }}
      </v-card-title>
      <v-data-table
        :loading="isLoading"
        :headers="headers"
        :items="pesertaDidikList"
        class="elevation-1"
        sort-by="no"
        :search="search"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Cari Berdasarkan nama peserta didik"
              single-line
              hide-details
            ></v-text-field>
            <v-spacer></v-spacer>
            <v-dialog persistent v-model="dialog" max-width="500px">
              <v-card>
                <v-card-title>
                  Tambah Penilaian
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
                        label="Tahun Ajaran - Semester"
                        :value="
                          `${raport.tahun_ajaran.tahun_awal}/${raport.tahun_ajaran.tahun_akhir} - Semester ${raport.semester}`
                        "
                        readonly
                      >
                      </v-text-field>

                      <v-text-field
                        label="Jenis Penilaian"
                        :value="`${raport.jenis_penilaian}`"
                        readonly
                      >
                      </v-text-field>

                      <v-text-field
                        label="Nama Peserta Didik"
                        :value="`${editedItem.nama}`"
                        readonly
                      >
                      </v-text-field>

                      <v-text-field
                        label="Mata Pelajaran"
                        :value="`${mata_pelajaran}`"
                        readonly
                      >
                      </v-text-field>

                      <v-text-field
                        label="Penilaian Harian"
                        v-model="editedItem.penilaian_harian"
                        type="number"
                        :rules="[
                          rulesInputForm.requiredRule,
                          rulesInputForm.maxRule,
                          rulesInputForm.minRule,
                        ]"
                        @keyup="setNilaiPengetahuanAndPredikat"
                      >
                      </v-text-field>
                      <v-text-field
                        label="Tugas Harian"
                        v-model="editedItem.tugas_harian"
                        type="number"
                        :rules="[
                          rulesInputForm.requiredRule,
                          rulesInputForm.maxRule,
                          rulesInputForm.minRule,
                        ]"
                        @keyup="setNilaiPengetahuanAndPredikat"
                      >
                      </v-text-field>
                      <v-text-field
                        :label="nilai_ujian"
                        v-model="editedItem.nilai_ujian"
                        type="number"
                        :rules="[
                          rulesInputForm.requiredRule,
                          rulesInputForm.maxRule,
                          rulesInputForm.minRule,
                        ]"
                        @keyup="setNilaiPengetahuanAndPredikat"
                      >
                      </v-text-field>

                      <v-text-field
                        label="Nilai Pengetahuan"
                        v-model="editedItem.nilai_pengetahuan"
                        type="number"
                        readonly
                      >
                      </v-text-field>
                      <v-text-field
                        label="Predikat Nilai Pengetahuan"
                        v-model="editedItem.predikat_pengetahuan"
                        readonly
                      >
                      </v-text-field>

                      <v-text-field
                        label="Nilai Keterampilan"
                        v-model="editedItem.nilai_keterampilan"
                        type="number"
                        :rules="[
                          rulesInputForm.requiredRule,
                          rulesInputForm.maxRule,
                          rulesInputForm.minRule,
                        ]"
                        @keyup="setPredikatKeterampilan"
                      >
                      </v-text-field>

                      <v-text-field
                        label="Predikat Nilai Keterampilan"
                        v-model="editedItem.predikat_keterampilan"
                        readonly
                      >
                      </v-text-field>

                      <v-text-field
                        label="Nilai Sikap"
                        v-model="editedItem.nilai_sikap"
                        type="number"
                        :rules="[
                          rulesInputForm.requiredRule,
                          rulesInputForm.maxRule,
                          rulesInputForm.minRule,
                        ]"
                        @keyup="setPredikatSikap"
                      >
                      </v-text-field>

                      <v-text-field
                        label="Predikat Nilai Sikap"
                        v-model="editedItem.predikat_sikap"
                        readonly
                      >
                      </v-text-field>
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

        <template v-slot:[`item.peserta_didik.nilai`]="{ item }">
          <span v-if="item.peserta_didik.nilai !== null">
            {{
              round(
                (Number(item.peserta_didik.nilai.penilaian_harian) +
                  Number(item.peserta_didik.nilai.tugas_harian) +
                  Number(item.peserta_didik.nilai.nilai_ujian)) /
                  3,
                2
              )
            }}
          </span>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  data: () => ({
    valid: true,
    search: "",
    dialog: false,
    alertLocal: {
      isShow: false,
      type: "error",
      message: "",
    },
    editedIndex: -1,
    rulesInputForm: {
      requiredRule: (v) => !!v || "Wajib diisi",
      maxRule: (v) => Number(v) <= 100 || "Tidak boleh lebih dari 100",
      minRule: (v) => Number(v) >= 0 || "Tidak boleh kurang dari 0",
    },
    editedItem: {
      nama: "",
      penilaian_harian: 0,
      tugas_harian: 0,
      nilai_ujian: 0,
      nilai_pengetahuan: "",
      predikat_pengetahuan: "",
      nilai_keterampilan: "",
      predikat_keterampilan: "",
      nilai_sikap: "",
      predikat_sikap: "",
    },
    defaultItem: {
      nama: "",
      penilaian_harian: "",
      tugas_harian: "",
      nilai_ujian: "",
      nilai_pengetahuan: "",
      predikat_pengetahuan: "",
      nilai_keterampilan: "",
      predikat_keterampilan: "",
      nilai_sikap: "",
      predikat_sikap: "",
    },
  }),
  computed: {
    ...mapState({
      isLoading: (state) => state.nilaiSiswa.isLoading,
      alert: (state) => state.alert,
      nama_kelas: (state) => state.nilaiSiswa.pesertaDidikNilai.nama_kelas,
      tingkat_kelas: (state) => state.nilaiSiswa.pesertaDidikNilai.tingkat,
      pesertaDidikList: (state) =>
        state.nilaiSiswa.pesertaDidikNilai.kelas_siswa,
      raport: (state) => state.nilaiSiswa.raportAktif,
      mata_pelajaran: (state) =>
        state.nilaiSiswa.detailMengajar.mata_pelajaran.mata_pelajaran,
      nilaiPredikat: (state) => state.nilaiSiswa.nilaiPredikat,
    }),
    nilai_ujian() {
      return this.raport.jenis_penilaian === "Penilaian Tengah Semester 1" ||
        this.raport.jenis_penilaian === "Penilaian Tengah Semester 2"
        ? "Nilai PTS"
        : this.raport.jenis_penilaian === "Penilaian Akhir Semester"
        ? "Nilai PAS"
        : "Nilai PAT";
    },
    headers() {
      return [
        // {
        //   text: "NISN",
        //   value: "peserta_didik.nisn",
        //   sortable: false,
        // },
        // {
        //   text: "NIS",
        //   value: "peserta_didik.nis",
        //   sortable: false,
        // },
        {
          text: "Nama",
          value: "peserta_didik.nama",
        },
        {
          text: "Penilaian Harian",
          value: "peserta_didik.nilai.penilaian_harian",
          sortable: false,
        },
        {
          text: "Tugas Harian",
          value: "peserta_didik.nilai.tugas_harian",
          sortable: false,
        },
        {
          text: this.nilai_ujian,
          value: "peserta_didik.nilai.nilai_ujian",
          sortable: false,
        },
        {
          text: "Nilai Pengetahuan",
          value: "peserta_didik.nilai",
          sortable: false,
        },
        {
          text: "Predikat Nilai Pengetahuan",
          value: "peserta_didik.nilai.predikat_pengetahuan",
          sortable: false,
        },
        {
          text: "Nilai Keterampilan",
          value: "peserta_didik.nilai.nilai_keterampilan",
          sortable: false,
        },
        {
          text: "Predikat Nilai Keterampilan",
          value: "peserta_didik.nilai.predikat_keterampilan",
          sortable: false,
        },
        {
          text: "Nilai Sikap",
          value: "peserta_didik.nilai.nilai_sikap",
          sortable: false,
        },
        {
          text: "Predikat Nilai Sikap",
          value: "peserta_didik.nilai.predikat_sikap",
          sortable: false,
        },
        { text: "Action", value: "actions", sortable: false },
      ];
    },
  },
  mounted() {
    this.$store.dispatch("nilaiSiswa/getListPesertaDidik", {
      kode_mengajar: this.$route.params.kode_mengajar,
      id_kelas: this.$route.params.id_kelas,
    });

    this.$store.dispatch(
      "nilaiSiswa/getDetailMengajar",
      this.$route.params.kode_mengajar
    );

    this.$store.dispatch("nilaiSiswa/getNilaiPredikat");
  },
  methods: {
    setNilaiPengetahuanAndPredikat() {
      this.editedItem.nilai_pengetahuan = this.round(
        (Number(this.editedItem.penilaian_harian) +
          Number(this.editedItem.tugas_harian) +
          Number(this.editedItem.nilai_ujian)) /
          3,
        2
      );

      for (let i = 0; i < this.nilaiPredikat.length; i++) {
        console.log(this.nilaiPredikat[i].tingkat, this.tingkat_kelas);
        if (this.nilaiPredikat[i].tingkat === this.tingkat_kelas) {
          if (
            this.editedItem.nilai_pengetahuan >=
              this.nilaiPredikat[i].nilai_minimum &&
            this.editedItem.nilai_pengetahuan <=
              this.nilaiPredikat[i].nilai_maksimum
          ) {
            this.editedItem.predikat_pengetahuan = this.nilaiPredikat[
              i
            ].predikat;
            break;
          }
        }
      }
    },

    setPredikatSikap() {
      for (let i = 0; i < this.nilaiPredikat.length; i++) {
        console.log(this.nilaiPredikat[i].tingkat, this.tingkat_kelas);
        if (this.nilaiPredikat[i].tingkat === this.tingkat_kelas) {
          if (
            this.editedItem.nilai_sikap >=
              this.nilaiPredikat[i].nilai_minimum &&
            this.editedItem.nilai_sikap <= this.nilaiPredikat[i].nilai_maksimum
          ) {
            this.editedItem.predikat_sikap = this.nilaiPredikat[i].predikat;
            break;
          }
        }
      }
    },

    setPredikatKeterampilan() {
      for (let i = 0; i < this.nilaiPredikat.length; i++) {
        console.log(this.nilaiPredikat[i].tingkat, this.tingkat_kelas);
        if (this.nilaiPredikat[i].tingkat === this.tingkat_kelas) {
          if (
            this.editedItem.nilai_keterampilan >=
              this.nilaiPredikat[i].nilai_minimum &&
            this.editedItem.nilai_keterampilan <=
              this.nilaiPredikat[i].nilai_maksimum
          ) {
            this.editedItem.predikat_keterampilan = this.nilaiPredikat[
              i
            ].predikat;
            break;
          }
        }
      }
    },

    editItem(item) {
      this.editedIndex = this.pesertaDidikList.indexOf(item);
      console.log("Indexnya : ", this.pesertaDidikList[this.editedIndex].id_peserta_didik, this.editedIndex);
      console.log("nama : ", item.peserta_didik.nama);

      if (item.peserta_didik.nilai !== null) {
        this.editedItem = Object.assign(
          {},
          {
            nama: item.peserta_didik.nama,
            penilaian_harian: item.peserta_didik.nilai.penilaian_harian,
            tugas_harian: item.peserta_didik.nilai.tugas_harian,
            nilai_ujian: item.peserta_didik.nilai.nilai_ujian,
            nilai_pengetahuan: this.round(
              (Number(item.peserta_didik.nilai.penilaian_harian) +
                Number(item.peserta_didik.nilai.tugas_harian) +
                Number(item.peserta_didik.nilai.nilai_ujian)) /
                3,
              2
            ),
            predikat_pengetahuan: item.peserta_didik.nilai.predikat_pengetahuan,
            nilai_keterampilan: item.peserta_didik.nilai.nilai_keterampilan,
            predikat_keterampilan:
              item.peserta_didik.nilai.predikat_keterampilan,
            nilai_sikap: item.peserta_didik.nilai.nilai_sikap,
            predikat_sikap: item.peserta_didik.nilai.predikat_sikap,
          }
        );
      } else {
        this.editedItem = Object.assign(
          {},
          {
            nama: item.peserta_didik.nama,
            penilaian_harian: "",
            tugas_harian: "",
            nilai_ujian: "",
            nilai_pengetahuan: "",
            predikat_pengetahuan: "",
            nilai_keterampilan: "",
            predikat_keterampilan: "",
            nilai_sikap: "",
            predikat_sikap: "",
          }
        );
      }

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

    save() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch("nilaiSiswa/createPenilaian", {
            id_peserta_didik: this.pesertaDidikList[this.editedIndex]
              .id_peserta_didik,
            kode_mengajar: this.$route.params.kode_mengajar,
            id_raport: this.raport.id_raport,
            penilaian_harian: this.editedItem.penilaian_harian,
            tugas_harian: this.editedItem.tugas_harian,
            nilai_ujian: this.editedItem.nilai_ujian,
            predikat_pengetahuan: this.editedItem.predikat_pengetahuan,
            nilai_keterampilan: this.editedItem.nilai_keterampilan,
            predikat_keterampilan: this.editedItem.predikat_keterampilan,
            nilai_sikap: this.editedItem.nilai_sikap,
            predikat_sikap: this.editedItem.predikat_sikap,
          })
          .then((_) => {
            if (this.pesertaDidikList[this.editedIndex].peserta_didik.nilai !== null) {
              this.pesertaDidikList[
                this.editedIndex
              ].peserta_didik.nilai.penilaian_harian = this.editedItem.penilaian_harian;
              this.pesertaDidikList[
                this.editedIndex
              ].peserta_didik.nilai.tugas_harian = this.editedItem.tugas_harian;
              this.pesertaDidikList[
                this.editedIndex
              ].peserta_didik.nilai.nilai_ujian = this.editedItem.nilai_ujian;
              this.pesertaDidikList[
                this.editedIndex
              ].peserta_didik.nilai.predikat_pengetahuan = this.editedItem.predikat_pengetahuan;
              this.pesertaDidikList[
                this.editedIndex
              ].peserta_didik.nilai.nilai_keterampilan = this.editedItem.nilai_keterampilan;
              this.pesertaDidikList[
                this.editedIndex
              ].peserta_didik.nilai.predikat_keterampilan = this.editedItem.predikat_keterampilan;
              this.pesertaDidikList[
                this.editedIndex
              ].peserta_didik.nilai.nilai_sikap = this.editedItem.nilai_sikap;
              this.pesertaDidikList[
                this.editedIndex
              ].peserta_didik.nilai.predikat_sikap = this.editedItem.predikat_sikap;
            } else {
              this.pesertaDidikList[this.editedIndex].peserta_didik.nilai = {
                penilaian_harian: this.editedItem.penilaian_harian,
                tugas_harian: this.editedItem.tugas_harian,
                nilai_ujian: this.editedItem.nilai_ujian,
                predikat_pengetahuan: this.editedItem.predikat_pengetahuan,
                nilai_keterampilan: this.editedItem.nilai_keterampilan,
                predikat_keterampilan: this.editedItem.predikat_keterampilan,
                nilai_sikap: this.editedItem.nilai_sikap,
                predikat_sikap: this.editedItem.predikat_sikap,
              };
            }

            this.close();
          })
          .catch((err) => {
            console.error("error : ", err);
            this.close();
          });
      }
    },

    round(value, exp) {
      if (typeof exp === "undefined" || +exp === 0) return Math.round(value);

      value = +value;
      exp = +exp;

      if (isNaN(value) || !(typeof exp === "number" && exp % 1 === 0))
        return NaN;

      // Shift
      value = value.toString().split("e");
      value = Math.round(
        +(value[0] + "e" + (value[1] ? +value[1] + exp : exp))
      );

      // Shift back
      value = value.toString().split("e");
      return +(value[0] + "e" + (value[1] ? +value[1] - exp : -exp));
    },
  },
};
</script>
