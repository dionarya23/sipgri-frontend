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
              Ubah Password
            </p>
            <v-alert
              :value="alert.isShow"
              :type="alert.type || 'error'"
              transition="slide-y-transition"
            >
              {{ alert.message }}
            </v-alert>
            <v-form
              :v-if="isHashVerif"
              @submit.prevent="validate"
              ref="form"
              v-model="valid"
              lazy-validation
            >
              <v-text-field
                v-model="data.password"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[passwordRequired, maxlength]"
                :type="showPassword ? 'text' : 'password'"
                label="Password Baru"
                outlined
                required
                @click:append="showPassword = !showPassword"
              ></v-text-field>

              <v-text-field
                v-model="data.repeat_password"
                :append-icon="showPasswordRepeat ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[
                  repeatPasswordRequired,
                  maxlength,
                  passwordConfirmationRule,
                ]"
                :type="showPasswordRepeat ? 'text' : 'password'"
                label="Ulangi Password Baru"
                outlined
                required
                @click:append="showPasswordRepeat = !showPasswordRepeat"
              ></v-text-field>

              <v-btn
                type="submit"
                :loading="isLoading"
                :disabled="!valid || isLoading"
                color="primary"
                depressed
                large
                block
                @click="validate"
              >
                Kirim
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapState } from "vuex";
export default {
  data: () => ({
    valid: true,
    showPassword: false,
    showPasswordRepeat: false,
    data: {
      repeat_password: "",
      password: "",
      hash: "",
    },
  }),
  computed: {
    ...mapState({
      isLoading: (state) => state.auth.isLoading,
      isHashVerif: (state) => state.auth.isHashverif,
      alert: (state) => state.alert,
    }),
    passwordRequired() {
      return (v) => !!v || "Password baru wajib diisi";
    },
    repeatPasswordRequired() {
      return (v) => !!v || "Ulangi password baru wajib diisi";
    },
    passwordConfirmationRule() {
      return (
        this.data.password === this.data.repeat_password ||
        "Ulangi password baru harus sama dengan password"
      );
    },
    maxlength() {
      return (v) => v.length >= 8 || "minimal karater 8 harus melebihi";
    },
  },
  created() {
    this.data.hash = this.$route.params.hash;
    this.$store
      .dispatch("auth/verifyHash", this.data.hash)
      .then(() => {})
      .catch((err) => console.error(err));
  },
  methods: {
    validate() {
      if (this.$refs.form.validate()) {
        this.$store
          .dispatch("auth/changePassword", this.data)
          .then(() => {
            this.$router.push("/login");
          })
          .catch((err) => console.error(err));
      }
    },
  },
};
</script>

<style></style>
