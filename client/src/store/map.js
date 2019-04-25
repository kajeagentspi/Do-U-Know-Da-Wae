import L from "leaflet";
import { Notify } from "quasar";
import { getField, updateField } from "vuex-map-fields";
import { INITIALIZE_MAP, CHANGE_VIEW } from "./types";
import * as Api from "../api";

const map = {
  namespaced: true,
  state: {
    mapTop: 0,
    mapLeft: 0,
    mapRight: 0,
    mapBottom: 0,

    mapInstance: null,
    active: "search",

    userMarker: null,
    GPSAvailable: false,
    GPSTracking: false,

    marker: null,
    drawing: false,

    viewing: false
  },
  getters: {
    getField
  },
  mutations: {
    updateField,
    [INITIALIZE_MAP]: state => {
      state.mapInstance = L.map("map", {
        zoomControl: false,
        minZoom: 17,
        maxZoom: 21,
        // maxBounds: [
        //   { lat: 14.171030846860607, lng: 121.26183271408082 },
        //   { lat: 14.150870198219486, lng: 121.22063398361207 }
        // ],
        center: { lat: 14.1648, lng: 121.2413 },
        zoom: 16,
        editable: true
      });
      L.mapboxGL({
        attribution:
          '<a href="https://www.maptiler.com/copyright/" target="_blank">© MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap contributors</a>',
        accessToken: "not-needed",
        style:
          "https://maps.tilehosting.com/styles/bright/style.json?key=4krAogjdNdbE796RetO6"
      }).addTo(state.mapInstance);
      state.mapInstance.locate({ watch: true });
    },

    [CHANGE_VIEW]: (state, payload) => {
      let { coordinates } = payload;
      const { mapTop, mapLeft, mapRight, mapBottom } = state;
      const { x, y } = state.mapInstance.getSize();
      const padding = {
        paddingTopLeft: [mapLeft, mapTop],
        paddingBottomRight: [x - mapRight, y - mapBottom]
      };
      state.mapInstance.flyToBounds(coordinates, {
        ...padding
      });
    }
  },
  actions: {
    // createRoom: async (context, data) => {
    //   try {
    //     const { name, buildingName } = data;
    //     const { accessToken } = context.rootState.auth;
    //     await Api.addRoom({ ...data, accessToken });
    //     Notify.create({
    //       message: `Successfully created room ${name} on ${buildingName}`,
    //       color: "positive",
    //       position: "top"
    //     });
    //   } catch (error) {
    //     console.log(error);
    //     Notify.create({
    //       message: "An error occured",
    //       color: "negative",
    //       position: "top"
    //     });
    //   }
    // },
    initializeMap: async context => {
      context.commit(INITIALIZE_MAP);
    }
  }
};

export default map;
