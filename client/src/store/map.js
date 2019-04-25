import L from "leaflet";
import { Notify } from "quasar";
import { getField, updateField } from "vuex-map-fields";
import {
  INITIALIZE_MAP,
  CHANGE_VIEW,
  SET_LOCATION,
  REMOVE_LAYER,
  SET_MAP_PROPERTY,
  ADD_LAYER
} from "./types";
import * as Api from "../api";
import router from "../router";

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

    [SET_MAP_PROPERTY]: (state, payload) => {
      const { pairs, key, value } = payload;
      if (pairs) {
        pairs.forEach(pair => {
          state[pair.key] = pair.value;
        });
      } else {
        state[key] = value;
      }
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
    },

    [REMOVE_LAYER]: (state, payload) => {
      const { layers, layer } = payload;
      if (layers) {
        layers.forEach(layer => {
          state.mapInstance.removeLayer(layer);
        });
      } else {
        state.mapInstance.removeLayer(layer);
      }
    },

    [ADD_LAYER]: (state, payload) => {
      const { layers, layer } = payload;
      if (layers) {
        layers.forEach(layer => {
          layer.addTo(state.mapInstance);
        });
      } else {
        layer.addTo(state.mapInstance);
      }
    },

    [SET_LOCATION]: (state, payload) => {
      const { locationType, type, ...data } = payload;
      state.routes.forEach(route => {
        route.paths.forEach(path => {
          state.mapInstance.removeLayer(path.polyLine);
        });
      });
      state.routes = [];
      if (type === "null") {
        if (locationType === "origin") {
          if (state.originMarker) {
            state.mapInstance.removeLayer(state.originMarker);
          }
          state.originMarker = null;
          state.origin = null;
        } else {
          if (state.destinationMarker) {
            state.mapInstance.removeLayer(state.destinationMarker);
          }
          state.destinationMarker = null;
          state.destination = null;
        }
      } else {
        let lat;
        let lng;
        if (type !== "Room") {
          lat = data.lat;
          lng = data.lng;
        } else if (type === "Room") {
          lat = data.building.lat;
          lng = data.building.lng;
        }

        if (locationType === "origin") {
          if (state.originMarker) {
            state.originMarker.setLatLng({
              lat,
              lng
            });
          } else {
            state.originMarker = new L.Marker({
              lat,
              lng
            }).addTo(state.mapInstance);
          }
          state.origin = { ...payload };
        } else if (locationType === "destination") {
          if (state.destinationMarker) {
            state.destinationMarker.setLatLng({
              lat,
              lng
            });
          } else {
            state.destinationMarker = new L.Marker({
              lat,
              lng
            }).addTo(state.mapInstance);
          }
          state.destination = { ...payload, lat, lng };
        }
        router.push({
          name: "RouteScreen"
        });
      }
    }
  },
  actions: {
    buildingSearch: async (context, payload) => {
      context.commit(SET_MAP_PROPERTY, { key: "buildings", value: [] });
      return Api.getBuildings({ name: payload })
        .then(result => {
          context.commit(SET_MAP_PROPERTY, {
            key: "buildings",
            value: result.data
          });
        })
        .catch(error => {
          console.log(error);
          Notify.create({
            message: "An error occured",
            color: "negative",
            position: "top"
          });
        });
    },
    identifyBuilding: async (context, payload) => {
      const {
        MarkerPathOrigin,
        MarkerPathDestination,
        paths,
        mapInstance
      } = context.state;
      const [path, ...others] = paths;
      const { lat, lng } = payload;
      const pairs = [];
      const { data } = await Api.getBuildingIdentify({ lat, lng });
      if (MarkerPathOrigin) {
        pairs.push({ key: "MarkerPathOrigin", value: false });
      }
      if (MarkerPathDestination) {
        pairs.push({ key: "MarkerPathDestination", value: false });
      }
      if (data.message) {
        pairs.push({ key: "buildings", value: [] });
        Notify.create({
          message: "No building found",
          color: "negative",
          position: "top"
        });
      } else {
        const { lat, lng } = data;
        if (MarkerPathOrigin) {
          path.origin = data;
          path.originMarker = new L.Marker({ lat, lng }).addTo(mapInstance);
          pairs.push({ key: "paths", value: [path, ...others] });
        }
        if (MarkerPathDestination) {
          path.destination = data;
          path.destinationMarker = new L.Marker({ lat, lng }).addTo(
            mapInstance
          );
          pairs.push({ key: "paths", value: [path, ...others] });
        }
        pairs.push({ key: "buildings", value: [data] });
      }
      context.commit(SET_MAP_PROPERTY, { pairs });
      const { origin, destination, type, mode } = path;
      console.log(path);
      if (origin && destination) {
        if (type === "Walking" && mode === "auto") {
          const { data } = await Api.getRoutes({
            origin,
            destination
          });
          console.log(data);
        }
      }
    },
    createRoom: async (context, data) => {
      try {
        const { name, buildingName } = data;
        const { accessToken } = context.rootState.auth;
        await Api.addRoom({ ...data, accessToken });
        Notify.create({
          message: `Successfully created room ${name} on ${buildingName}`,
          color: "positive",
          position: "top"
        });
      } catch (error) {
        console.log(error);
        Notify.create({
          message: "An error occured",
          color: "negative",
          position: "top"
        });
      }
    },
    initializeMap: async context => {
      context.commit(INITIALIZE_MAP);
    }
  }
};

export default map;
