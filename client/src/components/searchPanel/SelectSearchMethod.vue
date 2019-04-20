<template>
  <q-card>
    <q-card-section>
      <q-card-actions>
        <q-btn round icon="navigate_before" to="/"/>
        <q-space/>
        <div class="text-h6 capitalize">{{ `Select ${this.type}` }}</div>
      </q-card-actions>
      <q-separator spaced/>
      <q-card-actions vertical>
        <q-input v-model="name" outlined label="Search for a Room, Building, Jeepney Stop"/>
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
          :to="`/${this.type}/marker`"
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
      type: "",
      name: ""
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
    if (this.$route.path === "/origin") {
      this.type = "origin";
    } else {
      this.type = "destination";
    }
  },
  methods: {
    ...mapActions("map", ["locateUser", "placeMarker"]),
    locate() {
      if (this.type === "origin") {
        this.GPSOrigin = true;
      } else {
        this.GPSDestination = true;
      }
      this.locateUser();
    },
    mark() {
      if (this.type === "origin") {
        this.MarkerOrigin = true;
      } else {
        this.MarkerDestination = true;
      }
      this.placeMarker();
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

<style scoped>
</style>
