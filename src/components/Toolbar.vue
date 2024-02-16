<template>
  <v-app-bar app class="toolbar" :height="70">
    <h1 class="d-block d-sm-none">{{ $t("app.titleShort") }}</h1>
    <h1 class="d-none d-sm-block">{{ $t("app.title") }}</h1>
    <v-btn v-for="route in routes" :key="route" text @click="$router.push({ name: route })">{{ $t("nav." + route) }}</v-btn>
    <v-spacer />
    <v-row class="noGrow langSelect">
      <v-col cols="auto" @click="$i18n.locale = 'lt'">
        <h3 :class="{ selected: $i18n.locale === 'lt' }">LT</h3>
      </v-col>
      <v-col cols="auto" @click="$i18n.locale = 'en'">
        <h3 :class="{ selected: $i18n.locale === 'en' }">EN</h3>
      </v-col>
    </v-row>
  </v-app-bar>
</template>

<script>
import { ROUTE_NAMES } from "../router";

export default {
  name: "toolbar",
  data: () => ({ routes: ROUTE_NAMES }),
  components: {},
  mounted() {},
  computed: {}
};
</script>

<style scoped lang="scss">
@media screen and (min-width: 600px) {
  .toolbar {
    button {
      margin-left: 16px;
    }
  }
}

.langSelect {
  gap: 8px;
  margin-right: 16px;
  .col {
    padding: 0;
    cursor: pointer;
    h3 {
      pointer-events: none;
    }
  }

  color: #666;
  .selected {
    color: #aaa;
  }
}
</style>
