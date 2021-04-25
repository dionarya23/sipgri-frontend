<template>
  <v-app>
    <v-main
      :class="$vuetify.theme.dark ? 'grey darken-4' : 'blue-grey lighten-5'"
    >
      <v-container>
        <v-card
          class="mx-auto mt-16 pb-4"
          width="480px"
          elevation="12"
          rounded="lg"
        >
          <v-card-text>
            <p class="display-1 text-center my-8">
              SI Akademik<br /> SMA PGRI 1 Bandung
            </p>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field
                v-model="data.email"
                :rules="emailRules"
                label="E-mail"
                outlined
                required
              ></v-text-field>

              <v-text-field
                v-model="data.password"
                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="passwordRules"
                :type="show1 ? 'text' : 'password'"
                label="Password"
                outlined
                @click:append="show1 = !show1"
              ></v-text-field>

              <v-btn
                :disabled="!valid"
                color="primary"
                depressed
                large
                block
                @click="validate"
              >
                Masuk
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    valid: true,
    show1: false,
    data: {
      email: "",
      password: ""
    },
    passwordRules: [(v) => !!v || "Password wajib diisi"],
    emailRules: [
      (v) => !!v || "E-mail wajib diisi",
      (v) => /.+@.+\..+/.test(v) || "E-mail harus valid"
    ]
  }),

  methods: {
    validate() {
      if (this.$refs.form.validate()) {
        this.$store
          .dispatch("login", this.data)
          .then(() => {
            this.$router.push("/");
          })
          .catch((err) => console.error(err));
      }
    }
  }
};
</script>

<style></style>
