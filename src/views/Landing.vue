<template>
  <section ref="root">
    <v-row justify="space-between">
      <v-col>
        <v-btn @click="$refs.inpt.click()">load new image</v-btn>
        <v-progress-linear v-if="loading" indeterminate />
        <template v-else-if="image">
          <v-btn @click="download">Download this</v-btn>
          <ExifVisualizer v-if="exifObj" :exifObj="exifObj" />
        </template>
      </v-col>
      <v-col v-if="image" cols="12" md="3">
        <img :src="image" class="image" />
      </v-col>
    </v-row>

    <form ref="inputsForm">
      <input ref="inpt" type="file" :accept="camAccept" class="hidden" @change="processFile()" />
    </form>
  </section>
</template>

<script>
import ExifVisualizer from "../components/ExifVisualizer.vue";
import { PHOTOS_ALLOW_EXT } from "../utils/constants";
import piexif from "piexifjs";
export default {
  name: "landing",
  props: {},
  components: { ExifVisualizer },
  data: () => ({ image: false, camAccept: "." + PHOTOS_ALLOW_EXT.join(",."), resizeObserver: null, width: 0, exifObj: null, tags: piexif.TAGS, loading: false }),
  mounted() {
    this.resizeObserver = new ResizeObserver(entries => {
      this.width = entries[0].contentRect.width;
    });
    this.resizeObserver.observe(this.$refs.root);
  },
  methods: {
    processFile() {
      this.loading = true;
      let file = Array.from(this.$refs.inpt.files).shift();
      this.$store.state.exif.processFile(file).then(resp => {
        console.log(resp);
        this.image = resp.base64Str;
        this.exifObj = resp.exifObj;
        this.loading = false;
      });
    },
    download() {
      this.$store.state.exif.downloadModifiedImage(this.exifObj);
    }
  },
  computed: {}
};
</script>

<style scoped lang="scss">
.image {
  max-width: 100%;
  // max-height: 200px;
  // position: absolute;
  // top: 0;
  // right: 0;
}
</style>
