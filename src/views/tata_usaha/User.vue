<template>
  <div class="user">
    <v-data-table
      :loading="isLoading"
      :headers="headers"
      :items="user"
      sort-by="nip"
      class="elevation-1"
      :search="search"
    >
      <template v-slot:top>
        <v-toolbar flat>
           <v-text-field v-model="search" append-icon="mdi-magnify"  label="Cari Berdasarkan NUPTK, Nama, nomor telepon, Email, type user" single-line hide-details></v-text-field>
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

                    <v-select
                      v-model="editedItem.type_user"
                      :items="typeUserItems"
                      :rules="requiredRule"
                      item-text="type_user_text"
                      item-value="type_user_value"
                      label="Type User"
                    ></v-select>

                    <div v-show="typeUserIsGuru">
                      <div class="text-left">
                        <v-btn
                          class="mx-2"
                          fab
                          dark
                          small
                          color="primary"
                          @click="addMengajar"
                        >
                          <v-icon dark>
                            mdi-plus
                          </v-icon>
                        </v-btn>

                        <v-btn
                          class="mx-2"
                          fab
                          dark
                          small
                          color="danger"
                          v-show="mataPelajaranOne"
                          @click="removeMengajar"
                        >
                          <v-icon dark>
                            mdi-minus
                          </v-icon>
                        </v-btn>
                      </div>
                      <MataPelajaranCard
                        v-for="(m, index) in mengajar"
                        :key="index"
                        :rules="requiredRule"
                        :mengajar="m"
                        :index="index"
                      ></MataPelajaranCard>
                    </div>
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
import MataPelajaranCard from "../../components/MataPelajaranCard";

export default {
  components: {
    MataPelajaranCard
  },
  data: () => ({
    search: '',
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
      { text: "Aksi", value: "actions", sortable: false }
    ],
    editedIndex: -1,
    oldNip: "",
    editedItem: {
      nip: "",
      nama: "",
      nomor_telepon: "",
      email: "",
      password: "",
      type_user: ""
    },
    defaultItem: {
      nip: "",
      nama: "",
      nomor_telepon: "",
      email: "",
      password: "",
      type_user: ""
    },
    typeUserItems: ["Tata Usaha", "Kurikulum", "Guru"]
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Tambah Data User" : "Ubah Data User";
    },
    mataPelajaranOne() {
      return this.mengajar.length > 1;
    },
    typeUserIsGuru() {
      return this.editedItem.type_user === "Guru";
    },
    ...mapState({
      mengajar: (state) => state.user.mengajar,
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
    addMengajar() {
      this.$store.dispatch("user/addMengajar");
    },
    removeMengajar() {
      this.$store.dispatch("user/removeMengajar");
    },
    // capitalizeFirstLetter(string) {
    //   let string_array = string.split("_");
    //   if (string_array.length > 1) {
    //     return `${string_array[0].charAt(0).toUpperCase() +
    //       string.slice(1)} ${string_array[1].charAt(0).toUpperCase() +
    //       string.slice(1)}`;
    //   } else {
    //     return `${string.charAt(0).toUpperCase() + string.slice(1)}`;
    //   }
    // },
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
      this.$refs.form.resetValidation();
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      let data = { ...this.editedItem };
      data.type_user = data.type_user
        .toLowerCase()
        .split(" ")
        .join("_");

      console.log(this.mengajar);
      // if (this.editedIndex > -1) {
      //   const data = {
      //     oldNip: this.oldNip,
      //     ...this.editedItem,
      //   };
      //   const editedItem = this.user[this.editedIndex];
      //   this.$store
      //     .dispatch("user/updateUser", data)
      //     .then((res) => {
      //       Object.assign(editedItem, res.data.data);
      //     })
      //     .catch((err) => {
      //       console.log(err);
      //     });
      // } else {
      //   this.$store
      //     .dispatch("user/createUser", this.editedItem)
      //     .then((res) => {
      //       this.user.push(res.data.data);
      //     })
      //     .catch((err) => {
      //       console.log(err);
      //     });
      // }
      // this.close();
    }
  }
};
</script>
