<template>
  <div class="pl-2 pt-2 langpicker">
    <v-tooltip v-model="langPickTooltip" right>
      <template v-slot:activator="{}">
        <div class="pointer" @click="langPickTooltip = !langPickTooltip">{{ flag }}</div>
      </template>
      <div v-for="loc in locales" :key="loc" class="pointer clickable tooltipLang" @click="langChange(loc)">{{ loc }}</div>
    </v-tooltip>
  </div>
</template>

<script>
import { LANG_KEY } from "../utils/constants";
export default {
  name: "lang-picker",
  props: {},
  data: () => ({ langPickTooltip: false, locales: ["lt", "ru", "en"] }),
  mounted() {},
  methods: {
    langChange(locale) {
      this.$root.$i18n.locale = locale;
      localStorage.setItem(LANG_KEY, locale);
      this.langPickTooltip = false;
    }
  },
  computed: {
    flag() {
      return this.$i18n.locale === "en" ? "en" : this.$i18n.locale;
    }
  }
};
</script>

<style scoped lang="scss">
.langpicker * {
  color: black;
  text-transform: uppercase;
}
.tooltipLang {
  margin: -4px 2px -8px 2px;
  color: #eee;
  text-transform: uppercase;
}
</style>
