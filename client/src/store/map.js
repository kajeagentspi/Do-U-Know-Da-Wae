import { getField, updateField } from 'vuex-map-fields';
import L from 'leaflet';
import {
  GET_MAP,
  REMOVE_LAYER,
  ADD_LAYER,
} from './types';

const map = {
  namespaced: true,
  state: {
    mapInstance: null,
  },
  getters: {
    getField,
  },
  mutations: {
    updateField,
    [GET_MAP]: (state) => {
      state.mapInstance = L.map('map', {
        zoomControl: false,
        minZoom: 15,
        maxZoom: 21,
        maxBounds: [
          { lat: 14.171030846860607, lng: 121.26183271408082 },
          { lat: 14.150870198219486, lng: 121.22063398361207 }],
        editable: true,
      });
      state.mapInstance.setView([14.1648, 121.2413], 19);
      L.mapboxGL({
        attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">© MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap contributors</a>',
        accessToken: 'not-needed',
        style: 'https://maps.tilehosting.com/styles/bright/style.json?key=4krAogjdNdbE796RetO6',
      }).addTo(state.mapInstance);
    },
    [REMOVE_LAYER]: (state, payload) => {
      const { layer } = payload;
      state.mapInstance.removeLayer(layer);
    },
    [ADD_LAYER]: (state, payload) => {
      const { layer } = payload;
      layer.addTo(state.mapInstance);
    },
  },
  actions: {
  },
};
export default map;
