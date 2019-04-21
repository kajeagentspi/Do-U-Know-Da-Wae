<template>
  <q-card>
    <q-item
      clickable
      @mouseover="highLight({ routeIndex: index })"
      @mouseleave="highLight"
      @click="selected"
      class="column"
    >
      <q-card-actions class="row">
        <q-btn
          round
          :style="{ 'background-color': route.color }"
          disabled
          class="round-icon"
          :icon="
            path.type === 'Walk'
              ? 'fas fa-walking'
              : path.type === 'Jeep'
              ? 'fas fa-bus'
              : 'fas fa-route'
          "
          v-for="(path, index) in route.paths"
          :key="index"
        />
      </q-card-actions>
      <div class="row">
        <q-item-label class=".q-subheading col-3">{{ timeStart }}</q-item-label>
        <q-linear-progress
          :style="{ color: route.color }"
          :value="100"
          style="height: 5px; margin-top: 5px;"
          class="col-6"
        />
        <q-item-label class=".q-subheading align-right col-3">{{
          timeEnd
        }}</q-item-label>
      </div>
      <q-card-section class="row" style="height: 0px;">
        <div class="col-3"></div>
        <q-item-label class=".q-subheading col-6 align-center">{{
          `${route.distance}m`
        }}</q-item-label>
        <div class="col-3"></div>
      </q-card-section>
    </q-item>
  </q-card>
</template>

<script>
import moment from "moment";
import { mapActions } from "vuex";

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
    ...mapActions("map", ["highLight"]),
    selected() {
      console.log(this.route);
    },
    removeHighlight() {}
  },
  mounted() {
    this.timeStart = moment().format("LT");
    this.timeEnd = moment()
      .add(this.route.duration, "seconds")
      .format("LT");
    console.log(this.index);
  }
};
</script>

<style scoped>
.q-card {
  margin: 15px;
  -webkit-border-radius: 0.8rem;
  border-radius: 0.8rem;
}
.round-icon {
  pointer-events: none;
  opacity: 1 !important;
  cursor: none !important;
  margin: 5px;
}
.align-right {
  text-align: right;
}
.align-center {
  text-align: center;
}
</style>
