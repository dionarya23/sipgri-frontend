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
      v-model="userData.nuptk"
      @blur="checkNuptkExist"
      :error-messages="isNuptkAvail"
      type="number"
      label="NUPTK"
      counter="16"
      :rules="[requiredRule, maxRule]"
      required
    ></v-text-field>
    <v-text-field
      v-model="userData.nama"
      :rules="[requiredRule]"
      label="Nama"
      required
    ></v-text-field>

    <v-text-field
      v-model="userData.nomor_telepon"
      :error-messages="isNomorTeleponAvail"
      @blur="checkNomorTeleponExist"
      label="Nomor Telepon"
      :rules="[requiredRule, phoneNumberRule]"
      required
    ></v-text-field>

    <v-text-field
      v-model="userData.email"
      @blur="checkEmailExist"
      :error-messages="isEmailAvail"
      label="Email"
      type="email"
      :rules="[requiredRule, emailRule]"
      required
    ></v-text-field>

    <v-btn
      :disabled="!valid || isLoading"
      color="primary"
      class="mr-4"
      @click="changeProfile"
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
    isNuptkAvail: "",
    isEmailAvail: "",
    isNomorTeleponAvail: "",
    userData: {},
    requiredRule: (v) => !!v || "Wajib diisi",
    phoneNumberRule: (v) =>
      /^(^\+62|62|^08)(\d{3,4}-?){2}\d{3,4}$/g.test(v) ||
      "Format nomor telepon salah",
    emailRule: (v) => /.+@.+\..+/.test(v) || "Format email salah",
  }),
  computed: {
    ...mapState({
      alert: (state) => state.alert,
      isLoading: (state) => state.auth.isLoading,
      user: (state) => state.auth.user,
    }),
    maxRule() {
      return (v) => v.length >= 16 || "panjang nuptk minimal 16 nomor";
    },
  },
  mounted() {
    this.userData = { ...this.user };
  },
  methods: {
    changeProfile() {
      if (this.$refs.form.validate()) {
        this.$store
          .dispatch("auth/changeProfile", {
            nuptk: this.userData.nuptk,
            nama: this.userData.nama,
            nomor_telepon: this.userData.nomor_telepon,
            email: this.userData.email,
          })
          .then((_) => {
            this.user.nuptk = this.userData.nuptk;
            this.user.nama = this.userData.nama;
            this.user.nomor_telepon = this.userData.nomor_telepon;
            this.user.email = this.userData.email;
          })
          .catch((err) => console.log(err));
      }
    },

    checkNuptkExist() {
      this.$store
        .dispatch("auth/checkDataExist", {
          oldValue: this.user.nuptk,
          newValue: this.userData.nuptk,
          typeAttribute: "nuptk",
        })
        .then((result) => {
          const { is_exist } = result.data.data;
          this.isNuptkAvail = is_exist
            ? "NUPTK sudah dipakai oleh user lain"
            : "";
        })
        .catch((err) => console.log(err));
    },

    checkEmailExist() {
      this.$store
        .dispatch("auth/checkDataExist", {
          oldValue: this.user.email,
          newValue: this.userData.email,
          typeAttribute: "email",
        })
        .then((result) => {
          const { is_exist } = result.data.data;
          this.isEmailAvail = is_exist
            ? "Email sudah dipakai oleh user lain"
            : "";
        })
        .catch((err) => console.log(err));
    },

    checkNomorTeleponExist() {
      this.$store
        .dispatch("auth/checkDataExist", {
          oldValue: this.user.nomor_telepon,
          newValue: this.userData.nomor_telepon,
          typeAttribute: "nomor_telepon",
        })
        .then((result) => {
          const { is_exist } = result.data.data;
          this.isNomorTeleponAvail = is_exist
            ? "Nomor telepon sudah dipakai oleh user lain"
            : "";
        })
        .catch((err) => console.log(err));
    },
  },
};
</script>
