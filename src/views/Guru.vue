<template>
  <div class="guru">
    <v-data-table
      :headers="headers"
      :items="guru"
      sort-by="name"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                Tambah Data Guru
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-text-field
                    v-model="editedItem.nip"
                    label="NIP"
                  ></v-text-field>

                  <v-text-field
                    v-model="editedItem.nama"
                    label="Nama"
                  ></v-text-field>

                  <v-text-field
                    v-model="editedItem.nomor_telepon"
                    label="No. Telepon"
                  ></v-text-field>

                  <v-text-field
                    v-model="editedItem.email"
                    label="Email"
                  ></v-text-field>

                  <v-text-field
                    v-model="editedItem.type"
                    label="Type"
                  ></v-text-field>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Cancel
                </v-btn>
                <v-btn color="blue darken-1" text @click="save">
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="headline"
                >Are you sure you want to delete this item?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >Cancel</v-btn
                >
                <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                  >OK</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
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
        <v-btn color="primary" @click="initialize">
          Reset
        </v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: "NIP",
        align: "start",
        value: "nip"
      },
      { text: "Nama", value: "nama" },
      { text: "No. Telepon", value: "nomor_telepon", sortable: false },
      { text: "Email", value: "email" },
      { text: "Type", value: "type" },
      { text: "Actions", value: "actions", sortable: false }
    ],
    guru: [],
    editedIndex: -1,
    editedItem: {
      nip: "",
      nama: "",
      nomor_telepon: "",
      email: "",
      type: ""
    },
    defaultItem: {
      nip: "",
      nama: "",
      nomor_telepon: "",
      email: "",
      type: ""
    }
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Tambah Data Guru" : "Ubah Data Guru";
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    }
  },

  created() {
    this.initialize();
  },

  mounted() {
    this.$store.dispatch("guru/getAllGuru");
  },

  methods: {
    initialize() {
      this.guru = [
        {
          nip: "10291292837821",
          nama: "Dion Arya Pamungkas",
          nomor_telepon: "083283728312",
          email: "dionarya.p@gmail.com",
          type: "admin"
        }
      ];
    },

    editItem(item) {
      this.editedIndex = this.guru.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.guru.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.guru.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
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
        Object.assign(this.guru[this.editedIndex], this.editedItem);
      } else {
        this.guru.push(this.editedItem);
      }
      this.close();
    }
  }
};
</script>
