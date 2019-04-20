<template>
  <div>
    <div id="map"></div>
    <div
      :class="
        $route.path === '/'
          ? 'activeroute'
          : $route.path === '/origin'
          ? 'activeorigindestination'
          : $route.path === '/destination'
          ? 'activeorigindestination'
          : $route.path === '/origin/mark'
          ? 'activemark'
          : $route.path === '/destination/mark'
          ? 'activemark'
          : ''
      "
      ref="visibleMap"
    ></div>
  </div>
</template>

<script>
import L from "leaflet";
import { mapMutations, mapActions } from "vuex";
import { mapFields } from "vuex-map-fields";
import { GET_MAP, UPDATE_POSITION, REMOVE_LAYER } from "../../store/types";

export default {
  name: "Map",
  computed: {
    ...mapFields("map", [
      "mapInstance",
      "userMarker",
      "GPSOrigin",
      "GPSDestination",
      "MarkerOrigin",
      "MarkerDestination",
      "glMap",
      "mapTop",
      "mapLeft",
      "mapRight",
      "mapBottom"
    ])
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
    this.getMap();
    this.mapInstance.on("editable:drawing:end", this.draw);
    this.mapInstance.on("locationfound", this.located);
    this.mapInstance.on("locationerror", this.onLocationError);
    this.mapInstance.on("click", this.click);
    this.mapInstance.locate({ watch: true });
  },
  methods: {
    ...mapMutations("map", {
      getMap: GET_MAP,
      removeLayer: REMOVE_LAYER,
      updatePosition: UPDATE_POSITION
    }),
    ...mapActions("map", ["reverseGeocode"]),
    draw({ layer }) {
      if (layer instanceof L.Marker) {
        const latLng = layer.getLatLng();
        this.removeLayer({ layer });
        if (this.MarkerOrigin) {
          this.MarkerOrigin = false;
          this.reverseGeocode({ latLng, endType: "Origin", type: "Marker" });
        } else if (this.MarkerDestination) {
          this.MarkerDestination = false;
          this.reverseGeocode({
            latLng,
            endType: "Destination",
            type: "Marker"
          });
        }
      } else if (layer instanceof L.Polyline) {
        console.log(layer);
      }
    },
    located({ latlng }) {
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
      if (this.GPSOrigin) {
        this.GPSOrigin = false;
        this.reverseGeocode({ latLng: latlng, endType: "Origin", type: "GPS" });
      } else if (this.GPSDestination) {
        this.GPSDestination = false;
        this.reverseGeocode({
          latLng: latlng,
          endType: "Destination",
          type: "GPS"
        });
      }
    },
    click(e) {
      const marker = new L.Marker(e.latlng, { draggable: true }).on(
        "drag",
        e => {
          console.log(e.latlng);
        }
      );
      marker.addTo(this.mapInstance);
      this.mapInstance.fitBounds([{ ...e.latlng }], {
        paddingTopLeft: [0, 360]
      });
    },
    onLocationError() {
      if (this.GPSOrigin) {
        this.GPSOrigin = false;
        this.$q.notify({
          message: "I'm sorry but I can't find you",
          color: "negative",
          position: "top"
        });
      } else if (this.GPSDestination) {
        this.GPSDestination = false;
        this.$q.notify({
          message: "I'm sorry but I can't find you",
          color: "negative",
          position: "top"
        });
      }
    }
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
  .activeroute,
  .activeorigindestination,
  .activemark {
    top: 0px;
    left: calc(360px + 1vw);
    right: 0px;
    height: 100%;
    position: absolute;
    z-index: -10;
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
    z-index: -10;
    border-style: solid;
  }
  .activeorigindestination {
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: calc(80%);
    position: absolute;
    z-index: -10;
    border-style: solid;
  }
  .activemark {
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: calc(20%);
    position: absolute;
    z-index: -10;
    border-style: solid;
  }
}
</style>
