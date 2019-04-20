<template>
  <q-item clickable @click="pick">
    <q-item-section avatar>
      <q-avatar
        color="teal"
        text-color="white"
        :icon="
          !result.type
            ? 'fas fa-building'
            : result.type === 'Stop'
            ? 'fas fa-bus'
            : result.type === 'Marker'
            ? 'fas fa-map-marker-alt'
            : 'fas fa-door-open'
        "
      />
    </q-item-section>
    <q-item-section>{{ this.result.name }}</q-item-section>
  </q-item>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "SearchResultCard",
  props: ["result"],
  data() {
    return {
      type: ""
    };
  },
  methods: {
    ...mapActions("map", ["viewSearch"]),
    pick() {
      this.viewSearch({ ...this.result, locationType: this.type });
    }
  },
  mounted() {
    if (this.$route.path === "/origin") {
      this.type = "origin";
    } else {
      this.type = "destination";
    }
  }
};
</script>

<style scoped>
.q-card {
  margin: 15px;
  -webkit-border-radius: 0.8rem;
  border-radius: 0.8rem;
}
</style>
