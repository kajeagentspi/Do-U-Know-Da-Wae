<template>
  <div>
    <q-page-sticky position="top-right" :offset="[18, 18]" class="front">
      <q-btn
        round
        color="primary"
        :disable="!GPSAvailable"
        :icon="
          GPSAvailable
            ? GPSTracking
              ? 'gps_fixed'
              : 'gps_off'
            : 'gps_not_fixed'
        "
        @click="toggleTracking"
      />
    </q-page-sticky>
    <div id="map"></div>
    <div :class="drawing ? 'full' : viewing ? 'viewing' : 'search'" ref="visibleMap"></div>
  </div>
</template>

<script>
import L from "leaflet";
import { mapActions, mapMutations } from "vuex";
import { mapFields } from "vuex-map-fields";
import { CHANGE_VIEW } from "../../store/types";
// import * as Api from "../../api";

export default {
  name: "Map",
  computed: {
    ...mapFields("map", [
      "mapInstance",
      "userMarker",
      "mapTop",
      "mapLeft",
      "mapRight",
      "mapBottom",
      "GPSAvailable",
      "GPSTracking",
      "marker",
      "polygon",
      "drawing",
      "viewing"
    ])
  },
  methods: {
    ...mapActions("map", ["initializeMap", "identifyBuilding"]),
    ...mapMutations("map", {
      changeView: CHANGE_VIEW
    }),
    toggleTracking() {
      this.GPSTracking = !this.GPSTracking;
      if (this.GPSTracking) {
        this.changeView({ coordinates: [this.userMarker.getLatLng()] });
      }
    },
    draw({ layer }) {
      this.drawing = false;
      if (layer instanceof L.Marker) {
        layer.dragging.disable();
        this.marker = layer;
      } else if (layer instanceof L.Polyline) {
        this.polygon = layer;
      }
    },
    located({ latlng }) {
      this.GPSAvailable = true;
      if (this.GPSTracking) {
        this.changeView({ coordinates: [latlng] });
      }
      if (this.userMarker) {
        this.userMarker.setLatLng(latlng);
      } else {
        const userIcon = L.divIcon({
          html: '<i class="fa fa-circle" style="color: green"></i>',
          iconSize: [20, 20],
          className: "icon"
        });
        this.userMarker = new L.Marker(latlng, { icon: userIcon }).addTo(
          this.mapInstance
        );
      }
    },
    onLocationError() {
      this.GPSTracking = false;
      this.GPSAvailable = false;
      this.$q.notify({
        message: "I'm sorry but I can't find you. GPS Search would be disabled",
        color: "negative",
        position: "top"
      });
    }
  },
  async mounted() {
    const {
      top,
      left,
      bottom,
      right
    } = this.$refs.visibleMap.getBoundingClientRect();
    this.mapTop = top;
    this.mapLeft = left;
    this.mapRight = right;
    this.mapBottom = bottom;
    this.initializeMap();
    this.mapInstance.on("locationfound", this.located);
    this.mapInstance.on("locationerror", this.onLocationError);
    this.mapInstance.on("editable:drawing:end", this.draw);
    // const { data } = await Api.allStop();
    // console.log(data);
    // data.forEach(stop => {
    //   const { lat, lng } = stop;
    //   new L.Marker({ lat, lng }, { color: "red" })
    //     .addTo(this.mapInstance)
    //     .on("click", () => {
    //       console.log(stop);
    //     });
    // });
  },
  watch: {
    "$q.screen.width"() {
      const {
        top,
        left,
        bottom,
        right
      } = this.$refs.visibleMap.getBoundingClientRect();
      this.mapTop = top;
      this.mapLeft = left;
      this.mapRight = right;
      this.mapBottom = bottom;
    },
    "$q.screen.height"() {
      const {
        top,
        left,
        bottom,
        right
      } = this.$refs.visibleMap.getBoundingClientRect();
      this.mapTop = top;
      this.mapLeft = left;
      this.mapRight = right;
      this.mapBottom = bottom;
    }
  }
};
</script>

<style lang="scss" scoped>
#map {
  top: 0px;
  left: 0px;
  right: 0px;
  height: 100%;
  position: absolute;
  z-index: 0;
}
@media (min-width: 641px) {
  .search,
  .viewing {
    top: 0px;
    left: calc(360px + 1vw);
    right: 0px;
    height: 100%;
    position: absolute;
    z-index: 10;
    pointer-events: none;
  }
  .full {
    top: 0px;
    left: 0px;
    right: 0px;
    height: 100%;
    position: absolute;
    z-index: 10;
    pointer-events: none;
  }
}
@media (max-width: 640px) {
  .search,
  .viewing {
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: calc(60%);
    position: absolute;
    z-index: 10;

    pointer-events: none;
  }
  .full {
    top: 0px;
    left: 0px;
    right: 0px;
    height: 100%;
    position: absolute;
    z-index: 10;
    pointer-events: none;
  }
}
.front {
  z-index: 10;
}
</style>
