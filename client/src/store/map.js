import { getField, updateField } from "vuex-map-fields";
import L from "leaflet";
import router from "../router";
import {
  GET_MAP,
  REMOVE_LAYER,
  ADD_LAYER,
  UPDATE_POSITION,
  SET_ORIGIN_DESTINATION_POSITION,
  SET_SEARCH_RESULTS,
  CHANGE_VIEW
} from "./types";
import * as Api from "../api";
import { Notify } from "quasar";

const map = {
  namespaced: true,
  state: {
    mapInstance: null,
    userMarker: null,
    GPSOrigin: false,
    GPSDestination: false,
    MarkerOrigin: false,
    MarkerDestination: false,
    originMarker: null,
    origin: null,
    destinationMarker: null,
    destination: null,
    rooms: [],
    glMap: null,
    searchResults: [],
    searchMarker: null,
    searchPolygon: null,
    mapTop: 0,
    mapLeft: 0,
    mapRight: 0,
    mapBottom: 0
  },
  getters: {
    getField
  },
  mutations: {
    updateField,
    [GET_MAP]: state => {
      state.mapInstance = L.map("map", {
        zoomControl: false,
        minZoom: 17,
        maxZoom: 21,
        maxBounds: [
          { lat: 14.171030846860607, lng: 121.26183271408082 },
          { lat: 14.150870198219486, lng: 121.22063398361207 }
        ],
        editable: true,
        trackResize: true
      });
      state.glMap = L.mapboxGL({
        attribution:
          '<a href="https://www.maptiler.com/copyright/" target="_blank">© MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap contributors</a>',
        accessToken: "not-needed",
        style:
          "https://maps.tilehosting.com/styles/bright/style.json?key=4krAogjdNdbE796RetO6"
      }).addTo(state.mapInstance);
      state.mapInstance.setView([14.1648, 121.2413], 17);
      new L.Marker(state.mapInstance.getCenter()).addTo(state.mapInstance);
    },
    [REMOVE_LAYER]: (state, payload) => {
      const { layer } = payload;
      state.mapInstance.removeLayer(layer);
    },
    [ADD_LAYER]: (state, payload) => {
      const { layer } = payload;
      layer.addTo(state.mapInstance);
    },
    [UPDATE_POSITION]: (state, payload) => {
      const { lat, lng } = payload;
      if (state.userMarker) {
        state.userMarker.setLatLng({ lat, lng });
      }
    },
    [SET_ORIGIN_DESTINATION_POSITION]: (state, payload) => {
      const { endType, ...marker } = payload;
      switch (endType) {
        case "Origin":
          if (state.originMarker) {
            state.originMarker.setLatLng({
              lat: marker.lat,
              lng: marker.lng
            });
          } else {
            state.originMarker = new L.Marker({
              lat: marker.lat,
              lng: marker.lng
            }).addTo(state.mapInstance);
            state.originMarker.dragging.disable();
          }
          state.origin = marker;
          break;
        case "Destination":
          if (state.destinationMarker) {
            state.destinationMarker.setLatLng({
              lat: marker.lat,
              lng: marker.lng
            });
          } else {
            state.destinationMarker = new L.Marker({
              lat: marker.lat,
              lng: marker.lng
            }).addTo(state.mapInstance);
            state.destinationMarker.dragging.disable();
          }
          state.destination = marker;
          break;
      }
      const { origin, destination } = state;
      const latLngs = [];
      if (origin) {
        latLngs.push([origin.lat, origin.lng]);
      }
      if (destination) {
        latLngs.push([destination.lat, destination.lng]);
      }
      router.push({
        name: "RouteScreen"
      });
    },
    [SET_SEARCH_RESULTS]: (state, payload) => {
      if (state.searchMarker) {
        state.mapInstance.removeLayer(state.searchMarker);
        state.searchMarker = null;
      }
      if (state.searchPolygon) {
        state.mapInstance.removeLayer(state.searchPolygon);
        state.searchPolygon = null;
      }
      state.searchResults = [...payload];
    },
    [CHANGE_VIEW]: (state, payload) => {
      const { coordinates, lat, lng } = payload;
      if (state.searchMarker) {
        state.mapInstance.removeLayer(state.searchMarker);
        state.searchMarker = null;
      }
      if (state.searchPolygon) {
        state.mapInstance.removeLayer(state.searchPolygon);
        state.searchPolygon = null;
      }
      state.searchMarker = new L.Marker(
        { lat, lng },
        { draggable: false }
      ).addTo(state.mapInstance);
      const { x, y } = state.mapInstance.getSize();
      const { mapTop, mapLeft, mapRight, mapBottom } = state;
      console.log({ x, y });
      console.log({
        mapTop,
        mapLeft,
        mapBottom,
        mapRight
      });
      const padding = {
        paddingTopLeft: [mapLeft, mapTop],
        paddingBottomRight: [x - mapRight, y - mapBottom]
      };
      if (coordinates) {
        state.searchPolygon = L.polygon(coordinates, {
          color: "red"
        }).addTo(state.mapInstance);
        state.mapInstance.flyToBounds(coordinates, {
          ...padding
        });
      } else {
        state.mapInstance.flyToBounds([{ lat, lng }], {
          ...padding
        });
      }
    }
  },
  actions: {
    locateUser: context => {
      const { mapInstance } = context.state;
      mapInstance.locate();
      console.log("test");
    },
    placeMarker: context => {
      const { mapInstance } = context.state;
      mapInstance.editTools.startMarker();
    },
    reverseGeocode: async (context, payload) => {
      const { latLng, endType, type } = payload;
      try {
        const {
          data: { display_name }
        } = await Api.reverseGeocode({ ...latLng });
        const name = display_name
          .split(", ")
          .slice(0, 2)
          .join(", ");
        context.commit(SET_ORIGIN_DESTINATION_POSITION, {
          ...latLng,
          name,
          endType,
          type
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
    allSearch: async (context, payload) => {
      context.commit(SET_SEARCH_RESULTS, []);
      return Api.getAll({ name: payload })
        .then(result => {
          context.commit(SET_SEARCH_RESULTS, result.data);
        })
        .catch(error => {
          console.log(error);
          Notify.create({
            message: "An error occured",
            color: "negative",
            position: "top"
          });
        });
    }
  }
};
export default map;
