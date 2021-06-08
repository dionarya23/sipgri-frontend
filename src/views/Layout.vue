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
        <v-list-item-group>
          <!-- Kalau mau bikin menu TANPA sub-menu, copas yang ini 
          <v-list-item to="/contoh">
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>

            <v-list-item-title>Contoh</v-list-item-title>
          </v-list-item> -->

          <!-- --------------------------------- -->

          <!-- Kalau mau bikin menu DENGAN sub-menu, copas yang ini  -->
          <!-- Terus bikin array contohnya udah ada di bawah -->
          <v-list-group :value="true" no-action prepend-icon="mdi-database">
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>Data Master</v-list-item-title>
              </v-list-item-content>
            </template>

            <v-list-item
              v-for="([title, icon, link], i) in master"
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
              v-for="([title, icon, link], i) in kenaikanKelas"
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
              v-for="([title, icon, link], i) in raport"
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
          <!-- --------------------------------- -->
        </v-list-item-group>
      </v-list>

      <template v-slot:append>
        <!-- <div class="pa-2">
          <v-btn block @click="toggleDarkMode" depressed>
            <v-icon left v-if="$vuetify.theme.dark">
              mdi-white-balance-sunny
            </v-icon>
            <v-icon left v-else>
              mdi-weather-night
            </v-icon>
            Tema
          </v-btn>
        </div> -->
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
        }} )</v-toolbar-title
      >
    </v-app-bar>

    <v-main>
      <div class="pa-4 pa-lg-8">
        <p class="text-h4 text-center text-lg-left text--secondary mb-8">
          {{ $route.name }}
        </p>
        <router-view />
      </div>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    drawer: null,
    userData: {},
    // ** Di bawah ini array buat bikin sub menu
    // ** Kode icon bisa di liat di https://materialdesignicons.com/
    // ** Tinggal tambah mdi-kode-icon
    master: [
      ["User", "mdi-account-tie", "/user"],
      ["Peserta Didik", "mdi-school", "/peserta-didik"],
      ["Tahun Ajaran", "mdi-calendar", "/tahun-ajaran"],
    ],

    kenaikanKelas: [
      ["Laporan", "mdi-alert-octagon", "/laporan-tidak-naik-kelas"],
      [
        "Ubah Tingkat Siswa",
        "mdi-format-font-size-increase",
        "/ubah-tingkat-siswa",
      ],
    ],
    raport: [
      ["Tanggal Pembagian", "mdi-calendar-month", "/tanggal-pembagian"],
      ["Cetak Raport", "mdi-printer-settings", "/cetak-raport"],
    ],
    profile: [
      ["Ubah Profile", "mdi-account-settings", "/ubah-profile"],
      ["Ubah Password", "mdi-form-textbox-password", "/ubah-password"],
    ],
  }),
  methods: {
    toggleDarkMode() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      localStorage.setItem("darkMode", this.$vuetify.theme.dark.toString());
    },
    logout() {
      this.$store
        .dispatch("auth/logout")
        .then(() => this.$router.push("/login"));
    },
  },
  mounted() {
    this.userData = this.$store.state.auth.user;
  },
};
</script>
<style scoped>
.v-list-item__title {
  font-size: 14px;
}
</style>
