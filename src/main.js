import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./vuetify";
import * as VueGoogleMaps from "vue2-google-maps";
import { i18n } from "./i18n";
import { Entropy } from "entropy-string";
import { UUID } from "./utils/constants";

Vue.config.productionTip = false;

Vue.use(VueGoogleMaps, { load: { key: "AIzaSyDCZ79EUbHOzrvhq43-7GveIlUPMRpQQeo" } });

Vue.mixin({
  data: () => ({
    devMode: window.location.host.includes("localhost")
  }),
  methods: {},
  computed: {
    rpc() { return this.$store.state.rpc; }
  }
});

if (!localStorage.getItem(UUID)) localStorage.setItem(UUID, "id" + new Entropy({ total: 1e8, risk: 1e8 }).string());

window.vue = new Vue({
  router,
  i18n,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
