<template>
  <section ref="root">
    <v-row justify="space-between">
      <v-col>
        <v-row align="center">
          <v-col v-if="loading" cols="12"><v-progress-linear indeterminate /></v-col>
          <v-col v-else-if="!image">
            <v-btn block @click="$refs.inpt.click()">{{ $t("single.load") }}</v-btn>
          </v-col>
          <template v-else-if="image">
            <v-col cols="12" sm="4">
              <v-btn block @click="$refs.inpt.click()">{{ $t("single.loadNew") }}</v-btn>
            </v-col>
            <v-col cols="6" sm="4">
              <v-text-field v-model="filename" :label="$t('single.filename')" clearable></v-text-field>
            </v-col>
            <v-col cols="6" sm="4">
              <v-btn block @click="download">{{ $t("single.download") }}</v-btn>
            </v-col>
            <v-col cols="12">
              <ExifVisualizer v-if="exifObj" :exifObj="exifObj" />
            </v-col>
          </template>
        </v-row>
      </v-col>
      <v-col v-if="image" cols="12" md="3">
        <img :src="image" class="image" />
      </v-col>
    </v-row>

    <form ref="inputsForm">
      <input ref="inpt" type="file" :accept="camAccept" class="hidden" @change="processFile()" />
    </form>

    <v-btn v-if="scrolled" fab small class="scrollToTopFAB" @click="scrollToTop"><v-icon>mdi-chevron-up</v-icon></v-btn>
  </section>
</template>

<script>
import ExifVisualizer from "../components/ExifVisualizer.vue";
import { scrollToTop } from "../utils/commonFunctions";
import { PHOTOS_ALLOW_EXT } from "../utils/constants";
import piexif from "piexifjs";
export default {
  name: "single",
  props: {},
  components: { ExifVisualizer },
  data: () => ({
    resizeObserver: null,
    width: 0,
    loading: false,
    camAccept: "." + PHOTOS_ALLOW_EXT.join(",."),
    tags: piexif.TAGS,
    image: false,
    filename: null,
    exifObj: null,
    scrolled: false
  }),
  mounted() {
    this.resizeObserver = new ResizeObserver(entries => {
      this.width = entries[0].contentRect.width;
    });
    this.resizeObserver.observe(this.$refs.root);
    window.addEventListener("scroll", this.scrollEvent);
  },
  methods: {
    processFile() {
      this.loading = true;
      let file = Array.from(this.$refs.inpt.files).shift();
      this.filename = file.name;
      this.$store.state.exif.processFile(file).then(resp => {
        this.image = resp.base64Str;
        this.exifObj = resp.exifObj;
        this.loading = false;
      });
    },
    download() {
      this.$store.state.exif.downloadModifiedImage(this.exifObj, this.filename);
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

<style scoped lang="scss">
.image {
  max-width: 100%;
}
</style>
