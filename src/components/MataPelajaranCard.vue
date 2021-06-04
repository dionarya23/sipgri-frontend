<template>
  <div class="text-left" style="margin-top:5%;align-items:bottom!important">
    <p style="font-weight:bold">
      Mata Pelajaran {{ index+1 }} Yang Diampu</p>
    <v-text-field
      type="text"
      v-model="guruMengajar.kode_mengajar"
      label="Kode Mengajar"
      :rules="rules"
      @change="pushToMengajar"
    ></v-text-field>
    <v-select
      item-text="mata_pelajaran"
      item-value="id_mata_pelajaran"
      label="Mata Pelajaran"
      :items="listMataPelajaran"
      v-model="guruMengajar.id_mata_pelajaran"
    ></v-select>
  </div>
</template>

<script>
export default {
  name: "MataPelajaranCard",
  data: () =>  ({
      guruMengajar : {},
      listMataPelajaran: [
      {
         id_mata_pelajaran: 1,
         mata_pelajaran: "Bahasa Indonesia",
      },
      {
         id_mata_pelajaran: 2,
         mata_pelajaran: "Bahasa Inggris",
      },
      {
         id_mata_pelajaran: 3,
         mata_pelajaran: "Bahasa Sunda",
      },
    ],
  }),
  props: {
      index: Number,
      mengajar: Object,
      rules: Array
  },
  methods: {
      init() { 
        this.guruMengajar = this.mengajar
      },
      pushToMengajar() {
        this.$store.dispatch("user/updateMengajar", {index : this.index, mengajar: this.guruMengajar})
      }
    },
    watch : {
        propId: function(new_value) { 
          this.init()
      }
    },
};
</script>
