<template>
  <div v-if="!selectingOrigin && !selectingDestination">
    <q-card-actions>
      <p class="text-h5">Add Walking Path</p>
      <q-btn
        class="full-width godown"
        color="dukdw"
        :label="
          origin
            ? `[${origin.type}] ${
                origin.name.length > 30
                  ? `${origin.name.slice(0, 30)}...`
                  : `${origin.name}`
              }`
            : 'Select Origin'
        "
        no-ripple
        size="l"
        :disabled="this.oldDestination"
        @click="select('origin')"
      />
      <q-btn
        class="full-width godown"
        color="dukdw"
        :label="
          destination
            ? `[${destination.type}] ${
                destination.name.length > 30
                  ? `${destination.name.slice(0, 30)}...`
                  : `${destination.name}`
              }`
            : 'Select Destination'
        "
        no-ripple
        size="l"
        @click="select('destination')"
      />
    </q-card-actions>
    <q-card-section>
      <q-btn
        class="full-width godown"
        color="green"
        label="Auto Mode"
        :disable="!origin || !destination"
        @click="autoMode"
      />
      <q-btn
        class="full-width godown"
        color="green"
        label="Manual Mode"
        :disable="!origin || !destination"
        @click="manualMode"
      />
      <q-btn
        class="full-width"
        color="green"
        label="Add Path"
        :disable="latLngs.length === 0"
        @click="addPath"
      />
    </q-card-section>
  </div>
  <div v-else-if="selectingOrigin || selectingDestination">
    <q-card-section>
      <q-input
        v-model="name"
        outlined
        label="Search"
        debounce="500"
        :rules="[POISearch]"
        class="godown"
      />
    </q-card-section>
    <div class="poi-body">
      <poi-item
        v-for="(poi, index) in pois"
        :key="index"
        :poi="poi"
        @viewPOI="viewPOI"
        @selectPOI="selectPOI"
      />
    </div>
  </div>
</template>

<script>
import { CHANGE_VIEW } from "../../store/types";
import * as Api from "../../api";
import L from "leaflet";
import { mapMutations, mapState } from "vuex";

export default {
  name: "AddWalkPath",
  props: ["oldDestination"],
  data() {
    return {
      origin: null,
      name: "",
      destination: null,
      selectingOrigin: false,
      selectingDestination: false,
      latLngs: "",
      pois: null,
      distance: 0,
      duration: 0
    };
  },
  computed: {
    ...mapState("map", ["mapInstance", "polygon"])
  },
  methods: {
    ...mapMutations("map", {
      changeView: CHANGE_VIEW
    }),
    async autoMode() {
      this.reset();
      const origin = { ...this.origin };
      const destination = { ...this.destination };
      delete origin.marker;
      delete destination.marker;
      const { data } = await Api.allPath({
        origin,
        destination
      });
      this.latLngs = data[0].latLngs;
      this.distance = data[0].distance;
      this.duration = data[0].duration;
      this.polyLine = L.polyline(this.latLngs, {
        color: "blue"
      }).addTo(this.mapInstance);
    },
    manualMode() {
      this.reset();
      const { lat, lng } = this.origin;
      this.duration = 0;
      this.distance = 0;
      this.mapInstance.editTools.startPolyline(L.latLng(lat, lng));
    },
    select(endType) {
      if (endType === "origin") {
        this.selectingOrigin = true;
        this.selectingDestination = false;
      } else {
        this.selectingOrigin = false;
        this.selectingDestination = true;
      }
    },
    async POISearch(name) {
      return Api.buildingStop({ name })
        .then(result => {
          this.pois = result.data;
        })
        .catch(() => {
          this.$q.notify({
            message: "An error occured",
            color: "negative",
            position: "top"
          });
        });
    },
    viewPOI(poi) {
      if (this.selectingOrigin) {
        this.setOrigin(poi);
      } else {
        this.setDestination(poi);
      }
      this.setView();
    },
    selectPOI(poi) {
      if (this.selectingOrigin) {
        this.selectingOrigin = false;
        this.setOrigin(poi);
      } else {
        this.selectingDestination = false;
        this.setDestination(poi);
      }
      this.name = null;
      this.setView();
      if (this.origin && this.destination) {
        const origin = { ...this.origin };
        const destination = { ...this.destination };
        delete origin.marker;
        delete destination.marker;
      }
    },
    setView() {
      if (this.origin && this.destination) {
        this.changeView({
          coordinates: [
            { lat: this.origin.lat, lng: this.origin.lng },
            { lat: this.destination.lat, lng: this.destination.lng }
          ]
        });
      } else if (this.origin) {
        this.changeView({
          coordinates: [{ lat: this.origin.lat, lng: this.origin.lng }]
        });
      } else {
        this.changeView({
          coordinates: [
            { lat: this.destination.lat, lng: this.destination.lng }
          ]
        });
      }
    },
    setOrigin(poi) {
      let { lat, lng } = poi;
      if (this.origin) {
        const { marker } = this.origin;
        marker.setLatLng({ lat, lng });
        this.origin = { ...poi, marker };
      } else {
        this.origin = poi;
        this.origin.marker = new L.Marker({ lat, lng }).addTo(this.mapInstance);
      }
    },
    setDestination(poi) {
      let { lat, lng } = poi;
      if (this.destination) {
        const { marker } = this.destination;
        marker.setLatLng({ lat, lng });
        this.destination = { ...poi, marker };
      } else {
        this.destination = poi;
        this.destination.marker = new L.Marker({ lat, lng }).addTo(
          this.mapInstance
        );
      }
    },
    addPath() {
      const { id, type } = this.origin;
      const origin = { id, type };
      const { id, type } = this.destination;
      const destination = { id, type };
      const path = {
        duration: this.duration,
        distance: this.distance,
        origin,
        destination,
        latLngs: this.latLngs,
        type: "walking"
      };
      this.$emit("addPath", path);
    },
    reset() {
      if (this.polyLine) {
        this.mapInstance.removeLayer(this.polyLine);
      }
      this.latLngs = [];
    }
  },
  watch: {
    async polygon(newValue) {
      this.mapInstance.removeLayer(newValue);
      this.latLngs = newValue.getLatLngs();
      this.polyLine = L.polyline(this.latLngs, {
        color: "blue"
      }).addTo(this.mapInstance);
    }
  },
  mounted() {
    if (this.oldDestination) {
      this.origin = { ...this.oldDestination };
    }
  },
  beforeDestroy() {
    // this.reset();
  }
};
</script>

<style lang="scss" scoped>
.poi-body {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  position: absolute;
  top: 167px;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
