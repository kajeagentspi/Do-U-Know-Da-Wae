<template>
  <q-card>
    <q-card-actions class="navbar">
      <q-btn-group flat>
        <q-btn disabled flat icon="explore" />
        <q-btn label="Search" to="/" />
        <q-btn label="Contribute" to="/contribute" />
        <q-btn label="Favorites" to="/favorites" />
      </q-btn-group>
    </q-card-actions>
    <div class="body">
      <q-card-section>
        <q-card flat>
          <q-card-section>
            <q-btn-group spread>
              <q-btn
                label="Route"
                icon="fas fa-route"
                @click="changeActive('route')"
              />
              <q-btn
                label="Room"
                icon="fas fa-door-open"
                @click="changeActive('room')"
              />
            </q-btn-group>
          </q-card-section>
        </q-card>
      </q-card-section>
      <q-separator />
      <q-card-section v-if="active === 'route'">
        <path-card :index="'Add'" />
        <path-card v-for="(path, index) in paths" :key="index" :index="index" />
        <q-btn
          class="full-width"
          color="green"
          :disabled="
            paths.length < 2 || paths[paths.length - 1].destination === null
          "
          label="Submit"
        />
      </q-card-section>
      <q-card-section v-if="active === 'room'">
        <q-card-section>
          <q-input
            v-model="buildingName"
            outlined
            label="Search for a Building"
            :rules="[
              val => val.length > 2 || 'Enter more characters',
              buildingSearch
            ]"
            debounce="500"
            @input="reset"
          />
        </q-card-section>
        <q-card-section v-if="selectedBuilding === null">
          <SearchResultCard
            v-for="(result, index) in buildings"
            :result="result"
            :key="index"
            page="search"
            @selected="handleSelected"
          />
        </q-card-section>
        <q-card-section v-else-if="selectedBuilding !== null">
          <SearchResultCard :result="selectedBuilding" page="search" />
          <div class="row">
            <q-input
              v-model="roomName"
              outlined
              label="Enter Room Name"
              debounce="500"
              @input="checkRoom"
              class="col-8"
            />
            <q-input
              v-model.number="roomLevel"
              type="number"
              outlined
              label="level"
              class="col-4"
              min="1"
            />
          </div>
          <q-btn
            color="green"
            class="full-width"
            label="Submit"
            :disable="!roomValid"
            @click="addRoom"
          />
        </q-card-section>
      </q-card-section>
    </div>
  </q-card>
</template>

<script>
import { SearchResultCard } from "..";
import { mapActions } from "vuex";
import { mapFields } from "vuex-map-fields";
import * as Api from "../../api";
export default {
  name: "ContributePanel",
  data() {
    return {
      active: "route",
      buildingName: "",
      selectedBuilding: null,
      roomName: "",
      roomValid: false,
      roomLevel: 1
    };
  },
  components: {
    SearchResultCard
  },
  computed: {
    ...mapFields("map", ["buildings", "rooms", "paths"])
  },
  methods: {
    ...mapActions("map", ["buildingSearch", "createRoom"]),
    changeActive(name) {
      this.active = name;
      this.selectedBuilding = null;
      this.buildings = [];
    },
    handleSelected(value) {
      this.selectedBuilding = value;
    },
    reset() {
      this.selectedBuilding = null;
      this.buildings = [];
      this.roomName = "";
      this.roomValid = false;
    },
    async checkRoom() {
      if (this.roomName.length <= 3) {
        this.roomValid = false;
        return;
      }
      const { data } = await Api.getRooms({
        buildingId: this.selectedBuilding.id,
        name: this.roomName
      });
      if (data.length === 0) {
        this.roomValid = true;
      } else {
        this.roomValid = false;
        this.$q.notify({
          message: "Room exists",
          color: "negative"
        });
      }
    },
    addRoom() {
      this.createRoom({
        name: this.roomName,
        level: this.roomLevel,
        buildingId: this.selectedBuilding.id,
        buildingName: this.selectedBuilding.name
      });
      this.roomName = "";
      this.roomLevel = 1;
    }
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  background-color: red;
  color: white;
}
.swap {
  width: 74px;
  height: 72px;
}
@media (min-width: 641px) {
  .scrollbox {
    height: calc(93vh - 170px);
  }
}
@media (max-width: 640px) {
  .scrollbox {
    height: calc(54vh - 170px);
  }
}
.body {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  position: absolute;
  top: 52px;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
