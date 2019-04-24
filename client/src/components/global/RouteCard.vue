<template>
  <q-card
    class="card"
    @click="setRoute"
    @mouseover="highLight({ routeIndex: index })"
    @mouseleave="highLight"
  >
    <q-card-section class="text-h6">
      <p class="text-h6">Route Summary</p>
      <p class="text-subtitle2">{{`Total Distance: ${route.distance}m`}}</p>
      <p class="text-subtitle2">{{`Departure Time: ${timeStart}`}}</p>
      <p class="text-subtitle2">{{`Arrival Time: ${timeEnd}`}}</p>
    </q-card-section>
  </q-card>
</template>

<script>
import moment from "moment";

export default {
  name: "RouteCard",
  props: ["route", "index"],
  data() {
    return {
      timeStart: "",
      timeEnd: ""
    };
  },
  methods: {
    highLight(data) {
      this.$emit("highLight", data);
    },
    setRoute() {
      this.$emit("setRoute", this.index);
    }
  },
  mounted() {
    this.timeStart = moment().format("LT");
    this.timeEnd = moment()
      .add(this.route.duration, "seconds")
      .format("LT");
  }
};
</script>

<style>
</style>
