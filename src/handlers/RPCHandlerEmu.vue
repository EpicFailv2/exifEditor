<template>
  <section></section>
</template>

<script>
import CommonMixin from "./mixins/CommonMixin";
import HelperMixin from "./mixins/HelperMixin";
export default {
  name: "rpc-handler",
  props: {},
  components: {},
  mixins: [CommonMixin, HelperMixin],
  data: () => ({}),
  mounted() {
    this.$store.state.rpc = this;
  },
  methods: {},
  computed: {}
};
</script>

<style scoped lang="scss">
</style>
