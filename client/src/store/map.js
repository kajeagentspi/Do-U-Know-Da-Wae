import L from "leaflet";
import { Notify } from "quasar";
import { getField, updateField } from "vuex-map-fields";
import {
  INITIALIZE_MAP,
  CHANGE_VIEW,
  SET_LOCATION,
  REMOVE_LAYER,
  SET_MAP_PROPERTY
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

    origin: null,
    originMarker: null,
    destination: null,
    destinationMarker: null,

    userMarker: null,
    GPSEnabled: false,
    GPSOrigin: false,
    GPSDestination: false,
    MarkerOrigin: false,
    MarkerDestination: false,

    name: "",
    routes: [],
    pois: []
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
      let { coordinates, type } = payload;
      const { mapTop, mapLeft, mapRight, mapBottom } = state;
      const { x, y } = state.mapInstance.getSize();
      const padding = {
        paddingTopLeft: [mapLeft, mapTop],
        paddingBottomRight: [x - mapRight, y - mapBottom]
      };
      if (type === "marker") {
        state.mapInstance.flyToBounds(coordinates, {
          ...padding
        });
      }
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

    [SET_LOCATION]: (state, payload) => {
      const { locationType, type, ...data } = payload;
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
    allSearch: async (context, payload) => {
      context.commit(SET_MAP_PROPERTY, { key: "pois", value: [] });
      return Api.getAll({ name: payload })
        .then(result => {
          context.commit(SET_MAP_PROPERTY, {
            key: "pois",
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
    initializeMap: async context => {
      context.commit(INITIALIZE_MAP);
      // const { mapInstance } = context.state;
      // const { data } = await Api.getExits();
      // const exitIcon = L.divIcon({
      //   html: '<i class="fa fa-circle" style="color: red"></i>',
      //   iconSize: [20, 20],
      //   className: "icon"
      // });
      // data.forEach(exit => {
      //   new L.Marker(exit, { icon: exitIcon })
      //     .addTo(mapInstance)
      //     .on("click", e => {});
      // });
    },
    locateUser: context => {
      const { userMarker } = context.state;
      context.commit(CHANGE_VIEW, {
        coordinates: [userMarker.getLatLng()],
        type: "marker"
      });
    },
    reverseGeocode: async (context, payload) => {
      const { lat, lng, locationType } = payload;
      const { origin, destination } = context.state;
      try {
        const {
          data: { display_name }
        } = await Api.reverseGeocode({ lat, lng });
        const name = display_name
          .split(", ")
          .slice(0, 2)
          .join(", ");

        if (locationType === "origin" && destination) {
          context.commit(CHANGE_VIEW, {
            coordinates: [
              { lat: destination.lat, lng: destination.lng },
              { lat, lng }
            ],
            type: "marker"
          });
        } else if (locationType === "destination" && origin) {
          context.commit(CHANGE_VIEW, {
            coordinates: [{ lat: origin.lat, lng: origin.lng }, { lat, lng }],
            type: "marker"
          });
        } else {
          context.commit(CHANGE_VIEW, {
            coordinates: [{ lat, lng }],
            type: "marker"
          });
        }

        context.commit(SET_LOCATION, {
          ...payload,
          name
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
    viewSearch: async (context, payload) => {
      const { origin, destination } = context.state;
      let { locationType, type } = payload;
      if (!type) {
        type = "Building";
      }
      let lat;
      let lng;
      if (type !== "Room") {
        lat = payload.lat;
        lng = payload.lng;
      } else if (type === "Room") {
        lat = payload.building.lat;
        lng = payload.building.lng;
      }
      if (locationType === "origin" && destination) {
        context.commit(CHANGE_VIEW, {
          coordinates: [
            { lat: destination.lat, lng: destination.lng },
            { lat, lng }
          ],
          type: "marker"
        });
      } else if (locationType === "destination" && origin) {
        context.commit(CHANGE_VIEW, {
          coordinates: [{ lat: origin.lat, lng: origin.lng }, { lat, lng }],
          type: "marker"
        });
      } else {
        context.commit(CHANGE_VIEW, {
          coordinates: [{ lat, lng }],
          type: "marker"
        });
      }
      context.commit(SET_LOCATION, { ...payload, type, lat, lng });
    },
    searchRoutes: async context => {
      const { origin, destination } = context.state;
      try {
        const routes = await Api.getRoutes({ origin, destination });
        context.commit(SET_MAP_PROPERTY, { key: "routes", value: routes });
      } catch (error) {
        console.log(error);
        Notify.create({
          message: "An error occured",
          color: "negative",
          position: "top"
        });
      }
    }
  }
};

export default map;
