<template>
  <q-card-section v-if="mode==='select'">
    <q-btn
      class="full-width godown"
      color="dukdw"
      label="Add Indoor Path"
      @click="addIndoor"
      :disabled="paths.length > 0 && paths[0].destination && paths[0].destination.type === 'Room'"
    />
    <q-btn
      class="full-width godown"
      color="dukdw"
      label="Add Walking Path"
      :disabled="paths.length > 0 && paths[0].destination && paths[0].destination.type === 'Room'"
    />
    <q-btn
      class="full-width godown"
      color="dukdw"
      label="Add Jeepney Path"
      :disabled="paths.length > 0 && paths[0].destination && paths[0].destination.type === 'Room'"
    />
    <view-path-card v-for="(path, index) in paths" :key="index" :path="path" :index="index"/>
  </q-card-section>
  <add-indoor-route
    v-else-if="mode==='indoor'"
    @addPath="addPath"
    :oldDestination="paths.length > 0 ? paths[0].destination:null"
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
    addPath(path) {
      this.paths.unshift(path);
      console.log(path);
      this.mode = "select";
    }
  }
};
</script>

<style></style>
