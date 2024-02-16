<template>
  <v-app>
    <Toolbar />
    <v-container>
      <v-main v-if="ready">
        <router-view />
      </v-main>
      <div v-else></div>
    </v-container>
    <ExifHandler />
  </v-app>
</template>

<script>
import Toolbar from "./components/Toolbar.vue";
import ExifHandler from "./handlers/ExifHandler.vue";
export default {
  name: "App",
  data: () => ({}),
  components: { ExifHandler, Toolbar },
  mounted() {
    document.title = this.$t("app.title");
  },
  computed: {
    ready() {
      return !!this.$store.state.exif;
    }
  },
  beforeDestroy() {}
};
</script>

<style lang="scss">
@import "@/scss/global.scss";
</style>
