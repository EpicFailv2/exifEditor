<template>
  <section></section>
</template>

<script>
import piexif from "piexifjs";
import { getBase64String, jsonClone, makeNumberType } from "../utils/commonFunctions";
const TYPE_MAP = { Ascii: "string", Long: "number", Short: "number", Rational: "number", Byte: "string", Undefined: "string", SRational: "number", Float: "number" };
export default {
  name: "exif-handler",
  props: {},
  components: {},
  data: () => ({ latestImage: null, latestFilename: null, tags: piexif.TAGS }),
  mounted() {
    this.$store.state.exif = this;
  },
  methods: {
    /**
     * For pulling EXIF and ImageDataURL
     * @param {File} file file from input
     * @returns {Promise<Object>} array of structure: {base64str, exifObj, error}
     */
    processFile(file) {
      if (!file)
        return Promise.resolve(() => {
          return "no_file";
        });
      // let file = Array.from(this.$refs.inpt.files).shift();
      return getBase64String(file)
        .then(base64Str => {
          this.latestImage = base64Str;
          this.latestFilename = file.name;
          let exifObj = piexif.load(base64Str);
          return { base64Str, exifObj };
        })
        .catch(err => {
          console.error("EXIF pull error", err);
          return { err };
        });
    },

    /**
     * To store EXIF object into DataURL
     * @param {Object} exifObj exif object pulled with piexifjs
     * @param {String} imageDataURL image data URL to push exif into
     * @returns {String} imageDataURL with modified EXIF
     */
    storeExif(exifObj, imageDataURL) {
      return piexif.insert(piexif.dump(exifObj), piexif.remove(imageDataURL || this.latestImage));
    },

    /**
     * Update EXIF and download image
     * @param {Object} exifObj required
     * @param {String} filename optional - will take name of latest loaded image
     * @param {String} imageBase64 optional - will take latest loaded image
     */
    downloadModifiedImage(exifObj, filename, imageBase64) {
      if (!exifObj) return;
      this.downloadImage(filename || "mod_" + this.latestFilename, this.storeExif(this.retype(exifObj), imageBase64));
    },

    /**
     * Download original image... for whatever reason
     * @param {String} filename optional - will take name of latest loaded image
     * @param {String} imageBase64 optional - will take latest loaded image
     */
    downloadImage(filename, imageBase64) {
      if (!window.dlLink) {
        window.dlLink = document.createElement("a");
        window.dlLink.setAttribute("crossorigin", "anonymous");
        window.dlLink.style.display = "none";
        document.body.appendChild(window.dlLink);
      }
      window.dlLink.href = imageBase64 || this.latestImage;
      window.dlLink.download = filename || this.latestFilename;
      window.dlLink.click();
    },

    /**
     * Convert any exifObject to ketmap
     * @param {Object} obj exif object
     */
    exifObjToKeys(obj) {
      return Object.keys(obj)
        .filter(groupKey => !["thumbnail", "Interop"].includes(groupKey))
        .map(groupKey => ({
          key: groupKey,
          keys: Object.keys(obj[groupKey]).map(valKey => ({
            key: valKey,
            ...this.tags[groupKey][valKey],
            inputType: TYPE_MAP[this.tags[groupKey][valKey].type]
          }))
        }));
    },

    /**
     * Inputs make values into strings so retype numbers to numbers before packing
     * @param {Object} obj exif object
     */
    retype(exifObj) {
      if (!exifObj) throw "Must provide exifObj";
      let rez = jsonClone(exifObj);
      this.tagsLikeKeys.forEach(group => {
        if (rez[group.key]) {
          group.keys.forEach(key => {
            if (key.inputType === "number" && typeof rez[group.key][key.key] !== "number") rez[group.key][key.key] = makeNumberType(rez[group.key][key.key]);
          });
        }
      });
      return rez;
    }
  },
  computed: {
    tagsLikeKeys() {
      return this.exifObjToKeys(this.tags).sort((a, b) => a.key.localeCompare(b.key));
    }
  }
};
</script>
