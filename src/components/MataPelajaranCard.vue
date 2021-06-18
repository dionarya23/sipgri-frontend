<template>
  <div class="text-left" style="margin-top:5%;align-items:bottom!important">
    <p style="font-weight:bold">Mata Pelajaran {{ index + 1 }} Yang Diampu</p>
    <v-text-field
      type="text"
      v-model="mengajar.kode_mengajar"
      label="Kode Mengajar"
      :rules="rules"
      @change="pushToMengajar"
    ></v-text-field>
    <v-autocomplete
      item-text="mata_pelajaran"
      item-value="id_mata_pelajaran"
      label="Mata Pelajaran"
      return-object
      :items="listMataPelajaran"
      v-model="mengajar.id_mata_pelajaran"
      @change="pushToMengajar"
    ></v-autocomplete>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "MataPelajaranCard",
  data: () => ({
    guruMengajar: {
      id_mata_pelajaran: 0,
      kode_mengajar: ""
    }
  }),
  props: {
    index: Number,
    mengajar: Object,
    rules: Array,
    currentMengajar: Object
  },
  methods: {
    init() {
      this.guruMengajar = this.mengajar;
    },
    pushToMengajar() {
      let mengajar = { ...this.mengajar };
      // console.log("push To Mengajar : ", mengajar);
      mengajar.id_mata_pelajaran = this.mengajar.id_mata_pelajaran?.id_mata_pelajaran;
      console.log(mengajar);
      this.$store.dispatch("user/updateMengajar", {
        index: this.index,
        mengajar
      });
    }
  },
  mounted() {
    this.$store.dispatch("matapelajaran/getAllMataPelajaran");
  },
  computed: {
    ...mapState({
      listMataPelajaran: (state) => state.matapelajaran.mataPelajaran
    })
  },
  watch: {
    propId: function(new_value) {
      this.init();
    }
  }
};
</script>
