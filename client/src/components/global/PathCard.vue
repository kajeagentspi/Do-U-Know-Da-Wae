<template>
  <q-card
    class="card cursor-pointer"
    @click="highlight({ routeIndex: routeIndex, pathIndex: index })"
  >
    <q-card-section v-if="path.type === 'indoor'">
      <p class="text-h6">{{ path.instructions }}</p>
    </q-card-section>
    <q-card-section v-else-if="path.type === 'walking'">
      <p class="text-h6">
        {{
          `Walk ${path.distance}m from ${path.origin.name} to ${
            path.destination.name
          }`
        }}
      </p>
    </q-card-section>
    <q-card-section v-else-if="path.type === 'jeep'">
      <p class="text-h6 ">
        {{
          `Ride a jeep from ${path.origin.name} ${caps(path.origin.direction)} Stop to ${path.destination.name} ${caps(path.destination.direction)} Stop`
        }}
      </p>
    </q-card-section>
  </q-card>
</template>

<script>
import { format } from 'quasar'
const { capitalize } = format

export default {
  name: "PathCard",
  props: ["path", "index", "routeIndex"],
  methods: {
    highlight(data) {
      this.$emit("highlight", data);
    },
    caps(text){
      return capitalize(text)
    }
  }
};
</script>

<style></style>
