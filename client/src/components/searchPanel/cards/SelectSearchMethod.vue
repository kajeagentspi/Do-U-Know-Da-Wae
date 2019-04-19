<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">{{ `Selecting ${this.type}` }}</div>

      <q-separator inset />

      <q-card-actions vertical>
        <q-btn class="full-width" color="red" label="Go Back" to="/" />
        <q-btn
          class="full-width"
          color="green"
          icon="gps_fixed"
          label="Use Current Location"
          @click="locate"
        />
        <q-btn
          class="full-width"
          color="green"
          icon="place"
          label="Place A Marker"
          @click="mark"
        />
        <q-btn
          class="full-width"
          color="green"
          icon="meeting_room"
          label="Search Room"
        />
        <q-btn
          class="full-width"
          color="green"
          icon="account_balance"
          label="Search Building"
        />
        <q-btn
          class="full-width"
          color="green"
          icon="commute"
          label="Search Jeepney Stop"
        />
      </q-card-actions>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapActions } from "vuex";
import { mapFields } from "vuex-map-fields";
export default {
  name: "SelectSearchMethod",
  data() {
    return {
      type: null
    };
  },
  computed: {
    ...mapFields("map", [
      "GPSOrigin",
      "GPSDestination",
      "MarkerOrigin",
      "MarkerDestination"
    ])
  },
  mounted() {
    if (this.$route.path === "/from") {
      this.type = "Origin";
    } else {
      this.type = "Destination";
    }
  },
  methods: {
    ...mapActions("map", ["locateUser", "placeMarker"]),
    locate() {
      if (this.type === "Origin") {
        this.GPSOrigin = true;
      } else {
        this.GPSDestination = true;
      }
      this.locateUser();
    },
    mark() {
      if (this.type === "Origin") {
        this.MarkerOrigin = true;
      } else {
        this.MarkerDestination = true;
      }
      this.placeMarker();
    }
  }
};
</script>

<style></style>
