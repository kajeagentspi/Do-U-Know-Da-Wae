<template>
  <q-card id="map"></q-card>
</template>

<script>
export default {
  name: 'Map',
};
</script>

<style>
  @media (max-width: 640px) {
    #map {
      width: 100%;
      height: 40%;
      top: 0px;
      position: absolute;
      z-index: 0;
    }
  }
  @media (min-width: 641px) {
    #map {
      width: calc(100% - 380px - 3vh);
      top: 1vh;
      right: 1vh;
      bottom: 1vh;
      position: absolute;
      z-index: 0;
    }
  }
</style>
