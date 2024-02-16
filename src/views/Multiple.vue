<template>
  <section ref="root">
    <v-row align="center">
      <v-col :cols="!images.length ? 12 : 'auto'">
        <v-btn :block="!images.length" @click="$refs.inpt.click()">{{ images.length ? $t("multiple.loadAdd") : $t("multiple.load") }}</v-btn>
      </v-col>
      <template v-if="images.length">
        <v-col>
          <v-text-field v-model="prepend" :label="$t('multiple.prepend')"></v-text-field>
        </v-col>
        <v-col cols="auto">
          <v-btn @click="download()">{{ $t("multiple.download") }}</v-btn>
        </v-col>
        <v-col cols="auto">
          <v-btn @click="reset">{{ $t("multiple.reset") }}</v-btn>
        </v-col>
      </template>
    </v-row>

    <v-row v-show="images.length">
      <v-col cols="12" class="header">
        <h3>{{ $t("multiple.actionsHeader") }}</h3>
        <p>{{ $t("multiple.actionsSubheader") }}</p>
      </v-col>
      <v-col cols="12">
        <ExifActions ref="actions" :images="images" />
      </v-col>
    </v-row>

    <v-row v-show="images.length">
      <v-col cols="12" class="header">
        <h3>{{ $t("multiple.imagesHeader") }}</h3>
        <p>{{ $t("multiple.imagesSubheader") }}</p>
      </v-col>
      <v-col v-for="image in images" :key="image.id" cols="6" md="4">
        <img :src="image.base64Str" class="image" />
        <v-text-field v-model="image.filename" :prefix="prepend"></v-text-field>
      </v-col>
    </v-row>

    <form ref="inputsForm">
      <input ref="inpt" type="file" :accept="camAccept" multiple class="hidden" @change="processFile()" />
    </form>

    <v-btn v-if="scrolled" fab small class="scrollToTopFAB" @click="scrollToTop"><v-icon>mdi-chevron-up</v-icon></v-btn>
  </section>
</template>

<script>
import Vue from "vue";
import piexif from "piexifjs";
import { rId, scrollToTop } from "../utils/commonFunctions";
import { PHOTOS_ALLOW_EXT } from "../utils/constants";
import ExifActions from "../components/ExifActions.vue";
export default {
  name: "single",
  props: {},
  components: { ExifActions },
  data: () => ({ camAccept: "." + PHOTOS_ALLOW_EXT.join(",."), exifObj: null, tags: piexif.TAGS, loading: 0, images: [], scrolled: false, prepend: null }),
  mounted() {
    window.addEventListener("scroll", this.scrollEvent);
  },
  methods: {
    reset() {
      this.images = [];
      this.$refs.actions.reset();
    },
    processFile() {
      this.loading = 0;
      Array.from(this.$refs.inpt.files).forEach(file => {
        this.loading++;
        this.$store.state.exif.processFile(file).then(resp => {
          this.images.push({ id: rId(), base64Str: resp.base64Str, exifObj: resp.exifObj, filename: file.name });
          this.loading--;
        });
      });
    },
    download() {
      this.images.forEach(image => {
        let actions = this.$refs.actions.actions;
        let allOk = true;
        actions.forEach(action => {
          if (action.group && action.key && action.key.value) {
            if (action.type === "add" && (!image.exifObj[action.group] || !image.exifObj[action.group][action.key.value])) {
              if (!image.exifObj[action.group]) Vue.set(image.exifObj, action.group, {});
              image.exifObj[action.group][action.key.value] = action.value;
              Vue.set(image.exifObj[action.group], action.key.value, action.value);
            } else if (action.type === "replace" && image.exifObj[action.group] && image.exifObj[action.group][action.key.value])
              image.exifObj[action.group][action.key.value] = action.value;
            else if (action.type === "remove" && image.exifObj[action.group] && image.exifObj[action.group][action.key.value])
              Vue.delete(image.exifObj[action.group], action.key.value);
          } else {
            console.error("unfinished action", action);
            allOk = false;
          }
        });
        if (allOk) this.$store.state.exif.downloadModifiedImage(image.exifObj, (this.prepend || "") + image.filename, image.base64Str);
      });
    },
    scrollEvent() {
      this.scrolled = window.scrollY > 0;
    },
    scrollToTop() {
      scrollToTop();
    }
  },
  computed: {},
  beforeDestroy() {
    window.removeEventListener("scroll", this.scrollEvent);
  }
};
</script>

<style lang="scss">
.image {
  max-width: 100%;
}
.v-text-field__prefix {
  padding: 0 !important;
}
.header {
  p {
    color: #888;
    font-size: 12px;
    margin: 0 0 0 16px !important;
  }
}
</style>
