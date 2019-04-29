<template>
  <q-card-section>
    <q-btn
      class="full-width godown"
      color="dukdw"
      :label="selectedBuilding ? selectedBuilding.name : 'Select Building'"
      @click="mark"
    />
    <q-input
      class="godown"
      outlined
      v-model="name"
      label="Enter Room Name"
      :disable="!selectedBuilding"
      :rules="[roomSearch]"
      debounce="500"
    />
    <q-btn
      class="full-width"
      color="green"
      label="Delete Room"
      :disable="
        !selectedBuilding || name.length === 0 || this.rooms.length === 0
      "
      @click="deleteRoom"
    />
  </q-card-section>
</template>

<script>
import L from "leaflet";
import { mapState } from "vuex";
import { mapFields } from "vuex-map-fields";
import * as Api from "../../api";

export default {
  name: "DeleteRoom",
  data() {
    return {
      selectedBuilding: null,
      buildings: [],
      rooms: [],
      name: ""
    };
  },
  computed: {
    ...mapState("map", ["mapInstance"]),
    ...mapState("user", ["accessToken"]),
    ...mapFields("map", ["drawing", "marker"])
  },
  methods: {
    async roomSearch() {
      const request = await Api.allRoom({
        name: this.name,
        buildingId: this.selectedBuilding.id,
        exact: true
      });
      this.rooms = request.data;
      if (this.rooms.length === 0) {
        this.$q.notify({
          message: "Room does not exist",
          color: "negative"
        });
      }
    },
    async getBuildings() {
      try {
        const { data } = await Api.allBuilding();
        this.buildings = data;
        this.buildings.forEach(building => {
          building.polygon = L.polygon(building.coordinates, {
            color: "blue"
          }).addTo(this.mapInstance);
        });
      } catch (error) {
        this.$q.notify({
          message: "An error occured",
          color: "negative"
        });
      }
    },
    async deleteRoom() {
      try {
        await Api.removeRoom({
          accessToken: this.accessToken,
          id: this.rooms[0].id
        });
        this.$q.notify({
          message: "Successfully deleted room",
          color: "positive"
        });
      } catch (error) {
        this.$q.notify({
          message: "An error occured",
          color: "negative"
        });
      }
    },
    reset() {
      this.buildings.forEach(building => {
        this.mapInstance.removeLayer(building.polygon);
      });
    },
    mark() {
      this.mapInstance.editTools.startMarker();
    }
  },
  watch: {
    async marker(newValue) {
      this.mapInstance.removeLayer(newValue);
      const { lat, lng } = newValue.getLatLng();
      const { data } = await Api.identifyBuilding({ lat, lng });
      if (data.type === "Building") {
        this.selectedBuilding = data;
      } else {
        this.$q.notify({
          message: "Not a building",
          color: "negative"
        });
      }
    }
  },
  async mounted() {
    this.getBuildings();
  },
  beforeDestroy() {
    this.reset();
  }
};
</script>

<style></style>
