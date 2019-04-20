<template>
  <q-card>
    <q-card-section>
      <q-card-actions>
        <q-btn round icon="navigate_before" :to="`/${this.type}`"/>
        <q-space/>
        <div class="text-h6">{{ `Mark ${this.type}` }}</div>
      </q-card-actions>
      <q-separator spaced/>
      <q-card-section>Choose wisely</q-card-section>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: "PlaceMarkerCard",
  mounted() {
    if (this.$route.path === "/origin/marker") {
      this.type = "origin";
    } else {
      this.type = "destination";
    }
  },
  data() {
    return {
      type: ""
    };
  }
};
</script>

<style>
</style>
