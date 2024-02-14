import { UUID } from "../../utils/constants";
import { mapMapDataDTOToMarker, mapMarkerToPointDataDTO } from "../../utils/mappers";

export default {
  data: () => ({}),
  mounted() { },
  methods: {

    // ------ entry/exit points ----------------------------------------------------
    init(uuid, username) {
      return fetch(this.endpoint("/md/init"), this.genPostParams({ uuid, username }))
        .then(resp => resp.json())
        .then(resp => {
          this.$store.state.user.loggedIn = resp;
          this.$store.state.user.username = username;
          if (!resp) return Promise.reject();
          localStorage.setItem(UUID, uuid);
        });
    },
    exit() {
      return fetch(this.endpoint("/md/exit"), this.genPostParams({ uuid: localStorage.getItem(UUID), username: "doesNotMatter" }));
    },

    // ------ data accessors/senders ------------------------------------------------
    addPoint(marker) {
      return fetch(this.endpoint("/md/addDataPoint", { id: localStorage.getItem(UUID) }), this.genPostParams(mapMarkerToPointDataDTO(marker)));
    },
    addPublicPoint(marker) {
      return fetch(this.endpoint("/md/addDataPoint/public", { id: localStorage.getItem(UUID) }), this.genPostParams(mapMarkerToPointDataDTO(marker)));
    },

    getMyData() {
      return fetch(this.endpoint("/md/getData", { id: localStorage.getItem(UUID) }), this.genPostParams());
    },
    getOthersData() {
      return fetch(this.endpoint("/md/getData"), this.genPostParams()).then(resp => resp.json()).then(rez => {
        return rez.filter(m => m.username !== this.$store.state.user.username).map(m => mapMapDataDTOToMarker(m));
      }).catch(err => console.error('RPC.getOthersData:', err));
    },
    getOthersPublicData() {
      return fetch(this.endpoint("/md/getData/public"), this.genPostParams()).then(resp => resp.json()).then(rez => {
        return rez.filter(m => m.username !== localStorage.getItem(UUID)).map(m => mapMapDataDTOToMarker(m));
      }).catch(err => console.error('RPC.getOthersPublicData:', err));
    },

    // ------ DEV --------------------------------------------------------------------
    dev_startOther() {
      return fetch(this.endpoint("/dev/demoUser/start"), this.genGetParams());
    },
    dev_stopOther() {
      return fetch(this.endpoint("/dev/demoUser/stop"), this.genGetParams());
    },

  }
};
