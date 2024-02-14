import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./vuetify";
import { i18n } from "./i18n";

Vue.config.productionTip = false;

Vue.mixin({
  data: () => ({
    devMode: window.location.host.includes("localhost")
  }),
  methods: {},
  computed: {
    rpc() {
      return this.$store.state.rpc;
    }
  }
});

window.vue = new Vue({
  router,
  i18n,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
