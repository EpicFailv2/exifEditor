<template>
  <section></section>
</template>

<script>
export default {
  name: "tracking-handler",
  props: {},
  components: {},
  data: () => ({
    options: {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    },
    locationWatcher: null,
    position: null,
    gpsError: false
  }),
  mounted() {
    this.$store.state.tracker = this;
  },
  methods: {
    get() {
      console.log("TrackingHandler/get");
      if (this.gpsError) return false;
      navigator.geolocation.getCurrentPosition(this.catchNewPos, this.geolocationError, this.options);
      return true;
    },
    start() {
      console.log("TrackingHandler/start");
      this.gpsError = false;
      this.locationWatcher = navigator.geolocation.watchPosition(this.catchNewPos, this.geolocationError, this.options);
    },
    stop() {
      console.log("TrackingHandler/stop");
      navigator.geolocation.clearWatch(this.locationWatcher);
    },
    catchNewPos(pos) {
      // console.log("TrackingHandler/catchNewPos - pos:", pos);
      this.position = pos;
      this.$emit("newpos", pos);
    },
    geolocationError(err) {
      console.log("TrackingHandler/geolocationError", err);
      if (err.code !== 3) {
        this.gpsError = true;
        this.$emit("gpsError", err.code);
        if (this.locationWatcher) navigator.geolocation.clearWatch(this.locationWatcher);
      }
    }
  },
  computed: {},
  beforeDestroy() {
    this.stop();
  }
};
</script>

<style scoped lang="scss"></style>
