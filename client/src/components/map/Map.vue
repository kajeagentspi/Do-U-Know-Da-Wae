<template>
  <q-card id="map"></q-card>
</template>

<script>
import L from "leaflet";
import { mapMutations, mapActions } from "vuex";
import { mapFields } from "vuex-map-fields";
import { GET_MAP, UPDATE_POSITION } from "../../store/types";

export default {
  name: "Map",
  computed: {
    ...mapFields("map", [
      "mapInstance",
      "userMarker",
      "GPSOrigin",
      "GPSDestination",
      "MarkerOrigin",
      "MarkerDestination"
    ])
  },
  mounted() {
    this.getMap();
    this.mapInstance.on("editable:drawing:end", this.draw);
    this.mapInstance.on("locationfound", this.located);
    // this.mapInstance.on("click", this.click);
  },
  methods: {
    ...mapMutations("map", {
      getMap: GET_MAP,
      updatePosition: UPDATE_POSITION
    }),
    ...mapActions("map", ["reverseGeocode"]),
    draw({ layer }) {
      if (layer instanceof L.Marker) {
        const latLng = layer.getLatLng();
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
    }
  }
};
</script>

<style>
@media (max-width: 640px) {
  #map {
    width: 100%;
    height: 40%;
    top: 0px;
    position: absolute;
    z-index: 0;
  }
}
@media (min-width: 641px) {
  #map {
    width: calc(100% - 380px - 3vh);
    top: 1vh;
    right: 1vh;
    bottom: 1vh;
    position: absolute;
    z-index: 0;
  }
}
</style>
