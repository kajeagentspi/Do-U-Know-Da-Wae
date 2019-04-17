<template>
  <q-card inline color="white" text-color="black" class="navigation">
  </q-card>
</template>

<script>
export default {
  name: 'Sidebar',
};
</script>

<style scoped>
  @media (max-width: 640px) {
    .navigation {
      width: 100%;
      height: 60%;
      bottom: 0px;
      z-index: 0;
      position: absolute;
    }
  }
  @media (min-width: 641px) {
    .navigation {
      width: 380px;
      top: 1vh;
      bottom: 1vh;
      left: 1vh;
      z-index: 0;
      position: absolute;
    }
  }
</style>
