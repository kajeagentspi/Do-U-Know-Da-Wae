<template>
  <q-card v-if="!drawing">
    <q-card-actions class="navbar">
      <q-btn-group flat>
        <q-btn disabled flat icon="explore" />
        <q-btn label="Search" @click="reset" />
        <q-btn
          label="Contribute"
          @click="changeActive('contribute')"
          v-if="type !== 'viewer'"
        />
        <q-btn label="User" @click="changeActive('user')" />
        <q-btn
          label="Admin"
          v-if="type === 'admin'"
          @click="changeActive('admin')"
        />
      </q-btn-group>
    </q-card-actions>
    <div v-if="!selectedRoute">
      <q-card-actions v-if="!selectingOrigin && !selectingDestination">
        <q-btn
          class="full-width godown"
          color="dukdw"
          :label="
            origin
              ? `[${origin.type}] ${
                  origin.name.length > 30
                    ? `${origin.name.slice(0, 30)}...`
                    : `${origin.name}`
                }`
              : 'Select Origin'
          "
          no-ripple
          size="l"
          @click="select('origin')"
        />
        <q-btn
          class="full-width godown"
          color="dukdw"
          :label="
            destination
              ? `[${destination.type}] ${
                  destination.name.length > 30
                    ? `${destination.name.slice(0, 30)}...`
                    : `${destination.name}`
                }`
              : 'Select Destination'
          "
          no-ripple
          size="l"
          @click="select('destination')"
        />
      </q-card-actions>
      <q-card-section v-else-if="selectingOrigin || selectingDestination">
        <q-input
          v-model="name"
          outlined
          label="Search for a Room, Building, Stop"
          debounce="500"
          :rules="[POISearch]"
          class="godown"
        />
        <q-btn
          class="full-width godown"
          color="dukdw"
          icon="gps_fixed"
          label="Use Current Location"
          :disable="!GPSAvailable"
          @click="useGPS"
        />
        <q-btn
          class="full-width"
          color="dukdw"
          icon="place"
          label="Place A Marker"
          @click="useMarker"
        />
      </q-card-section>
      <div class="route-body" v-if="!selectingOrigin && !selectingDestination">
        <route-card
          v-for="(route, index) in routes"
          :key="index"
          :index="index"
          :route="route"
          @highlight="highlight"
          @setRoute="setRoute"
        />
      </div>
      <div class="poi-body" v-if="selectingOrigin || selectingDestination">
        <poi-item
          v-for="(poi, index) in pois"
          :key="index"
          :poi="poi"
          @viewPOI="viewPOI"
          @selectPOI="selectPOI"
        />
      </div>
    </div>
    <div v-else>
      <q-card-section>
        <q-btn
          class="full-width godown"
          color="dukdw"
          @click="setRoute"
          label="Go back to results"
        />
        <q-btn
          class="full-width godown"
          color="dukdw"
          @click="highlight({ routeIndex: selectedRouteIndex })"
          label="View full route in map"
        />
        <q-btn
          class="full-width godown"
          color="dukdw"
          @click="bookmark"
          label="Add to bookmarks"
          v-if="isAuthenticated && selectedRoute.id"
        />
        <q-btn
          class="full-width godown"
          color="dukdw"
          @click="report"
          label="Report"
          v-if="isAuthenticated && selectedRoute.id"
        />
      </q-card-section>
      <div class="path-body" v-if="selectedRoute">
        <path-card
          v-for="(path, index) in selectedRoute.paths"
          :key="index"
          :path="path"
          :index="index"
          :routeIndex="selectedRouteIndex"
          @highlight="highlight"
        />
      </div>
    </div>
  </q-card>
</template>

<script>
import { CHANGE_VIEW } from "../../store/types";
import { mapState, mapMutations, mapActions } from "vuex";
import { mapFields } from "vuex-map-fields";
import * as Api from "../../api";
import L from "leaflet";

export default {
  name: "SearchPanel",
  computed: {
    ...mapState("map", ["mapInstance", "GPSAvailable", "userMarker"]),
    ...mapFields("map", ["marker", "drawing", "viewing", "active"]),
    ...mapState("user", ["type", "isAuthenticated"])
  },
  data() {
    return {
      origin: null,
      destination: null,
      selectingOrigin: false,
      selectingDestination: false,
      name: "",
      pois: [],
      routes: [],
      selectedRoute: null,
      selectedRouteIndex: null
    };
  },
  methods: {
    ...mapMutations("map", {
      changeView: CHANGE_VIEW
    }),
    ...mapActions("map", ["drawRoutes", "removeRoutes"]),
    select(endType) {
      if (endType === "origin") {
        this.selectingOrigin = true;
        this.selectingDestination = false;
      } else {
        this.selectingOrigin = false;
        this.selectingDestination = true;
      }
    },
    viewPOI(poi) {
      if (this.selectingOrigin) {
        this.setOrigin(poi);
      } else {
        this.setDestination(poi);
      }
      this.setView();
    },
    selectPOI(poi) {
      if (this.selectingOrigin) {
        this.selectingOrigin = false;
        this.setOrigin(poi);
      } else {
        this.selectingDestination = false;
        this.setDestination(poi);
      }
      this.name = "";
      this.pois = [];
      this.setView();
      if (this.origin && this.destination) {
        const origin = { ...this.origin };
        const destination = { ...this.destination };
        delete origin.marker;
        delete destination.marker;
        this.routeSearch(origin, destination);
      }
    },
    setView() {
      if (this.origin && this.destination) {
        this.changeView({
          coordinates: [
            { lat: this.origin.lat, lng: this.origin.lng },
            { lat: this.destination.lat, lng: this.destination.lng }
          ]
        });
      } else if (this.origin) {
        this.changeView({
          coordinates: [{ lat: this.origin.lat, lng: this.origin.lng }]
        });
      } else {
        this.changeView({
          coordinates: [
            { lat: this.destination.lat, lng: this.destination.lng }
          ]
        });
      }
    },
    setOrigin(poi) {
      let { lat, lng } = poi;
      if (this.origin) {
        const { marker } = this.origin;
        marker.setLatLng({ lat, lng });
        this.origin = { ...poi, marker };
      } else {
        this.origin = poi;
        this.origin.marker = new L.Marker({ lat, lng }).addTo(this.mapInstance);
      }
    },
    setDestination(poi) {
      let { lat, lng } = poi;
      if (this.destination) {
        const { marker } = this.destination;
        marker.setLatLng({ lat, lng });
        this.destination = { ...poi, marker };
      } else {
        this.destination = poi;
        this.destination.marker = new L.Marker({ lat, lng }).addTo(
          this.mapInstance
        );
      }
    },
    async report() {
      const { data } = await Api.reportRoute({
        routeId: this.selectedRoute.id
      });
      this.$q.notify(data);
    },
    async bookmark() {
      const { data } = await Api.bookmarkRoute({
        routeId: this.selectedRoute.id
      });
      this.$q.notify(data);
    },
    async useGPS() {
      const { lat, lng } = this.userMarker.getLatLng();
      const { data: poi } = await Api.identifyBuilding({ lat, lng });
      this.selectPOI(poi);
    },
    async useMarker() {
      this.drawing = true;
      this.mapInstance.editTools.startMarker();
    },
    async POISearch(name) {
      return Api.allPOI({ name })
        .then(result => {
          this.pois = result.data;
        })
        .catch(() => {
          this.$q.notify({
            message: "An error occured",
            color: "negative",
            position: "top"
          });
        });
    },
    async routeSearch(origin, destination) {
      try {
        const { data } = await Api.allRoute({ origin, destination });
        this.routes = this.removeRoutes({ routes: this.routes });
        this.routes = data;
        this.routes = await this.drawRoutes({ routes: this.routes });
      } catch (error) {
        this.$q.notify({
          message: "An error occured",
          color: "negative",
          position: "top"
        });
        console.log(error);
      }
    },
    highlight({ routeIndex, pathIndex }) {
      if (isNaN(routeIndex) && isNaN(pathIndex)) {
        this.changeView({
          coordinates: [
            {
              lat: this.routes[routeIndex].origin.lat,
              lng: this.routes[routeIndex].origin.lng
            },
            {
              lat: this.routes[routeIndex].destination.lat,
              lng: this.routes[routeIndex].destination.lng
            }
          ]
        });
        this.routes.forEach(route => {
          route.paths.forEach(path => {
            path.originMarker.setOpacity(1);
            path.destinationMarker.setOpacity(1);
            if (path.polyLine) {
              path.polyLine.setStyle({ opacity: 1 });
            }
          });
        });
      } else if (!isNaN(routeIndex) && isNaN(pathIndex)) {
        this.changeView({
          coordinates: [
            {
              lat: this.routes[routeIndex].origin.lat,
              lng: this.routes[routeIndex].origin.lng
            },
            {
              lat: this.routes[routeIndex].destination.lat,
              lng: this.routes[routeIndex].destination.lng
            }
          ]
        });
        for (let i = 0; i < this.routes.length; i++) {
          if (i === routeIndex) {
            this.routes[i].paths.forEach(path => {
              console.log(path);
              path.originMarker.setOpacity(1);
              path.destinationMarker.setOpacity(1);
              if (path.polyLine) {
                path.polyLine.setStyle({ opacity: 1 });
              }
            });
          } else {
            this.routes[i].paths.forEach(path => {
              path.originMarker.setOpacity(0);
              path.destinationMarker.setOpacity(0);
              if (path.polyLine) {
                path.polyLine.setStyle({ opacity: 0 });
              }
            });
          }
        }
      } else {
        let activePath;
        for (let i = 0; i < this.routes.length; i++) {
          if (i === routeIndex) {
            for (let j = 0; j < this.routes[i].paths.length; j++) {
              if (j === pathIndex) {
                activePath = this.routes[i].paths[j];
                if (this.routes[i].paths[j].polyLine) {
                  this.routes[i].paths[j].originMarker.setOpacity(1);
                  this.routes[i].paths[j].destinationMarker.setOpacity(1);
                  this.routes[i].paths[j].polyLine.setStyle({
                    opacity: 1
                  });
                }
              } else {
                if (this.routes[i].paths[j].polyLine) {
                  this.routes[i].paths[j].originMarker.setOpacity(0);
                  this.routes[i].paths[j].destinationMarker.setOpacity(0);
                  this.routes[i].paths[j].polyLine.setStyle({
                    opacity: 0
                  });
                }
              }
            }
          } else {
            this.routes[i].paths.forEach(path => {
              if (path.polyLine) {
                path.polyLine.setStyle({ opacity: 0 });
              }
            });
          }
        }
        this.changeView({
          coordinates: [
            {
              lat: activePath.origin.lat,
              lng: activePath.origin.lng
            },
            {
              lat: activePath.destination.lat,
              lng: activePath.destination.lng
            }
          ]
        });
      }
    },
    reset() {
      if (this.origin) {
        this.mapInstance.removeLayer(this.origin.marker);
      }
      if (this.destination) {
        this.mapInstance.removeLayer(this.destination.marker);
      }
      console.log(this.routes);
      this.routes = this.removeRoutes({ routes: this.routes });
      this.origin = null;
      this.destination = null;
      this.selectingOrigin = false;
      this.selectingDestination = false;
      this.name = "";
      this.pois = [];
      this.routes = null;
      this.selectedRoute = null;
    },
    setRoute(routeIndex) {
      if (isNaN(routeIndex)) {
        this.selectedRoute = null;
        this.selectedRouteIndex = null;
        this.viewing = false;
      } else {
        this.selectedRoute = this.routes[routeIndex];
        this.selectedRouteIndex = routeIndex;
        this.viewing = true;
      }
    },
    changeActive(pageName) {
      this.active = pageName;
    }
  },
  watch: {
    async marker(newValue) {
      this.mapInstance.removeLayer(newValue);
      const { lat, lng } = newValue.getLatLng();
      const { data: poi } = await Api.identifyBuilding({ lat, lng });
      this.selectPOI(poi);
    }
  },
  beforeDestroy() {
    this.reset();
  }
};
</script>

<style lang="scss" scoped>
.swap {
  width: 74px;
  height: 72px;
}
.route-body {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  position: absolute;
  top: 150px;
  bottom: 0;
  left: 0;
  right: 0;
}
.poi-body {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  position: absolute;
  top: 244px;
  bottom: 0;
  left: 0;
  right: 0;
}
.path-body {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  position: absolute;
  top: 248px;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
