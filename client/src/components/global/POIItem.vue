<template>
  <q-item clickable @click="viewPOI">
    <q-item-section avatar>
      <q-avatar
        color="dukdw"
        text-color="white"
        :icon="
          !poi.type
            ? 'fas fa-building'
            : poi.type === 'Stop'
            ? 'fas fa-bus'
            : poi.type === 'Marker'
            ? 'fas fa-map-marker-alt'
            : 'fas fa-door-open'
        "
      />
    </q-item-section>
    <q-item-section>
      <q-item-label>{{ poi.name }}</q-item-label>
      <q-item-label v-if="poi.direction">{{
        `${poi.direction} Stop`
      }}</q-item-label>
      <q-item-label v-if="poi.building">{{
        `Level ${poi.level} of ${poi.building.name}`
      }}</q-item-label>
    </q-item-section>
    <q-item-section side>
      <q-btn label="Select" color="dukdw" @click="selectPOI" />
    </q-item-section>
  </q-item>
</template>

<script>
export default {
  name: "POIItem",
  props: ["poi"],
  methods: {
    viewPOI() {
      this.$emit("viewPOI", this.poi);
    },
    selectPOI() {
      this.$emit("selectPOI", this.poi);
    }
  }
};
</script>

<style></style>
