<template>
  <section></section>
</template>

<script>
import piexif from "piexifjs";
import { getBase64String } from "../utils/commonFunctions";
export default {
  name: "exif-handler",
  props: {},
  components: {},
  data: () => ({ latestImage: null, latestFilename: null }),
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

          console.log("piexif", piexif);

          // let zeroth = exifObj["0th"];
          // zeroth[piexif.ImageIFD.Make] = "EID platform with Piexifjs";
          // zeroth[piexif.ImageIFD.Software] = "v!!!";
          // zeroth[piexif.ImageIFD.ImageWidth] = 11;
          // zeroth[piexif.ImageIFD.ImageLength] = 11;
          // zeroth[piexif.ImageIFD.Compression] = 6; // not JPG compression level, but just indication of JPG in general
          // exifObj.Exif[piexif.ExifIFD.DateTimeOriginal] = moment().format(DATETIME_FORMAT); // image/exif generation time
          // let gh = this.$store.state.gps; // Gps Handler
          // if (gh && gh.locationWatcher && gh.coordTime && gh.coordinates) {
          //   exifObj.GPS[piexif.GPSIFD.GPSLatitudeRef] = "N";
          //   exifObj.GPS[piexif.GPSIFD.GPSLatitude] = piexif.GPSHelper.degToDmsRational(25.25);
          //   exifObj.GPS[piexif.GPSIFD.GPSLongitudeRef] = "E";
          //   exifObj.GPS[piexif.GPSIFD.GPSLongitude] = piexif.GPSHelper.degToDmsRational(25.66);
          //   exifObj.GPS[piexif.GPSIFD.GPSDateStamp] = gh.coordTime.format(DATETIME_FORMAT);
          // }

          // // download:
          // this.latestImage = piexif.insert(piexif.dump(exifObj), piexif.remove(this.latestImage));

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
      this.downloadImage(filename || "mod_" + this.latestFilename, this.storeExif(exifObj, imageBase64));
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
    }
  },
  computed: {}
};
</script>
