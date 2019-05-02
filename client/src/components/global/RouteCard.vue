<template>
  <q-card class="card bg-dukdw text-white cursor-pointer" @click="setRoute">
    <q-card-section class="text-h6">
      <div class="text-h6">Route Summary</div>
      <div class="text-subtitle2">{{ `Origin: ${route.origin.name}` }}</div>
      <div class="text-subtitle2">
        {{ `Destination: ${route.destination.name}` }}
      </div>
      <div class="text-subtitle2">
        {{ `Total Distance: ${route.distance}m` }}
      </div>
      <div class="text-subtitle2">{{ `Departure Time: ${timeStart}` }}</div>
      <div class="text-subtitle2">{{ `Arrival Time: ${timeEnd}` }}</div>
      <div class="text-subtitle2" v-if="!route.id">
        This route is incomplete
      </div>
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
    highlight(data) {
      this.$emit("highlight", data);
    },
    setRoute() {
      this.highlight({ routeIndex: this.index });
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

<style></style>
