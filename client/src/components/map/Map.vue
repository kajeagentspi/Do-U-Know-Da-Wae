<template>
  <q-card id="map"></q-card>
</template>

<script>
import L from 'leaflet';
import { mapMutations } from 'vuex';
import { mapFields } from 'vuex-map-fields';
import { GET_MAP } from '../../store/types';

export default {
  name: 'Map',
  computed: {
    ...mapFields('map', ['mapInstance']),
  },
  mounted() {
    this.getMap();
    this.mapInstance.on('editable:drawing:end', this.draw);
  },
  methods: {
    ...mapMutations('map', {
      getMap: GET_MAP,
    }),
    draw({ layer }) {
      if (layer instanceof L.Marker) {
        console.log(layer);
      } else if (layer instanceof L.Polyline) {
        console.log(layer);
      }
    },
  },
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
