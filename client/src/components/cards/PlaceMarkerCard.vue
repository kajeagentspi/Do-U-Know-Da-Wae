<template>
  <q-card>
    <q-card-actions class="navbar">
      <q-btn-group flat>
        <q-btn icon="navigate_before" to="/"/>
      </q-btn-group>
      <q-space/>
      <div class="text-h6 capitalize">{{ `Mark ${this.type}` }}</div>
    </q-card-actions>
    <q-card-section class="center">
      <q-icon name="fas fa-map-marker-alt" size="50px"/>
      <q-separator spaced/>
      <q-item-label>Where would you like to go?</q-item-label>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapFields } from "vuex-map-fields";
export default {
  name: "PlaceMarkerCard",
  mounted() {
    if (this.$route.path === "/origin/marker") {
      this.type = "origin";
    } else {
      this.type = "destination";
    }
  },
  computed: {
    ...mapFields("map", ["MarkerOrigin", "MarkerDestination"])
  },
  data() {
    return {
      type: ""
    };
  },
  methods: {
    print() {
      console.log(this.MarkerOrigin);
      console.log(this.MarkerDestination);
    }
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  background-color: red;
  color: white;
}
.center {
  text-align: center;
}
</style>
