<template>
  <div>
    <div class="gmapContainer">
      <GmapMap ref="mapRef" class="gmap" :center="centre" :zoom="zoom" :options="mapOptions" @dragstart="center(0)">
        <GmapMarker v-if="tracking" :position="myMarker.pos" :clickable="true" :draggable="false" :options="myMarker.options" @click="center(-1)" />
        <GmapCircle v-if="centered && !!activeMarkerIdx && tracking" :center="circleCenter" :radius="circleRadius" :options="circleOptions" />
        <GmapMarker :key="'users' + i" v-for="(m, i) in markers" :position="m.pos" :clickable="true" :draggable="false" :options="m.options" @click="center(i + 1)" />
      </GmapMap>
    </div>
    <div v-if="map">
      <div class="fixd t l ml-3 inline-children">
        <div>
          <h1 class="titleText">{{ $t("map.text.title") }}</h1>
        </div>
        <LangPicker />
      </div>
      <div class="fixd t r ma-2 inline-children">
        <div style="min-width:150px">
          <div class="my-2">
            <v-btn v-if="!$store.state.user.loggedIn" class="mw" small block @click="$refs.login.show()"
              >{{ $t("map.controls.login") }}<v-icon class="ma-2">mdi-login</v-icon>
            </v-btn>
            <v-btn v-else class="mw" small block @click="logout">{{ $t("map.controls.logout") }}<v-icon class="ma-2">mdi-logout</v-icon> </v-btn>
          </div>
          <div class="my-2">
            <v-btn class="mw" :disabled="!$store.state.user.loggedIn" small block @click="toggleTracking()">
              {{ $t("map.controls.track") }}<v-icon class="ma-2">{{ tracking ? "mdi-crosshairs-gps" : "mdi-crosshairs" }} </v-icon>
            </v-btn>
          </div>
          <div v-if="tracking && activeMarkerIdx !== -1" class="my-2">
            <v-btn class="mw" small block @click="center(-1)">{{ $t("map.controls.center") }}</v-btn>
          </div>
        </div>
      </div>
      <div class="fixd b r mb-3 mr-1">
        <v-btn class="my-1" x-small block @click="$router.push({ name: 'terms' })">{{ $t("map.legal.terms") }}</v-btn>
        <v-btn class="my-1" x-small block @click="$router.push({ name: 'policy' })">{{ $t("map.legal.privacy") }}</v-btn>
      </div>
      <div v-if="devMode && $store.state.user.loggedIn" class="dev fixd b l mb-3 ml-1">
        <div><span @click="zoom--">-</span>{{ zoom }}<span @click="zoom++">+</span></div>
        <v-btn class="my-1" x-small block @click="rpc.dev_startOther()">DEV:startDemoOther</v-btn>
        <v-btn class="my-1" x-small block @click="rpc.dev_stopOther()">DEV:stopDemoOther</v-btn>
      </div>
    </div>
    <LoginDialog v-if="!$store.state.user.loggedIn" ref="login" />
  </div>
</template>

<script>
import gmapStyle from "../utils/gmapStyles";
export default {
  name: "landing",
  props: {},
  components: {
    LangPicker: () => import(/* webpackChunkName: "com" */ "../components/LangPicker.vue"),
    LoginDialog: () => import(/* webpackChunkName: "com" */ "../components/LoginDialog.vue")
  },
  data: () => ({
    map: null,
    mapOptions: {
      mapTypeId: "roadmap",
      disableDefaultUI: true,
      styles: gmapStyle,
      backgroundColor: "black"
    },
    centre: { lat: 55.17, lng: 23.88 },
    zoom: 8,
    tracking: false,
    centered: true,
    activeMarkerIdx: 0,
    myMarker: {
      pos: { lat: 55.17, lng: 23.88 },
      speed: 0,
      accuracy: 1000,
      options: {
        label: {
          text: "\ue7fd",
          fontFamily: "Material Icons",
          color: "#ffffff"
          // fontSize: "18px"
        }
      }
    },
    markers: [],
    markerPullInterval: null,
    circleOptions: { fillOpacity: 0.1, strokeOpacity: 0.3 }
  }),
  mounted() {
    this.$refs.mapRef.$mapPromise.then(map => (this.map = map));
    this.$store.state.tracker.$on("newpos", this.newPosition);
  },
  methods: {
    toggleTracking() {
      this.tracking = !this.tracking;
      if (this.markerPullInterval) clearInterval(this.markerPullInterval);
      if (this.tracking) {
        this.$store.state.tracker.start();
        this.markerPullInterval = setInterval(
          () =>
            this.rpc.getOthersData().then(markers => {
              this.markers = markers;
              if (this.centered && markers.length && markers.length <= this.activeMarkerIdx) this.center(this.activeMarkerIdx);
            }),
          1000
        );
      } else this.$store.state.tracker.stop();
    },
    newPosition(evt) {
      this.myMarker.pos.lat = evt.coords.latitude;
      this.myMarker.pos.lng = evt.coords.longitude;
      this.myMarker.speed = evt.coords.speed || 0;
      this.myMarker.accuracy = evt.coords.accuracy;
      if (this.centered) this.center(this.activeMarkerIdx);
      this.rpc.addPoint(this.myMarker);
    },
    center(markerIdx) {
      this.activeMarkerIdx = markerIdx;
      if (markerIdx < 0) {
        this.centre.lat = this.myMarker.pos.lat;
        this.centre.lng = this.myMarker.pos.lng;
        this.updateZoom(this.myMarker.accuracy);
      } else if (markerIdx > 0) {
        this.centre.lat = this.markers[markerIdx - 1].pos.lat;
        this.centre.lng = this.markers[markerIdx - 1].pos.lng;
        this.updateZoom(this.markers[markerIdx - 1].accuracy);
      }
      this.centered = !!markerIdx;
    },
    updateZoom(accuracy) {
      if (accuracy < 50) this.zoom = 18;
      else if (accuracy < 150) this.zoom = 17;
      else if (accuracy < 500) this.zoom = 16;
      else if (accuracy < 1000) this.zoom = 15;
      else if (accuracy < 2000) this.zoom = 14;
      else this.zoom = 13;
    },
    logout() {
      this.rpc.exit();
      this.$store.state.user.loggedIn = false;
      if (this.tracking) this.toggleTracking();
    }
  },
  computed: {
    circleCenter() {
      if (!this.activeMarkerIdx) return { lat: 0, lng: 0 }; // when none "selected"
      if (this.activeMarkerIdx < 0) return this.myMarker.pos; // when centering on my own
      if (this.markers.length && this.markers.length <= this.activeMarkerIdx) return this.markers[this.activeMarkerIdx - 1].pos; // when can center on another ones
      return { lat: 0, lng: 0 };
    },
    circleRadius() {
      if (!this.activeMarkerIdx) return 1000; // when none "selected"
      if (this.activeMarkerIdx < 0) return this.myMarker.accuracy; // when centering on my own
      if (this.markers.length && this.markers.length <= this.activeMarkerIdx) return this.markers[this.activeMarkerIdx - 1].accuracy; // when can center on another ones
      return 1000;
    }
  }
};
</script>

<style scoped lang="scss">
.gmapContainer {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
}
.gmap {
  width: 100%;
  height: 100%;
}
.bg {
  background-color: rgba($color: white, $alpha: 0.5);
}
.inline-children > div {
  vertical-align: top;
  height: 64px;
}
.titleText {
  color: black;
  text-shadow: -1px -1px 0 #eee, 1px -1px 0 #eee, -1px 1px 0 #eee, 2px 2px 0 #eee;
}
</style>
