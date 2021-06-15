<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <v-alert
      :value="alert.isShow"
      :type="alert.type || 'error'"
      transition="slide-y-transition"
    >
      {{ alert.message }}
    </v-alert>
    <v-text-field
      v-model="changePassword.password"
      :append-icon="show.password ? 'mdi-eye' : 'mdi-eye-off'"
      :rules="[passwordRequired, maxlength]"
      :type="show.password ? 'text' : 'password'"
      label="Password Lama"
      required
      @click:append="show.password = !show.password"
    ></v-text-field>

    <v-text-field
      v-model="changePassword.newPassword"
      :append-icon="show.newPassword ? 'mdi-eye' : 'mdi-eye-off'"
      :rules="[passwordRequired, maxlength]"
      :type="show.newPassword ? 'text' : 'password'"
      label="Password Baru"
      required
      @click:append="show.newPassword = !show.newPassword"
    ></v-text-field>

    <v-text-field
      v-model="changePassword.reNewPassword"
      :append-icon="show.reNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
      :rules="[repeatPasswordRequired, maxlength, passwordConfirmationRule]"
      :type="show.reNewPassword ? 'text' : 'password'"
      label="Ulangi Password Baru"
      required
      @click:append="show.reNewPassword = !show.reNewPassword"
    ></v-text-field>

    <v-btn
      color="primary"
      class="mr-4"
      :disabled="!valid || isLoading"
      @click="sendRequestChangePassword"
    >
      Simpan
    </v-btn>
  </v-form>
</template>
<script>
import { mapState } from "vuex";
export default {
  data: () => ({
    valid: true,
    changePassword: {
      password: "",
      newPassword: "",
      reNewPassword: "",
    },
    defaultChangePasswordValue: {
      password: "",
      newPassword: "",
      reNewPassword: "",
    },
    show: {
      password: false,
      newPassword: false,
      reNewPassword: false,
    },
  }),
  computed: {
    ...mapState({
      alert: (state) => state.alert,
      isLoading: (state) => state.auth.isLoading,
    }),
    passwordRequired() {
      return (v) => !!v || "Password baru wajib diisi";
    },
    repeatPasswordRequired() {
      return (v) => !!v || "Ulangi password baru wajib diisi";
    },
    passwordConfirmationRule() {
      return (
        this.changePassword.newPassword === this.changePassword.reNewPassword ||
        "Ulangi password baru harus sama dengan password baru"
      );
    },
    maxlength() {
      return (v) => v.length >= 8 || "minimal karater 8 harus melebihi";
    },
  },
  methods: {
    sendRequestChangePassword() {
      if (this.$refs.form.validate()) {
        this.$store
          .dispatch("auth/sendRequestChangePassword", this.changePassword)
          .then((_) => {
            this.$refs.form.resetValidation();
            this.valid = true;
            this.changePassword = this.defaultChangePasswordValue;
          })
          .catch((err) => console.log(err));
      }
    },
  },
};
</script>
