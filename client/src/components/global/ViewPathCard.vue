<template>
  <q-card class="card">
    <q-card-section>
      <q-input outlined label="Destination" readonly :value="path.destination.name"/>
      <q-input outlined label="Type" readonly :value="path.type"/>
      <q-input outlined label="Origin" readonly :value="path.origin.name"/>
    </q-card-section>
    <!-- <q-btn class="full-width go" color="dukdw" :label="path.origin.name"/>
    <q-btn class="full-width" color="dukdw" :label="path.destination.name"/>-->
  </q-card>
</template>

<script>
export default {
  name: "ViewPathCard",
  props: ["path"],
  mounted() {
    console.log(this.path);
  }
};
</script>

<style>
</style>
