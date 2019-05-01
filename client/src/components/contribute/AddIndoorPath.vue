<template>
  <div v-if="!selectingOrigin && !selectingDestination">
    <q-card-actions>
      <p class="text-h5">Add Indoor Path</p>
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
      <q-input
        class="godown"
        v-model="instructions"
        outlined
        label="Enter Indoor Instructions Here"
        type="textarea"
        :disable="!origin && !destination"
      />
      <q-btn
        class="full-width"
        color="green"
        label="Add Path"
        :disable="!origin && !destination && instructions.length === 0"
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
  name: "AddIndoorPath",
  props: ["oldDestination"],
  data() {
    return {
      origin: null,
      name: "",
      destination: null,
      selectingOrigin: false,
      selectingDestination: false,
      instructions: "",
      pois: null
    };
  },
  computed: {
    ...mapState("map", ["mapInstance"])
  },
  methods: {
    ...mapMutations("map", {
      changeView: CHANGE_VIEW
    }),
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
      if (
        this.origin &&
        this.origin.type === "Building" &&
        this.selectingDestination
      ) {
        return Api.allRoom({ name, buildingId: this.origin.id })
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
      } else if (
        this.origin &&
        this.origin.type === "Room" &&
        this.selectingDestination
      ) {
        return Api.allRoom({
          name,
          buildingId: this.origin.building.id,
          building: true
        })
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
      } else {
        return Api.roomBuilding({ name })
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
      }
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
        origin,
        destination,
        instructions: this.instructions,
        type: "indoor"
      };
      this.$emit("addPath", path);
    }
  },
  mounted() {
    if (this.oldDestination) {
      this.origin = { ...this.oldDestination };
    }
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
