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
             Lupa Password
            </p>
            <v-alert
              :value="alert.isShow"
              :type="alert.type || 'error'"
              transition="slide-y-transition"
            >
              {{ alert.message }}
            </v-alert>
            <v-form
              @submit.prevent="validate"
              ref="form"
              v-model="valid"
              lazy-validation
            >
              <v-text-field
                v-model="data.phoneOrEmail"
                :rules="phoneOrEmailRules"
                label="E-mail atau Nomor Telepon"
                outlined
                required
              ></v-text-field>

            <router-link style="fontSize:15px" to="/login">Kembali ke Login</router-link>

              <v-btn
              style="margin-top:4%"
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
    show1: false,
    data: {
      phoneOrEmail: "",
    },
    phoneOrEmailRules: [
      (v) => !!v || "E-mail atau nomor telepon wajib diisi",
      (v) =>
        /.+@.+\..+/.test(v) ||
        /^(^\+62|62|^08)(\d{3,4}-?){2}\d{3,4}$/g.test(v) ||
        "E-mail atau nomor telepon harus valid",
    ],
  }),
  created() {
    this.$store.commit("CLOSE_ALERT", {}, { root: true });
  },
  computed: mapState({
    isLoading: (state) => state.auth.isLoading,
    alert: (state) => state.alert,
  }),
  methods: {
    validate() {
      if (this.$refs.form.validate()) {
        this.$store
          .dispatch("auth/lostPassword", this.data)
          .then(() => {
            this.data.phoneOrEmail = "";
            this.$refs.form.resetValidation();
          })
          .catch((err) => console.error(err));
      }
    },
  },
};
</script>
