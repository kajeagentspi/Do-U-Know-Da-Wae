<template>
  <q-card-section v-if="mode === 'select'">
    <q-btn
      class="full-width godown"
      color="green"
      label="Submit"
      :disabled="paths.length === 0"
      @click="submit"
    />
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
import * as Api from "../../api";
import { mapState } from "vuex";
export default {
  name: "AddRoute",
  data() {
    return {
      paths: [],
      mode: "select"
    };
  },
  computed: {
    ...mapState("user", ["accessToken"]),
    ...mapState("map", ["mapInstance"])
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
    },
    async submit() {
      this.paths.forEach(path => {
        const { origin, destination, polyLine } = path;
        if (origin && origin.marker) {
          this.mapInstance.removeLayer(origin.marker);
          delete path.origin.marker;
        }
        if (destination && destination.marker) {
          this.mapInstance.removeLayer(destination.marker);
          delete path.destination.marker;
        }
        if (polyLine) {
          this.mapInstance.removeLayer(polyLine);
          delete path.polyLine;
        }
      });
      this.$q
        .dialog({
          title: "Confirm",
          message:
            "Submitting a fake route would result to a permanent ban. Would you like to continue?",
          ok: {
            push: true
          },
          cancel: {
            color: "negative"
          },
          persistent: true
        })
        .onOk(async () => {
          try {
            await Api.saveRoute({
              paths: this.paths,
              accessToken: this.accessToken
            });
            this.$q.notify({
              message: "Successfully created route",
              color: "positive",
              position: "top"
            });
          } catch (error) {
            this.$q.notify({
              message: "Create route failed",
              color: "negative",
              position: "top"
            });
          }
          this.mapInstance.eachLayer(layer => {
            this.mapInstance.removeLayer(layer);
          });
          this.paths = [];
        });
    },
    reset() {
      this.mapInstance.eachLayer(layer => {
        this.mapInstance.removeLayer(layer);
      });
      this.paths = [];
    }
  }
};
</script>

<style></style>
