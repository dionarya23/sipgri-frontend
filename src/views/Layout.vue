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
          <v-list-item v-for="(item, i) in items" :key="i" :to="item.link">
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>

      <template v-slot:append>
        <div class="pa-2">
          <v-btn block @click="toggleDarkMode" depressed>
            <v-icon left v-if="$vuetify.theme.dark">
              mdi-white-balance-sunny
            </v-icon>
            <v-icon left v-else>
              mdi-weather-night
            </v-icon>
            Tema
          </v-btn>
        </div>
        <div class="pa-2">
          <v-btn block color="red" dark @click="logout" depressed>
            Keluar
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar app flat color="primary" dark clipped-left>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>Application</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <div class="pa-4 pa-lg-8">
        <p class="text-h4 text-center text-lg-left text--secondary mb-8">
          Data {{ $route.name }}
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
    items: [
      { title: "Guru", icon: "mdi-account-tie", link: "/guru" },
      { title: "Account", icon: "mdi-account-box", link: "/" },
      { title: "Admin", icon: "mdi-gavel", link: "/" }
    ]
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
    }
  },
  mounted() {
    this.userData = this.$store.state.auth.user;
  }
};
</script>
