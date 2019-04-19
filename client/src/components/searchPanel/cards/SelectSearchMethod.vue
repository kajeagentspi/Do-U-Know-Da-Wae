<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">
        {{
          `Selecting ${this.$route.path === "/from" ? "Origin" : "Destination"}`
        }}
      </div>

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

export default {
  name: "SelectSearchMethod",
  methods: {
    ...mapActions("map", ["locate"]),
    checkRoute() {
      console.log(this.$route.path);
    }
  }
};
</script>

<style></style>
