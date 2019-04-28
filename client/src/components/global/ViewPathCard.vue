<template>
  <q-card class="card">
    <q-card-section>
      <q-input
        outlined
        label="Destination"
        readonly
        :value="path.destination.name"
      />
      <q-input outlined label="Type" readonly :value="path.type" />
      <q-input outlined label="Origin" readonly :value="path.origin.name" />
    </q-card-section>
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

<style></style>
