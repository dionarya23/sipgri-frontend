<template>
  <div class="detail-nilai-eskul">
    <v-container>
      <div class="text-center" v-if="isLoading">
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
      </div> 
    <div v-else>
    <v-card v-if="getJenisPelaksanaanRaport">
      <v-card-title>
        Perhatian!!
      </v-card-title>
      <v-card-subtitle>
        Pengisian catatan wali kelas hanya berlaku untuk raport periode <b>Oktober - Desember Tahun {{ raport.tahun_ajaran.tahun_awal }}</b> dan <b>April - Juni Tahun {{ raport.tahun_ajaran.tahun_akhir }}</b>
      </v-card-subtitle>
    </v-card>
    <v-card v-else>
       <v-card-title>
       Pengisian Catatan Wali Kelas untuk kelas {{ nama_kelas }}
      </v-card-title>
      <v-card-subtitle>
        Periode: {{ getPeriode }}  <br/>
        Semester : {{ raport.semester }}<br/>
        Tahun Ajaran : {{ raport.tahun_ajaran.tahun_awal }}/{{ raport.tahun_ajaran.tahun_akhir }}
        <!-- Pembuatan Raport: {{ raport.jenis_penilaian.toLowerCase() }} -->
      </v-card-subtitle>
      <v-data-table
        :items="anak_wali"
        :headers="headers"
        :loading="isLoading"
        class="elevation-1"
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
                  {{ formTitle }}
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
                        label="Tahun AJaran"
                        v-model="tahunAjaran"
                        readonly
                      >
                      </v-text-field>
                      <v-text-field
                        label="Jenis Penilaian"
                        v-model="raport.jenis_penilaian"
                        readonly
                      >
                      </v-text-field>
                      <v-text-field
                        label="Peserta Didik"
                        v-model="editedItem.nama"
                        readonly
                      >
                      </v-text-field>

                      <div class="text-left">
                        <v-btn
                          class="mx-2"
                          fab
                          dark
                          small
                          color="primary"
                          @click="addEskul"
                          v-show="isEskulHavetwo"
                        >
                          <v-icon dark>
                            mdi-plus
                          </v-icon>
                        </v-btn>

                        <v-btn
                          class="mx-2"
                          fab
                          dark
                          small
                          color="danger"
                          v-show="isEskulJustOne"
                          @click="removeEskul"
                        >
                          <v-icon dark>
                            mdi-minus
                          </v-icon>
                        </v-btn>
                      </div>
                      <v-alert
                        class="mt-4"
                        :value="isDuplicate"
                        type="error"
                        transition="slide-y-transition"
                      >
                        Peserta Didik memiliki dua eskul yang sama!
                      </v-alert>

                      <div
                        v-for="(eskulSelected, index) in editedItem.list_eskul"
                        :key="index"
                        class="text-left"
                        style="margin-top:5%;align-items:bottom!important"
                      >
                        <p style="font-weight:bold">
                          Kegiatan Eskul {{ index + 1 }} yang diikuti
                        </p>
                        <v-autocomplete
                          :items="eskul"
                          item-text="jenis"
                          item-value="id_esktrakulikuler"
                          label="Esktrakulikuler"
                          v-model="eskulSelected.id_esktrakulikuler"
                          :rules="[rulesInputForm.requiredRule]"
                        >
                        </v-autocomplete>

                        <v-autocomplete
                          :items="['A', 'B', 'C', 'D']"
                          label="Nilai Predikat"
                          v-model="eskulSelected.nilai_predikat"
                          :rules="[rulesInputForm.requiredRule]"
                        >
                        </v-autocomplete>
                      </div>
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

        <template v-slot:[`item.peserta_didik.kegiatan_eskul_murid`]="{ item }">
          <p
            v-for="(eskul, index) in item.peserta_didik.kegiatan_eskul_murid"
            :key="index"
          >
            {{ eskul.detail_eskul.jenis }} - {{ eskul.nilai_predikat }}
          </p>
        </template>
      </v-data-table>
    </v-card>
    </div>
    </v-container>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data: () => ({
    valid: true,
    search: "",
    dialog: false,
    isDuplicate: false,
    rulesInputForm: {
      requiredRule: (v) => !!v || "Wajib diisi",
    },
    alertLocal: {
      isShow: false,
      type: "error",
      message: "",
    },
    headers: [
      {
        text: "NISN",
        value: "peserta_didik.nisn",
        sortable: false,
      },
      {
        text: "NIS",
        value: "peserta_didik.nis",
        sortable: false,
      },
      {
        text: "Nama",
        value: "peserta_didik.nama",
      },
      {
        text: "Eskul dan Nilai",
        value: "peserta_didik.kegiatan_eskul_murid",
      },
      { text: "Aksi", value: "actions", sortable: false },
    ],
    editedIndex: -1,
    editedItem: {
      nama: "",
      id_peserta_didik: "",
      id_raport: "",
      list_eskul: [
        {
          id_esktrakulikuler: "",
          nilai_predikat: "",
        },
      ],
    },
    defaultItem: {
      nama: "",
      id_peserta_didik: "",
      id_raport: "",
      list_eskul: [
        {
          id_esktrakulikuler: "",
          nilai_predikat: "",
        },
      ],
    },
  }),
  computed: {
    ...mapState({
      anak_wali: (state) => state.nilaiEskul.anakWali.kelas_siswa,
      nama_kelas: (state) => state.nilaiEskul.anakWali.nama_kelas,
      raport: (state) => state.absensi.raport,
      isLoading: (state) => state.nilaiEskul.isLoading,
      alert: (state) => state.alert,
      eskul: (state) => state.eskul.eskul,
    }),
    formTitle() {
      return this.editedIndex === -1
        ? "Tambah Nilai Eskul"
        : "Ubah Nilai Eskul";
    },
    tahunAjaran() {
      return `${this.raport.tahun_ajaran.tahun_awal}/${this.raport.tahun_ajaran.tahun_akhir}`;
    },
    isEskulJustOne() {
      return this.editedItem.list_eskul.length !== 1;
    },
    isEskulHavetwo() {
      return this.editedItem.list_eskul.length !== 2;
    },
     getPeriode() {
      return this.raport.jenis_penilaian === 'Penilaian Tengah Semester 1' ? `Juli - September ${this.raport.tahun_ajaran.tahun_awal}` 
      : this.raport.jenis_penilaian === 'Penilaian Akhir Semester' ? `Oktober - Desember ${this.raport.tahun_ajaran.tahun_awal}` 
      : this.raport.jenis_penilaian === "Penilaian Tengah Semester 2" ? `Januari - Maret ${this.raport.tahun_ajaran.tahun_akhir}` 
      : `April - Juni ${this.raport.tahun_ajaran.tahun_akhir}`;
    },
    getJenisPelaksanaanRaport(){
      return this.raport.jenis_penilaian !== 'Penilaian Akhir Semester' && this.raport.jenis_penilaian !== 'Penilaian Akhir Tahun';
    }
  },
  mounted() {
    this.$store.dispatch(
      "nilaiEskul/getAnakWali");
    this.$store.dispatch("absensi/getRaport");
    this.$store.dispatch("eskul/getAllEskul");
  },
  methods: {
    save() {
      if (this.$refs.form.validate()) {
        if (!this.duplicateCheck(this.editedItem.list_eskul)) {
          this.$store
            .dispatch("nilaiEskul/cretePenilaianEskul", this.editedItem)
            .then((_) => {
              this.$store.dispatch(
                "nilaiEskul/getAnakWali");
              this.close();
            })
            .catch((err) => {
              console.error(err);
              this.close();
            });
        }
      }
    },

    duplicateCheck(values) {
      let valueArr = values.map(function(item) {
        return item.id_esktrakulikuler;
      });
      let isDuplicate = valueArr.some(function(item, idx) {
        return valueArr.indexOf(item) != idx;
      });
      this.isDuplicate = isDuplicate;
      return isDuplicate;
    },

    removeEskul() {
      this.editedItem.list_eskul.pop();
    },

    addEskul() {
      this.editedItem.list_eskul.push({
        id_esktrakulikuler: 0,
        nilai_predikat: "",
      });
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        this.oldAbsensi = {};
      });
      this.$refs.form.resetValidation();
    },

    editItem(item) {
      this.editedIndex = this.anak_wali.indexOf(item);
      let editedItemBuilder = {
        nama: item.peserta_didik.nama,
        id_peserta_didik: item.id_peserta_didik,
        id_raport: this.raport.id_raport,
        list_eskul: [],
      };

      if (item.peserta_didik.kegiatan_eskul_murid.length === 0) {
        editedItemBuilder.list_eskul = [
          {
            id_esktrakulikuler: 0,
            nilai_predikat: "",
          },
        ];
      } else {
        item.peserta_didik.kegiatan_eskul_murid.map((e) => {
          editedItemBuilder.list_eskul.push({
            id_esktrakulikuler: e.detail_eskul.id_esktrakulikuler,
            nilai_predikat: e.nilai_predikat,
          });
        });
      }

      this.editedItem = Object.assign({}, editedItemBuilder);
      this.dialog = true;
    },
  },
};
</script>
