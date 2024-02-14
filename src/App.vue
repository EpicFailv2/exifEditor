<template>
  <v-app>
    <v-container>
      <v-main v-if="$store.state.rpc && $store.state.tracker">
        <router-view />
      </v-main>
      <div v-else>
        Loading...
      </div>
    </v-container>
    <RPCHandler v-if="loadRealBackend" />
    <RPCHandlerEmu v-if="!loadRealBackend" />
    <TrackingHandler />
  </v-app>
</template>

<script>
import { ROUTE_LANDING } from "./utils/constants";
export default {
  name: "App",
  data: () => ({}),
  components: {
    RPCHandler: () => import(/* webpackChunkName: "handlers" */ "@/handlers/RPCHandler"),
    RPCHandlerEmu: () => import(/* webpackChunkName: "handlers" */ "@/handlers/RPCHandlerEmu"),
    TrackingHandler: () => import(/* webpackChunkName: "handlers" */ "@/handlers/TrackingHandler")
  },
  mounted() {
    document.title = this.$t("title");
  },
  computed: {
    appClass() {
      return this.$route.name === ROUTE_LANDING ? "clickthrough" : "";
    },
    loadRealBackend() {
      return this.$store.state.backendAccessible;
    }
  },
  beforeDestroy() {
    if (this.$store.state.user.loggedIn) this.$store.state.rpc.exit();
  }
};
</script>

<style lang="scss">
@import "@/scss/global.scss";
</style>
