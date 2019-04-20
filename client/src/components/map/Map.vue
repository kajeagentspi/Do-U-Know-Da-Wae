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
        $route.path === '/'
          ? 'activeroute'
          : $route.path === '/origin'
          ? 'activeorigindestination'
          : $route.path === '/destination'
          ? 'activeorigindestination'
          : $route.path === '/origin/marker'
          ? 'activemark'
          : $route.path === '/destination/marker'
          ? 'activemark'
          : $route.path === '/origin/selected'
          ? 'activemark'
          : $route.path === '/destination/selected'
          ? 'activemark'
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
      "GPSOrigin",
      "GPSDestination",
      "MarkerOrigin",
      "MarkerDestination",
      "mapTop",
      "mapLeft",
      "mapRight",
      "mapBottom",
      "GPSEnabled"
    ])
  },
  methods: {
    ...mapActions("map", ["initializeMap", "locateUser", "reverseGeocode"]),
    ...mapMutations("map", {
      removeLayer: REMOVE_LAYER
    }),
    draw({ layer }) {
      if (layer instanceof L.Marker) {
        const { lat, lng } = layer.getLatLng();
        this.removeLayer({ layer });
        if (this.MarkerOrigin) {
          this.MarkerOrigin = false;
          this.reverseGeocode({
            lat,
            lng,
            locationType: "origin",
            type: "Marker"
          });
        } else if (this.MarkerDestination) {
          this.MarkerDestination = false;
          this.reverseGeocode({
            lat,
            lng,
            locationType: "destination",
            type: "Marker"
          });
        }
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
    onLocationError() {
      this.GPSEnabled = false;
      this.$q.notify({
        message: "I'm sorry but I can't find you. GPS Search would be disabled",
        color: "negative",
        position: "top"
      });
    }
    // removeLayer: REMOVE_LAYER,
    // updatePosition: UPDATE_POSITION
    // })
    // ...mapActions("map", ["reverseGeocode"]),
    //

    // click(e) {
    //   const marker = new L.Marker(e.latlng, { draggable: true }).on(
    //     "drag",
    //     e => {
    //       console.log(e.latlng);
    //     }
    //   );
    //   marker.addTo(this.mapInstance);
    //   this.mapInstance.fitBounds([{ ...e.latlng }], {
    //     paddingTopLeft: [0, 360]
    //   });
    // },
    // }
    // }
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
  .activeroute,
  .activeorigindestination,
  .activemark {
    top: 0px;
    left: calc(360px + 1vw);
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
  .activeorigindestination {
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: calc(80%);
    position: absolute;
    z-index: 10;
    border-style: solid;
    pointer-events: none;
  }
  .activemark {
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: calc(20%);
    position: absolute;
    z-index: 10;
    border-style: solid;
    pointer-events: none;
  }
}

.front {
  z-index: 10;
}
</style>
