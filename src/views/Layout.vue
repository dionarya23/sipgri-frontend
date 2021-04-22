<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list>
        <v-list-item link>
          <v-list-item-content>
            <v-list-item-title class="title">
              Sandra Adams
            </v-list-item-title>
            <v-list-item-subtitle>sandra_a88@gmail.com</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>
      <v-list>
        <v-list-item v-for="item in items" :key="item.title" link>
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
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
      <!--  -->
    </v-main>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    drawer: null,
    items: [
      { title: "Dashboard", icon: "mdi-view-dashboard" },
      { title: "Account", icon: "mdi-account-box" },
      { title: "Admin", icon: "mdi-gavel" }
    ]
  }),
  methods: {
    toggleDarkMode() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      localStorage.setItem("darkMode", this.$vuetify.theme.dark.toString());
    },
    logout() {
      this.$store.dispatch("logout").then(() => this.$router.push("/login"));
    }
  }
};
</script>
