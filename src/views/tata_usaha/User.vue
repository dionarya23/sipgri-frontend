<template>
  <div class="user">
    <v-data-table
      :loading="isLoading"
      :headers="headers"
      :items="user"
      sort-by="nuptk"
      class="elevation-1"
      :search="search"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Cari Berdasarkan NUPTK, Nama, nomor telepon, Email, type user"
            single-line
            hide-details
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-dialog persistent v-model="dialog" max-width="500px">
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
                      :error-messages="is_nuptk_avail"
                      v-model="editedItem.nuptk"
                      @change="checkInputDuplicate('nuptk')"
                      type="number"
                      label="NUPTK"
                      :counter="16"
                      :rules="nuptkRule"
                    ></v-text-field>

                    <v-text-field
                      v-model="editedItem.nama"
                      label="Nama"
                      :rules="requiredRule"
                    ></v-text-field>

                    <v-text-field
                      :error-messages="is_nomor_telepon_avail"
                      v-model="editedItem.nomor_telepon"
                      type="number"
                      label="No. Telepon"
                      @change="checkInputDuplicate('nomor_telepon')"
                      :rules="requiredRule"
                    ></v-text-field>

                    <v-text-field
                      :error-messages="is_email_avail"
                      v-model="editedItem.email"
                      :rules="emailRules"
                      @change="checkInputDuplicate('email')"
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
                          v-show="mataPelajaranGreaterThanTwo"
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

                      <v-alert
                        class="mt-4"
                        :value="isDuplicate"
                        type="error"
                        transition="slide-y-transition"
                      >
                        Mata pelajaran yang diampu tidak boleh sama!
                      </v-alert>

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
          <v-dialog persistent v-model="dialogDelete" max-width="480px">
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
        <v-icon small @click="editItem(item)">
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
    MataPelajaranCard,
  },
  data: () => ({
    alertLocal: {
      isShow: false,
      type: "",
      message: "",
    },
    search: "",
    show1: false,
    valid: true,
    dialog: false,
    dialogDelete: false,
    is_nuptk_avail: "",
    is_email_avail: "",
    is_nomor_telepon_avail: "",
    requiredRule: [(v) => !!v || "Wajib diisi"],
    nuptkRule: [
      (v) => !!v || "Wajib diisi",
      (v) => (v && v.length === 16) || "NUPTK harus 16 digit",
    ],
    emailRules: [
      (v) => !!v || "E-mail wajib diisi",
      (v) => /.+@.+\..+/.test(v) || "E-mail harus valid",
    ],
    headers: [
      {
        text: "NUPTK",
        align: "start",
        value: "nuptk",
      },
      { text: "Nama", value: "nama" },
      { text: "No. Telepon", value: "nomor_telepon", sortable: false },
      { text: "Email", value: "email" },
      { text: "Type User", value: "type_user" },
      { text: "Aksi", value: "actions", sortable: false },
    ],
    editedIndex: -1,
    oldNuptk: "",
    editedItem: {
      nuptk: "",
      nama: "",
      nomor_telepon: "",
      email: "",
      password: "",
      type_user: "",
      mengajar: [],
    },
    defaultItem: {
      nuptk: "",
      nama: "",
      nomor_telepon: "",
      email: "",
      password: "",
      type_user: "",
      mengajar: [],
    },
    typeUserItems: ["Tata Usaha", "Kurikulum", "Guru"],
    isDuplicate: false,
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Tambah Data User" : "Ubah Data User";
    },
    mataPelajaranOne() {
      if (this.editedIndex === -1) {
        return this.mengajar.length > 1;
      } else {
        return this.editedItem.mengajar.length > 1;
      }
    },

    mataPelajaranGreaterThanTwo() {
      if (this.editedIndex === -1) {
        return this.mengajar.length < 2;
      } else {
        return this.editedItem.mengajar.length < 2;
      }
    },
    typeUserIsGuru() {
      return this.editedItem.type_user === "Guru";
    },
    ...mapState({
      mengajar: (state) => {
        return state.user.mengajar;
      },
      user: (state) => state.user.user,
      isLoading: (state) => state.user.isLoading,
      alert: (state) => state.alert,
    }),
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    mengajar(_, values) {
      this.duplicateCheck(values);
    },
  },
  mounted() {
    this.$store.dispatch("user/getAllUser");
  },
  methods: {
    checkInputDuplicate(attribute) {
      if (this.editedIndex !== -1) {
      let isDuplicate = this.user.some((item) => {
        if (attribute !== "email") {
          return Number(item[attribute]) == this.editedItem[attribute];
        } else {
          return item[attribute] == this.editedItem[attribute];
        }
      });

      this[`is_${attribute}_avail`] = isDuplicate
        ? `${attribute} sudah dipakai oleh user yang lain`
        : "";
      } else {
        let isDuplicate = this.user.some((item) => {
        if (attribute !== "email") {
          return Number(item[attribute]) == this.editedItem[attribute] && item.id_user !== this.editedItem.id_user;
        } else {
          return item[attribute] == this.editedItem[attribute] && item.id_user !== this.editedItem.id_user;;
        }
      });

      this[`is_${attribute}_avail`] = isDuplicate
        ? `${attribute} sudah dipakai oleh user yang lain`
        : "";
      }
    },

    duplicateCheck(values) {
      let valueArr = values.map(function(item) {
        return item.id_mata_pelajaran;
      });
      let isDuplicate = valueArr.some(function(item, idx) {
        return valueArr.indexOf(item) != idx;
      });
      this.isDuplicate = isDuplicate;
      return isDuplicate;
    },
    addMengajar() {
      if (this.editedIndex === -1) {
        this.$store.dispatch("user/addMengajar");
      } else {
        this.editedItem.mengajar.push({
          kode_mengajar: "",
          id_mata_pelajaran: 0,
        });
      }
    },
    removeMengajar() {
      if (this.editedIndex === -1) {
        this.$store.dispatch("user/removeMengajar");
      } else {
        this.editedItem.mengajar.pop();
      }
    },
    capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
    capitalizeFirstLetter(string) {
      return string
        .split("_")
        .map(this.capitalize)
        .join(" ");
    },

    editItem(item) {
      this.$store.dispatch("user/setMengajar", item.mengajar);
      this.editedIndex = this.user.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.oldNuptk = item.nuptk;
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.user.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      const id_user = this.editedItem.id_user;
      this.$store.dispatch("user/deleteUser", id_user);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.isNuptkAvail = "";
      this.isEmailAvail = "";
      this.$nextTick(() => {
        this.$store.dispatch("user/resetMengajar");
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
      if (!this.duplicateCheck(this.mengajar)) {
        let data = { oldNuptk: this.oldNuptk, ...this.editedItem };
        data.type_user = data.type_user
          .toLowerCase()
          .split(" ")
          .join("_");

        if (this.editedItem.type_user === "Guru") {
          data = { ...data, mengajar: this.mengajar };
        }

        if (this.editedIndex > -1) {
          const editedItem = this.user[this.editedIndex];
          console.log(editedItem);
          this.$store
            .dispatch("user/updateUser", data)
            .then(() => {
              console.log(data);
              data.type_user = this.capitalizeFirstLetter(data.type_user);
              Object.assign(editedItem, data);
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          this.$store
            .dispatch("user/createUser", data)
            .then((res) => {
              this.user.push(res.data.data);
            })
            .catch((err) => {
              console.log(err);
            });
        }
        this.close();
      }
    },
  },
};
</script>
