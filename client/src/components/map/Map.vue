<template>
  <q-card id="map"></q-card>
</template>

<script>
import L from "leaflet";
import { mapMutations } from "vuex";
import { mapFields } from "vuex-map-fields";
import { GET_MAP, UPDATE_POSITION } from "../../store/types";

export default {
  name: "Map",
  computed: {
    ...mapFields("map", ["mapInstance", "userMarker"])
  },
  mounted() {
    // this.getMap();
    this.mapInstance = L.map("map", {
      zoomControl: false,
      minZoom: 15,
      maxZoom: 21,
      maxBounds: [
        { lat: 14.171030846860607, lng: 121.26183271408082 },
        { lat: 14.150870198219486, lng: 121.22063398361207 }
      ],
      editable: true
    });
    this.mapInstance.setView([14.1648, 121.2413], 19);
    L.mapboxGL({
      attribution:
        '<a href="https://www.maptiler.com/copyright/" target="_blank">© MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap contributors</a>',
      accessToken: "not-needed",
      style:
        "https://maps.tilehosting.com/styles/bright/style.json?key=4krAogjdNdbE796RetO6"
    }).addTo(this.mapInstance);
    this.mapInstance.on("editable:drawing:end", this.draw);
    this.mapInstance.on("locationfound", this.located);
    this.mapInstance.on("click", this.click);
  },
  methods: {
    ...mapMutations("map", {
      getMap: GET_MAP,
      updatePosition: UPDATE_POSITION
    }),
    draw({ layer }) {
      if (layer instanceof L.Marker) {
        console.log(layer);
      } else if (layer instanceof L.Polyline) {
        console.log(layer);
      }
    },
    located({ latlng }) {
      console.log(this.userMarker);
      this.updatePosition(latlng);
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
