<template>
  <div class="detail-nilai-eskul">
      
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  data: () => ({

  }),
  computed: {
      ...mapState({
          anak_wali: (state) => state.nilaiEskul.anakWali.kelas_siswa,
          raport: (state) => state.absensi.raport,
      })
  },
  mounted() {
    this.$store.dispatch("nilaiEskul/getAnakWali", this.$route.params.id_raport);
    this.$store.dispatch("absensi/getRaport", this.$route.params.id_raport);
  },
  methods: {
    save() {

    },

    close(){
      
    }
  },
};
</script>
