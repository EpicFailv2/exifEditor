<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" max-width="300px">
      <v-form ref="form" v-model="valid">
        <v-card>
          <v-card-text>
            <h3>{{ $t("login.title") }}</h3>
            <v-text-field v-model="user.username" :label="$t('login.username')" :rules="[rules.required]" />
            <v-text-field v-model="user.uuid" :label="$t('login.uuid')" :rules="[rules.required]" />
            <v-btn small block @click="login"> {{ $t("login.login") }} </v-btn>
          </v-card-text>
        </v-card>
      </v-form>
    </v-dialog>
  </v-row>
</template>

<script>
import { UUID } from "../utils/constants";
import { required } from "../utils/validators.js";
export default {
  name: "login-dialog",
  props: {},
  components: {},
  mixins: [],
  data: () => ({
    dialog: false,
    valid: false,
    user: {
      username: null,
      uuid: localStorage.getItem(UUID)
    },
    rules: { required }
  }),
  mounted() {
    if (this.devMode) this.user.username = "devui";
  },
  methods: {
    show() {
      this.dialog = true;
    },
    login() {
      this.$refs.form.validate();
      if (this.valid) this.$store.state.rpc.init(this.user.uuid, this.user.username).then(() => (this.dialog = false));
    }
  },
  computed: {}
};
</script>

<style scoped lang="scss"></style>
