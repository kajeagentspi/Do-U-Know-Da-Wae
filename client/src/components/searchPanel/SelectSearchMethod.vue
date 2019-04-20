<template>
  <q-card>
    <q-card-actions class="navbar">
      <q-btn-group flat>
        <q-btn icon="navigate_before" to="/" />
      </q-btn-group>
      <q-space />
      <div class="text-h6 capitalize">{{ `Select ${this.type}` }}</div>
    </q-card-actions>
    <q-card-section>
      <q-input
        v-model="name"
        outlined
        label="Search for a Room, Building, Stop"
        :rules="[allSearch]"
        debounce="500"
      />
    </q-card-section>
    <div class="body">
      <q-card-actions class="row" v-if="name === '' || pois.length === 0">
        <q-btn
          class="full-width godown"
          color="green"
          icon="gps_fixed"
          label="Use Current Location"
          :disable="!GPSEnabled"
          @click="user"
        />
        <q-btn
          class="full-width"
          color="green"
          icon="place"
          label="Place A Marker"
          @click="mark"
          :to="`/${this.type}/marker`"
        />
      </q-card-actions>
      <div v-else>
        <SearchResultCard
          v-for="(result, index) in pois"
          :result="result"
          :key="index"
        />
      </div>
    </div>
  </q-card>
</template>

<script>
import { mapActions } from "vuex";
import { mapFields } from "vuex-map-fields";
import { SearchResultCard } from "..";
export default {
  name: "SelectSearchMethod",
  data() {
    return {
      type: ""
    };
  },
  components: {
    SearchResultCard
  },
  computed: {
    ...mapFields("map", [
      "MarkerOrigin",
      "MarkerDestination",
      "GPSEnabled",
      "userMarker",
      "name",
      "pois",
      "mapInstance"
    ])
  },
  mounted() {
    if (this.$route.path === "/origin") {
      this.type = "origin";
    } else {
      this.type = "destination";
    }
  },
  methods: {
    ...mapActions("map", ["reverseGeocode", "placeMarker", "allSearch"]),
    user() {
      const { lat, lng } = this.userMarker.getLatLng();
      if (this.type === "origin") {
        this.reverseGeocode({ lat, lng, locationType: "origin", type: "GPS" });
      } else {
        this.reverseGeocode({
          lat,
          lng,
          locationType: "destination",
          type: "GPS"
        });
      }
    },
    mark() {
      if (this.type === "origin") {
        this.MarkerOrigin = true;
      } else {
        this.MarkerDestination = true;
      }
      this.mapInstance.editTools.startMarker();
    },
    searchRoom() {
      this.page = "room";
    },
    back() {
      this.page = "select";
    }
  }
};
</script>

<style lang="scss" scoped>
.body {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  position: absolute;
  top: 140px;
  bottom: 0;
  left: 0;
  right: 0;
}
.navbar {
  background-color: red;
  color: white;
}
.swap {
  width: 74px;
  height: 72px;
}
.godown {
  margin-bottom: 15px;
}
</style>
