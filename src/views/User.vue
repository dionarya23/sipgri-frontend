<template>
  <div class="user">
    <v-data-table
      :loading="isLoading"
      :headers="headers"
      :items="user"
      sort-by="nip"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                depressed
                class="mb-2 text--white"
                v-bind="attrs"
                v-on="on"
                :loading="isLoading"
                :disabled="isLoading"
              >
                Tambah Data User
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-form ref="form" v-model="valid" lazy-validation>
                    <v-text-field
                      @blur="checkNip"
                      :error-messages="isNipAvail"
                      v-model="editedItem.nip"
                      type="number"
                      label="NIP"
                      :rules="requiredRule"
                    ></v-text-field>

                    <v-text-field
                      v-model="editedItem.nama"
                      label="Nama"
                      :rules="requiredRule"
                    ></v-text-field>

                    <v-text-field
                      v-model="editedItem.nomor_telepon"
                      type="number"
                      label="No. Telepon"
                      :rules="requiredRule"
                    ></v-text-field>

                    <v-text-field
                      @blur="checkEmail"
                      v-model="editedItem.email"
                      :error-messages="isEmailAvail"
                      :rules="emailRules"
                      label="Email"
                    ></v-text-field>

                    <v-text-field
                      v-if="editedIndex === -1"
                      v-model="editedItem.password"
                      :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                      :rules="requiredRule"
                      :type="show1 ? 'text' : 'password'"
                      label="Password"
                      @click:append="show1 = !show1"
                    ></v-text-field>

                    <v-text-field
                      v-model="editedItem.type"
                      label="Type"
                      :rules="requiredRule"
                    ></v-text-field>
                  </v-form>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" outlined @click="close">
                  Batal
                </v-btn>
                <v-btn
                  color="primary"
                  class="text--white"
                  depressed
                  @click="save"
                  :disabled="!valid || isLoading"
                >
                  Simpan
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="480px">
            <v-card>
              <v-card-title class="headline">Peringatan</v-card-title>
              <v-card-text
                ><p class="text-h6">
                  Apakah anda yakin ingin menghapus data ini?
                </p></v-card-text
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >Batal</v-btn
                >
                <v-btn color="error" text @click="deleteItemConfirm">Ya!</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
        <v-alert
          :value="alert.isShow"
          :type="alert.type || 'error'"
          transition="slide-y-transition"
        >
          {{ alert.message }}
        </v-alert>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon small @click="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:no-data>
        <p class="mt-4">Belum ada data yang bisa ditampilkan.</p>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data: () => ({
    show1: false,
    valid: true,
    dialog: false,
    dialogDelete: false,
    isNipAvail: "",
    isEmailAvail: "",
    requiredRule: [(v) => !!v || "Wajib diisi"],
    emailRules: [
      (v) => !!v || "E-mail wajib diisi",
      (v) => /.+@.+\..+/.test(v) || "E-mail harus valid"
    ],
    headers: [
      {
        text: "NIP",
        align: "start",
        value: "nip"
      },
      { text: "Nama", value: "nama" },
      { text: "No. Telepon", value: "nomor_telepon", sortable: false },
      { text: "Email", value: "email" },
      { text: "Type User", value: "type_user" },
      { text: "Actions", value: "actions", sortable: false }
    ],
    editedIndex: -1,
    oldNip: "",
    editedItem: {
      nip: "",
      nama: "",
      nomor_telepon: "",
      email: "",
      password: "",
      type: ""
    },
    defaultItem: {
      nip: "",
      nama: "",
      nomor_telepon: "",
      email: "",
      password: "",
      type: ""
    }
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Tambah Data User" : "Ubah Data User";
    },
    ...mapState({
      user: (state) => state.user.user,
      isLoading: (state) => state.user.isLoading,
      alert: (state) => state.alert
    })
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    }
  },

  mounted() {
    this.$store.dispatch("user/getAllUser");
  },

  methods: {
    // checkNip() {
    //   const data = {
    //     nip: this.editedItem.nip
    //   };
    //   if (this.editedIndex === -1) {
    //     this.$store
    //       .dispatch("user/checkNip", data)
    //       .then((result) => {
    //         this.isNipAvail = result.data.data.is_available
    //           ? ""
    //           : "NIP sudah pernah dipakai";
    //       })
    //       .catch((err) => {
    //         console.log(err);
    //       });
    //   }
    // },

    // checkEmail() {
    //   const data = {
    //     email: this.editedItem.email
    //   };
    //   if (this.editedIndex === -1) {
    //     this.$store
    //       .dispatch("user/checkEmail", data)
    //       .then((result) => {
    //         this.isEmailAvail = result.data.data.is_available
    //           ? ""
    //           : "Email sudah pernah dipakai";
    //       })
    //       .catch((err) => {
    //         console.log(err);
    //       });
    //   }
    // },

    editItem(item) {
      this.editedIndex = this.user.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.oldNip = item.nip;
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.user.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      const nip = this.editedItem.nip;
      this.$store.dispatch("user/deleteUser", nip);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.isNipAvail = "";
      this.isEmailAvail = "";
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        const data = {
          oldNip: this.oldNip,
          ...this.editedItem
        };
        const editedItem = this.user[this.editedIndex];
        this.$store
          .dispatch("user/updateUser", data)
          .then((res) => {
            Object.assign(editedItem, res.data.data);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.$store
          .dispatch("user/createUser", this.editedItem)
          .then((res) => {
            this.user.push(res.data.data);
          })
          .catch((err) => {
            console.log(err);
          });
      }
      this.close();
    }
  }
};
</script>
