<template>
  <div class="text-left" style="margin-top:5%;align-items:bottom!important">
    <p style="font-weight:bold">Mata Pelajaran {{ index + 1 }} Yang Diampu</p>
    <v-text-field
      type="text"
      v-model="guruMengajar.kode_mengajar"
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
      v-model="guruMengajar.id_mata_pelajaran"
      @change="pushToMengajar"
    ></v-autocomplete>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "MataPelajaranCard",
  data: () => ({
    guruMengajar: {}
  }),
  props: {
    index: Number,
    mengajar: Object,
    rules: Array
  },
  methods: {
    init() {
      this.guruMengajar = this.mengajar;
    },
    pushToMengajar() {
      this.$store.dispatch("user/updateMengajar", {
        index: this.index,
        mengajar: this.guruMengajar
      });
    }
  },
  mounted() {
    this.$store.dispatch("getAllMataPelajaran");
  },
  computed: mapState({
    listMataPelajaran: (state) => state.matapelajaran.mataPelajaran
  }),
  watch: {
    propId: function(new_value) {
      this.init();
    }
  }
};
</script>
