<template>
  <div>
    <q-page-sticky position="top-right" :offset="[18, 18]" class="front">
      <q-btn
        round
        color="primary"
        :disable="!GPSEnabled"
        :icon="GPSEnabled ? 'gps_fixed' : 'gps_not_fixed'"
        @click="locateUser"
      />
    </q-page-sticky>
    <div id="map"></div>
    <div
      :class="
        marking ? 'full' :
        $route.path === '/'
          ? 'activeroute'
          : $route.path === '/favorites'
          ? 'activeroute'
          : $route.path === '/contribute'
          ? 'activeroute'
          : ''
      "
      ref="visibleMap"
    ></div>
  </div>
</template>

<script>
import L from "leaflet";
import { mapActions, mapMutations } from "vuex";
import { mapFields } from "vuex-map-fields";
import { REMOVE_LAYER } from "../../store/types";
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
      "GPSEnabled",
      "marker",
      "marking"
    ])
  },
  methods: {
    ...mapActions("map", ["initializeMap", "locateUser", "identifyBuilding"]),
    ...mapMutations("map", {
      removeLayer: REMOVE_LAYER
    }),
    draw({ layer }) {
      if (layer instanceof L.Marker) {
        layer.dragging.disable();
        this.marking = false;
        this.marker = layer;
      } else if (layer instanceof L.Polyline) {
        console.log(layer);
      }
    },
    located({ latlng }) {
      if (!this.GPSEnabled) {
        this.GPSEnabled = true;
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
      this.GPSEnabled = false;
      this.$q.notify({
        message: "I'm sorry but I can't find you. GPS Search would be disabled",
        color: "negative",
        position: "top"
      });
    }
  },
  mounted() {
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
    // this.mapInstance.on("click", this.click);
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

<style>
#map {
  top: 0px;
  left: 0px;
  right: 0px;
  height: 100%;
  position: absolute;
  z-index: 0;
}
@media (min-width: 641px) {
  .activeroute {
    top: 0px;
    left: calc(360px + 1vw);
    right: 0px;
    height: 100%;
    position: absolute;
    z-index: 10;
    pointer-events: none;
    border-style: solid;
  }
  .full {
    top: 0px;
    left: 0px;
    right: 0px;
    height: 100%;
    position: absolute;
    z-index: 10;
    pointer-events: none;
    border-style: solid;
  }
}
@media (max-width: 640px) {
  .activeroute {
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: calc(60%);
    position: absolute;
    z-index: 10;
    border-style: solid;
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
    border-style: solid;
  }
}
.front {
  z-index: 10;
}
</style>
