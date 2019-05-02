<template>
  <q-card-section>
    <q-btn
      class="full-width godown"
      color="dukdw"
      label="Draw Building"
      @click="mark"
    />
    <q-input
      class="godown"
      outlined
      v-model="name"
      placeholder="Francisco O. Santos Hall"
      label="Enter Building Name"
      :disable="!newBuilding || newBuildingCoordinates.length === 0"
    />
    <q-input
      class="godown"
      outlined
      v-model="alternativeNames"
      placeholder="ICS,IMSP,IC,Physci"
      label="Enter Building Alternative Names"
      :disable="
        !newBuilding || newBuildingCoordinates.length === 0 || name.length === 0
      "
    />
    <q-btn
      class="full-width"
      color="green"
      label="Submit"
      :disable="!newBuilding || name.length === 0"
      @click="addBuilding"
    />
  </q-card-section>
</template>

<script>
import L from "leaflet";
import { mapState } from "vuex";
import { mapFields } from "vuex-map-fields";
import * as Api from "../../api";

export default {
  name: "AddBuilding",
  data() {
    return {
      newBuildingCoordinates: [],
      newBuilding: null,
      buildings: [],
      name: "",
      alternativeNames: ""
    };
  },
  computed: {
    ...mapState("map", ["mapInstance"]),
    ...mapState("user", ["accessToken"]),
    ...mapFields("map", ["drawing", "polygon"])
  },
  methods: {
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
          color: "negative",
          position: "top"
        });
      }
    },
    async addBuilding() {
      try {
        await Api.saveBuilding({
          coordinates: this.newBuildingCoordinates,
          accessToken: this.accessToken,
          name: this.name,
          alternativeNames: this.alternativeNames
        });
        this.$q.notify({
          message: "Successfully added building",
          color: "positive",
          position: "top"
        });
      } catch (error) {
        this.$q.notify({
          message: "An error occured",
          color: "negative",
          position: "top"
        });
      }
    },
    reset() {
      this.buildings.forEach(building => {
        this.mapInstance.removeLayer(building.polygon);
      });
      if (this.newBuilding) {
        this.mapInstance.removeLayer(this.newBuilding);
      }
    },
    mark() {
      this.mapInstance.editTools.startPolygon();
    }
  },
  watch: {
    async polygon(newValue) {
      this.mapInstance.removeLayer(newValue);
      this.newBuildingCoordinates = newValue.getLatLngs();
      this.newBuilding = L.polygon(this.newBuildingCoordinates, {
        color: "blue"
      }).addTo(this.mapInstance);
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
