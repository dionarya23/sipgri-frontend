<template>
  <router-view />
</template>

<script>
export default {
  created() {
    this.$http.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response.status === 401) {
          this.$store.dispatch("logout");
          this.$router.push("/login").catch(() => {});
        }
        // return Error object with Promise
        return Promise.reject(error);
      }
    );
  },
  mounted() {
    const theme = localStorage.getItem("darkMode");
    if (theme) {
      if (theme == "true") {
        this.$vuetify.theme.dark = true;
      } else {
        this.$vuetify.theme.dark = false;
      }
    }
  }
};
</script>
