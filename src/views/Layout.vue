<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list>
        <v-list-item link>
          <v-list-item-content>
            <v-list-item-title class="title">
              {{ userData.nama }}
            </v-list-item-title>
            <v-list-item-subtitle>{{ userData.email }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list>
        <v-list-item-group v-if="userData.type_user === 'tata_usaha'">
          <!-- Kalau mau bikin menu DENGAN sub-menu, copas yang ini  -->
          <!-- Terus bikin array contohnya udah ada di bawah -->
          <v-list-group :value="true" no-action prepend-icon="mdi-database">
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>Data Master</v-list-item-title>
              </v-list-item-content>
            </template>

            <v-list-item
              v-for="([title, icon, link], i) in tata_usaha_menu.master"
              :key="i"
              link
              color="secondary"
              :to="link"
            >
              <v-list-item-title v-text="title"></v-list-item-title>

              <v-list-item-icon>
                <v-icon v-text="icon"></v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-list-group>

          <v-list-group
            :value="true"
            no-action
            prepend-icon="mdi-google-classroom"
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>Kenaikan Kelas</v-list-item-title>
              </v-list-item-content>
            </template>

            <v-list-item
              v-for="([title, icon, link], i) in tata_usaha_menu.kenaikanKelas"
              :key="i"
              link
              color="secondary"
              :to="link"
            >
              <v-list-item-title v-text="title"></v-list-item-title>

              <v-list-item-icon>
                <v-icon v-text="icon"></v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-list-group>
          <!-- --------------------------------- -->

          <v-list-group
            :value="true"
            no-action
            prepend-icon="mdi-file-document-multiple"
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>Raport Siswa</v-list-item-title>
              </v-list-item-content>
            </template>

            <v-list-item
              v-for="([title, icon, link], i) in tata_usaha_menu.raport"
              :key="i"
              link
              color="secondary"
              :to="link"
              @click="doReload(title)"
            >
              <v-list-item-title v-text="title"></v-list-item-title>

              <v-list-item-icon>
                <v-icon v-text="icon"></v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-list-group>
          <!-- --------------------------------- -->
        </v-list-item-group>

        <v-list-item-group v-else-if="userData.type_user === 'kurikulum'">
          <v-list-group :value="true" no-action prepend-icon="mdi-database">
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>Data Master</v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item
              v-for="([title, icon, link], i) in kurikulum_menu.master"
              :key="i"
              link
              color="secondary"
              :to="link"
            >
              <v-list-item-title v-text="title"></v-list-item-title>
              <v-list-item-icon>
                <v-icon v-text="icon"></v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-list-group>

          <v-list-group :value="true" no-action prepend-icon="mdi-school">
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>Kelas</v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item
              v-for="([title, icon, link], i) in kurikulum_menu.kelas"
              :key="i"
              link
              color="secondary"
              :to="link"
            >
              <v-list-item-title v-text="title"></v-list-item-title>
              <v-list-item-icon>
                <v-icon v-text="icon"></v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-list-group>

          <v-list-group
            :value="true"
            no-action
            prepend-icon="mdi-calendar-blank-outline"
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>Jadwal</v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item
              v-for="([title, icon, link], i) in kurikulum_menu.jadwal"
              :key="i"
              link
              color="secondary"
              :to="link"
            >
              <v-list-item-title v-text="title"></v-list-item-title>
              <v-list-item-icon>
                <v-icon v-text="icon"></v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-list-group>
        </v-list-item-group>

        <v-list-item-group
          v-else-if="
            userData.type_user === 'guru' || userData.type_user === 'wali_kelas'
          "
        >
          <v-list-item to="/dashboard">
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item>

          <v-list-group
            :value="true"
            no-action
            prepend-icon="mdi-book-open-outline"
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>Nilai</v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item
              v-for="([title, icon, link], i) in guru_menu"
              :key="i"
              link
              color="secondary"
              :to="link"
            >
              <v-list-item-title v-text="title"></v-list-item-title>
              <v-list-item-icon>
                <v-icon v-text="icon"></v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-list-group>

          <v-list-item to="/detail-absensi" v-if="userData.type_user === 'wali_kelas'">
            <v-list-item-icon>
              <v-icon>mdi-clipboard-list-outline</v-icon>
            </v-list-item-icon>

            <v-list-item-title>Absensi</v-list-item-title>
          </v-list-item>

          <v-list-group
            v-if="userData.type_user === 'wali_kelas'"
            :value="true"
            no-action
            prepend-icon="mdi-file-plus"
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>Raport</v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item
              v-for="([title, icon, link], i) in wali_kelas_menu"
              :key="i"
              link
              color="secondary"
              :to="link"
            >
              <v-list-item-title v-text="title"></v-list-item-title>
              <v-list-item-icon>
                <v-icon v-text="icon"></v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-list-group>
        </v-list-item-group>

        <v-list-item-group>
          <v-list-group
            :value="true"
            no-action
            prepend-icon="mdi-account-circle"
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>Profile</v-list-item-title>
              </v-list-item-content>
            </template>

            <v-list-item
              v-for="([title, icon, link], i) in profile"
              :key="i"
              link
              color="secondary"
              :to="link"
            >
              <v-list-item-title v-text="title"></v-list-item-title>

              <v-list-item-icon>
                <v-icon v-text="icon"></v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-list-group>
        </v-list-item-group>
      </v-list>

      <template v-slot:append>
        <div class="pa-2">
          <v-btn block color="red" dark @click="logout" depressed>
            Keluar
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar app flat dark clipped-left>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title
        >Sistem Informasi Akademik ( Halaman
        {{
          userData.type_user === "tata_usaha"
            ? "Tata Usaha"
            : userData.type_user === "kurikulum"
            ? "Kurikulum"
            : userData.type_user === "guru"
            ? "Guru"
            : "Wali Kelas"
        }}
        )</v-toolbar-title
      >
    </v-app-bar>

    <v-main>
      <div class="pa-4 pa-lg-8">
        <p
          v-if="$route.name === 'Data Tanggal LHBS Tahun Ajaran'"
          class="text-h4 text-center text-lg-left text--secondary mb-8"
        >
          Pelaksanaan Pembuatan Raport Tahun Ajaran {{ tahunAjaranAktifLHBS.tahun_awal }}/{{
            tahunAjaranAktifLHBS.tahun_akhir
          }}
        </p>

        <p
          v-else-if="
            $route.name === 'Data Jadwal' ||
              $route.name === 'Cetak Jadwal Kelas' ||
              $route.name === 'Absensi Peserta Didik' ||
              $route.name === 'Nilai Eskul'
          "
          class="text-h4 text-center text-lg-left text--secondary mb-8"
        >
          {{ $route.name }} Tahun Ajaran {{ tahunAjaranAktif.tahun_awal }}/{{
            tahunAjaranAktif.tahun_akhir
          }}
        </p>

        <p
          v-else-if="$route.name === 'Penilaian Mata Pelajaran'"
          class="text-h4 text-center text-lg-left text--secondary mb-8"
        >
           {{ $route.name }}
        </p>

        <p
          v-else-if="$route.name === 'Pengisian Nilai Peserta Didik'"
          class="text-h4 text-center text-lg-left text--secondary mb-8"
        >
          <v-btn @click="back" text color="black">
            <v-icon>
              mdi-arrow-left
            </v-icon>
          </v-btn>
          {{ $route.name }}
        </p>

        <p
          v-else-if="$route.name === 'Pengisian Catatan Wali Kelas'"
          class="text-h4 text-center text-lg-left text--secondary mb-8"
        >
          <v-btn @click="back" text color="black">
            <v-icon>
              mdi-arrow-left
            </v-icon>
          </v-btn>

          {{ $route.name }}
        </p>

        <!-- <p
          v-else-if="
            $route.name === 'Pengisian Absensi' ||
              $route.name === 'Pengisian Nilai Eskul'
          "
          class="text-h4 text-center text-lg-left text--secondary mb-8"
        >
          <v-btn @click="back" text color="black">
            <v-icon>
              mdi-arrow-left
            </v-icon>
          </v-btn>
          {{ $route.name }} Tahun Ajaran {{ tahunAjaranAktif.tahun_awal }}/{{
            tahunAjaranAktif.tahun_akhir
          }}
        </p> -->

        <p
          v-else-if="$route.name === 'Cetak Raport Peserta Didik'"
          class="text-h4 text-center text-lg-left text--secondary mb-8"
        >
          <v-btn @click="back" text color="black">
            <v-icon>
              mdi-arrow-left
            </v-icon>
          </v-btn>
          {{ $route.name }}
        </p>

        <p v-else class="text-h4 text-center text-lg-left text--secondary mb-8">
          {{ $route.name }}
        </p>

        <router-view />
      </div>
    </v-main>
  </v-app>
</template>

<script>
import { mapState } from "vuex";
export default {
  data: () => ({
    drawer: null,
    userData: {},
    // ** Di bawah ini array buat bikin sub menu
    // ** Kode icon bisa di liat di https://materialdesignicons.com/
    // ** Tinggal tambah mdi-kode-icon
    tata_usaha_menu: {
      master: [
        ["Data User", "mdi-account-tie", "/user"],
        ["Data Peserta Didik", "mdi-school", "/peserta-didik"],
        ["Data Tahun Ajaran", "mdi-calendar", "/tahun-ajaran"]
      ],
      kenaikanKelas: [
        ["Laporan", "mdi-alert-octagon", "/laporan-tidak-naik-kelas"],
        // [
        //   "Ubah Tingkat Siswa",
        //   "mdi-format-font-size-increase",
        //   "/ubah-tingkat-siswa"
        // ]
      ],
      raport: [
        ["Pelaksanaan Raport", "mdi-calendar-month", "/tanggal-lhbs"],
        ["Cetak Raport", "mdi-printer-settings", "/cetak-raport"]
      ]
    },

    kurikulum_menu: {
      master: [
        ["Mata Pelajaran", "mdi-book-outline", "/mata-pelajaran"],
        ["Esktrakulikuler", "mdi-basketball", "/eskul"],
        ["Nilai Predikat", "mdi-alphabetical-variant", "/nilai-predikat"],
        ["Predikat Sikap", "mdi-alpha-s-circle-outline", "/predikat-sikap"],
        ["Predikat Eskul", "mdi-scoreboard-outline", "/predikat-eskul"]
      ],
      kelas: [
        ["Kelas", "mdi-google-classroom", "/data-kelas"],
        ["Pembagian Kelas", "mdi-slash-forward-box", "/pembagian-kelas"]
        // ["Pembagian Wali", "mdi-account-child", "/pembagian-wali-kelas"],
      ],

      jadwal: [
        ["Data Jadwal", "mdi-clock-outline", "/data-jadwal"],
        ["Cetak Jadwal Kelas", "mdi-cloud-print-outline", "/jadwal-kelas"]
      ]
    },

    guru_menu: [
      ["Nilai KKM", "mdi-note-multiple", "/nilai-kkm"],
      ["Predikat Mapel", "mdi-alphabetical-variant", "/predikat-mapel"],
      ["Penilaian", "mdi-lead-pencil", "/penilaian"]
    ],

    wali_kelas_menu: [
      ["Catatan Wali Kelas", "mdi-account-edit", "/catatan-wali-kelas"],
      ["Nilai Eskul", "mdi-note-plus", "/nilai-eskul"],
      ["Prestasi Siswa", "mdi-trophy-outline", "/prestasi-siswa"]
    ],

    profile: [
      ["Ubah Profile", "mdi-account-settings", "/ubah-profile"],
      ["Ubah Password", "mdi-form-textbox-password", "/ubah-password"]
    ]
  }),
  methods: {
    back() {
      this.$router.back();
    },

    logout() {
      this.$store
        .dispatch("auth/logout")
        .then(() => this.$router.push("/login"));
    },

    doReload(title) {
      if (title === "Tanggal LHBS") {
        window.location.reload();
      }
    }
  },
  computed: {
    ...mapState({
      tahunAjaranAktifLHBS: (state) => state.raport.tahun_ajaran_aktif,
      tahunAjaranAktif: (state) => state.tahunAjaran.tahunAjaranAktif,
      raportAktif: (state) => state.nilaiSiswa.raportStatusAktif
    })
  },
  mounted() {
    this.userData = this.$store.state.auth.user;

    if (this.userData.type_user === "tata_usaha") {
      this.$store.dispatch("raport/getTanggalLHBSByStatusAktif");
    }

    // if (
    //   this.$route.name === "Penilaian Mata Pelajaran" ||
    //   this.$route.name === "Pengisian Nilai Peserta Didik" ||
    //   this.$route.name === "Prestasi Siswa"
    // ) {
    // }

    if (
      this.userData.type_user === "kurikulum" ||
      this.userData.type_user === "wali_kelas" ||
      this.userData.type_user === "guru"
    ) {
      this.$store.dispatch("nilaiSiswa/getRaportStatusPelaksanaanAktif");
      this.$store
        .dispatch("tahunAjaran/getTahunAjaranAktif")
        .then((_) => {})
        .catch((err) => console.log(err));
    }
  }
};
</script>
<style scoped>
.v-list-item__title {
  font-size: 14px;
}
</style>
