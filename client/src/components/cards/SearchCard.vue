<template>
  <q-item clickable @click="setView">
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
import { mapMutations } from "vuex";
import { CHANGE_VIEW } from "../../store/types";
export default {
  name: "SearchCard",
  props: ["result"],
  methods: {
    ...mapMutations("map", {
      changeView: CHANGE_VIEW
    }),
    setView() {
      const { coordinates, lat, lng } = this.result;
      this.changeView({ coordinates, lat, lng });
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
