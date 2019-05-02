<template>
  <q-card class="card cursor-pointer">
    <q-card-section>
      <q-input
        outlined
        label="Destination"
        readonly
        :value="path.destination.name"
      />
      <q-input
        outlined
        class="text-capitalize"
        label="Type"
        readonly
        :value="path.type"
      />
      <q-input outlined label="Origin" readonly :value="path.origin.name" />
      <q-input
        outlined
        label="Instructions"
        readonly
        v-if="path.type === 'indoor'"
        :value="path.instructions"
      />
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
