<template>
  <q-card-section v-if="mode === 'select'">
    <q-btn
      class="full-width godown"
      color="dukdw"
      label="Add Indoor Path"
      @click="addIndoor"
      :disabled="
        paths.length > 0 &&
          (paths[0].destination.type !== 'Room' ||
            paths[0].destination.type !== 'Building')
      "
    />
    <q-btn
      class="full-width godown"
      color="dukdw"
      label="Add Walking Path"
      @click="addWalking"
      :disabled="paths.length > 0 && paths[0].destination.type === 'Room'"
    />
    <q-btn
      class="full-width godown"
      color="dukdw"
      label="Add Jeepney Path"
      @click="addJeep"
      :disabled="paths.length > 0 && paths[0].destination.type !== 'Stop'"
    />
    <view-path-card
      v-for="(path, index) in paths"
      :key="index"
      :path="path"
      :index="index"
    />
  </q-card-section>
  <add-indoor-path
    v-else-if="mode === 'indoor'"
    @addPath="addPath"
    :oldDestination="paths.length > 0 ? paths[0].destination : null"
  />
  <add-walk-path
    v-else-if="mode === 'walking'"
    @addPath="addPath"
    :oldDestination="paths.length > 0 ? paths[0].destination : null"
  />
  <add-jeep-path
    v-else-if="mode === 'jeep'"
    @addPath="addPath"
    :oldDestination="paths.length > 0 ? paths[0].destination : null"
  />
</template>

<script>
export default {
  name: "AddRoute",
  data() {
    return {
      paths: [],
      mode: "select"
    };
  },
  methods: {
    addIndoor() {
      this.mode = "indoor";
    },
    addWalking() {
      this.mode = "walking";
    },
    addJeep() {
      this.mode = "jeep";
    },
    addPath(path) {
      this.paths.unshift(path);
      console.log(path);
      this.mode = "select";
    }
  }
};
</script>

<style></style>
