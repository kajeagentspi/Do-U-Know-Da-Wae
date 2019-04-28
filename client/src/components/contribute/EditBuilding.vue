<template>
  <q-card-section>
    <q-btn class="full-width godown" color="dukdw" label="Select Building" @click="mark"/>
    <q-input
      class="godown"
      outlined
      v-model="name"
      placeholder="Francisco O. Santos Hall"
      label="Enter Building Name"
      :disable="!selectedBuilding"
    />
    <q-input
      class="godown"
      outlined
      v-model="alternativeNames"
      placeholder="ICS,IMSP,IC,Physci"
      label="Enter Building Alternative Names"
      :disable="
        !selectedBuilding || name.length === 0
      "
    />
    <q-btn
      class="full-width"
      color="green"
      label="Submit"
      :disable="!selectedBuilding || name.length === 0"
      @click="editBuilding"
    />
  </q-card-section>
</template>

<script>
import L from "leaflet";
import { mapState } from "vuex";
import { mapFields } from "vuex-map-fields";
import * as Api from "../../api";

export default {
  name: "EditBuilding",
  data() {
    return {
      selectedBuilding: null,
      buildings: [],
      name: "",
      alternativeNames: ""
    };
  },
  computed: {
    ...mapState("map", ["mapInstance"]),
    ...mapState("user", ["accessToken"]),
    ...mapFields("map", ["drawing", "marker"])
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
          color: "negative"
        });
      }
    },
    async editBuilding() {
      try {
        await Api.saveBuilding({
          id: this.selectedBuilding.id,
          accessToken: this.accessToken,
          name: this.name,
          alternativeNames: this.alternativeNames
        });
        this.$q.notify({
          message: "Successfully added building",
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
        this.name = this.selectedBuilding.name;
        this.alternativeNames = this.selectedBuilding.alternativeNames;
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
