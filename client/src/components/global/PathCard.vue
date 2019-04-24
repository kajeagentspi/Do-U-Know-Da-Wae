<template>
  <q-card
    class="card"
    @mouseover="highLight({ routeIndex: routeIndex, pathIndex: index })"
    @mouseleave="highLight({ routeIndex: routeIndex })"
  >
    <q-card-section v-if="path.type==='indoor'">
      <p class="text-h6">{{path.instructions}}</p>
    </q-card-section>
    <q-card-section v-else-if="path.type==='walking'">
      <p
        class="text-h6"
      >{{`Walk ${path.distance}m from ${path.origin.name} to ${path.destination.name}`}}</p>
    </q-card-section>
    <q-card-section v-else-if="path.type==='jeep'">
      <p class="text-h6">{{`Ride a jeepney from ${path.origin.name} to ${path.destination.name}`}}</p>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: "PathCard",
  props: ["path", "index", "routeIndex"],
  methods: {
    highLight(data) {
      this.$emit("highLight", data);
    }
  }
};
</script>

<style>
</style>
