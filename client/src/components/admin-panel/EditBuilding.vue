<template>
  <fragment>
    <q-card-section>
      <q-btn
        class="full-width godown"
        color="dukdw"
        label="Select Building"
        @click="mark"
      />
      <q-input
        class="godown"
        outlined
        v-model="name"
        placeholder="Francisco O. Santos Hall"
        label="Enter Building Name"
        :disable="!selectedBuilding"
      >
        <template v-slot:append>
          <q-avatar>
            <q-tooltip>The name of the building</q-tooltip>
            <q-icon name="far fa-question-circle" size="25px" />
          </q-avatar>
        </template>
      </q-input>
      <q-input
        class="godown"
        outlined
        v-model="alternativeNames"
        placeholder="ICS,IMSP,IC,Physci"
        label="Enter Building Alternative Names"
        :disable="!selectedBuilding || name.length === 0"
      >
        <template v-slot:append>
          <q-avatar>
            <q-tooltip>A list of comma separated alternative names</q-tooltip>
            <q-icon name="far fa-question-circle" size="25px" />
          </q-avatar>
        </template>
      </q-input>
      <q-btn
        class="full-width godown"
        color="green"
        label="Save"
        :disable="!selectedBuilding || name.length === 0"
        @click="editBuilding"
      />
      <q-btn
        class="full-width godown"
        color="dukdw"
        label="Add Room"
        v-if="selectedBuilding"
        @click="enableAddModal"
      />
    </q-card-section>
    <div class="poi-body" v-if="selectedBuilding">
      <poi-item
        v-for="(poi, index) in selectedBuilding.rooms"
        :key="index"
        :poi="poi"
        text="Edit"
        @selectPOI="selectRoom"
      />
    </div>
    <q-dialog v-model="addModal">
      <q-card>
        <q-card-section>
          <q-input
            class="godown"
            outlined
            v-model="roomName"
            label="Enter Room Name"
            :disable="!selectedBuilding"
            :rules="[roomSearch]"
            debounce="500"
          />
          <q-input
            class="godown"
            outlined
            type="number"
            v-model.number="level"
            label="Enter Room Level"
            :disable="!selectedBuilding"
          />
          <q-btn
            class="full-width"
            color="green"
            label="Add Room"
            :disable="
              !selectedBuilding || roomName.length === 0 || rooms.length !== 0
            "
            @click="addRoom"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="editModal">
      <q-card>
        <q-card-section>
          <q-input
            class="godown"
            outlined
            v-model="roomName"
            label="Enter Room Name"
            :disable="!selectedBuilding"
            :rules="[roomSearch]"
            debounce="500"
          />
          <q-btn
            class="full-width godown"
            color="green"
            label="Save"
            :disable="
              !selectedBuilding || roomName.length === 0 || rooms.length !== 0
            "
            @click="editRoom"
          />
          <q-btn
            class="full-width"
            color="dukdw"
            label="Delete Room"
            :disable="!selectedBuilding"
            @click="deleteRoom"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </fragment>
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
      rooms: [],
      name: "",
      alternativeNames: "",
      addModal: false,
      editModal: false,
      roomName: "",
      roomId: null,
      level: 1
    };
  },
  computed: {
    ...mapState("map", ["mapInstance"]),
    ...mapFields("map", ["drawing", "marker"])
  },
  methods: {
    async editRoom() {
      try {
        await Api.saveRoom({ id: this.roomId, name: this.roomName });
        this.getBuilding();
        this.editModal = false;
        this.$q.notify({
          message: "Successfully edited room",
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
    async deleteRoom() {
      try {
        await Api.removeRoom(this.roomId);
        this.getBuilding();
        this.editModal = false;
        this.$q.notify({
          message: "Successfully deleted room",
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
    selectRoom(room) {
      this.roomId = room.id;
      this.roomName = room.name;
      this.editModal = true;
    },
    async getBuilding() {
      const { data } = await Api.oneBuilding(this.selectedBuilding.id);
      this.selectedBuilding = data;
      this.name = this.selectedBuilding.name;
      this.alternativeNames = this.selectedBuilding.alternativeNames;
    },
    async addRoom() {
      try {
        await Api.saveRoom({
          buildingId: this.selectedBuilding.id,
          name: this.roomName,
          level: this.level
        });
        this.roomName = "";
        this.level = 1;
        this.addModal = false;
        this.getBuilding();
        this.$q.notify({
          message: "Successfully added room",
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
    enableAddModal() {
      this.addModal = true;
    },
    async roomSearch() {
      const request = await Api.allRoom({
        name: this.roomName,
        buildingId: this.selectedBuilding.id,
        exact: true
      });
      this.rooms = request.data;
      if (this.rooms.length !== 0) {
        this.$q.notify({
          message: "Room exists",
          color: "negative",
          position: "top"
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
          color: "negative",
          position: "top"
        });
      }
    },
    async editBuilding() {
      try {
        await Api.saveBuilding({
          id: this.selectedBuilding.id,
          name: this.name,
          alternativeNames: this.alternativeNames
        });
        this.$q.notify({
          message: "Successfully edited building",
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
          color: "negative",
          position: "top"
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

<style lang="scss" scoped>
.poi-body {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  position: absolute;
  top: 329px;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
