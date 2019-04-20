<template>
  <q-card>
    <q-card-section>
      <q-btn class="full-width" label="Select Origin" no-ripple size="l" />
      <q-btn class="full-width" label="Select Destination" no-ripple size="l" />
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: "ItineraryCard"
};
</script>

<style scoped>
.q-card {
  margin: 15px;
  -webkit-border-radius: 0.8rem;
  border-radius: 0.8rem;
}
</style>
