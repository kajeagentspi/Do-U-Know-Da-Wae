<template>
  <q-card v-if="!drawing">
    <q-card-actions class="navbar">
      <q-btn-group flat>
        <q-btn disabled flat icon="explore" />
        <q-btn label="Search" @click="reset" />
        <q-btn
          label="Contribute"
          @click="changeActive('contribute')"
          :disable="type !== 'admin' && type !== 'contributor'"
        />
        <q-btn label="User" @click="changeActive('user')" />
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
          @highLight="highLight"
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
          @click="highLight({ routeIndex: selectedRouteIndex })"
          label="View full route"
        />
        <q-btn
          class="full-width godown"
          color="dukdw"
          @click="bookmark"
          label="Add to bookmarks"
        />
      </q-card-section>
      <div class="path-body" v-if="selectedRoute">
        <path-card
          v-for="(path, index) in selectedRoute.paths"
          :key="index"
          :path="path"
          :index="index"
          :routeIndex="selectedRouteIndex"
          @highLight="highLight"
        />
      </div>
    </div>
  </q-card>
</template>

<script>
import { CHANGE_VIEW } from "../../store/types";
import { mapState, mapMutations } from "vuex";
import { mapFields } from "vuex-map-fields";
import * as Api from "../../api";
import randomColor from "random-color";
import L from "leaflet";

export default {
  name: "Search",
  computed: {
    ...mapState("map", ["mapInstance", "GPSAvailable", "userMarker"]),
    ...mapFields("map", ["marker", "drawing", "viewing", "active"]),
    ...mapState("user", ["type", "accessToken"])
  },
  data() {
    return {
      origin: null,
      destination: null,
      selectingOrigin: false,
      selectingDestination: false,
      name: null,
      pois: null,
      routes: null,
      selectedRoute: null,
      selectedRouteIndex: null
    };
  },
  methods: {
    ...mapMutations("map", {
      changeView: CHANGE_VIEW
    }),
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
    async bookmark() {
      const { data } = await Api.bookmarkRoute({
        accessToken: this.accessToken,
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
      const colors = [];
      const { data } = await Api.allRoute({ origin, destination });
      if (this.routes) {
        this.routes.forEach(route => {
          route.paths.forEach(path => {
            if (path.polyLine) {
              this.mapInstance.removeLayer(path.polyLine);
            }
          });
        });
      }
      this.routes = data.map(route => {
        let color = randomColor().hexString();
        while (color in colors) {
          color = randomColor(0.99, 0.99).hexString();
        }
        route.color = color;
        route.paths.forEach(path => {
          if (path.latLngs) {
            path.polyLine = L.polyline(path.latLngs, {
              color
            }).addTo(this.mapInstance);
          }
        });
        return route;
      });
    },
    highLight({ routeIndex, pathIndex }) {
      if (isNaN(routeIndex) && isNaN(pathIndex)) {
        this.setView();
        this.routes.forEach(route => {
          route.paths.forEach(path => {
            if (path.polyLine) {
              path.polyLine.setStyle({ opacity: 1 });
            }
          });
        });
      } else if (!isNaN(routeIndex) && isNaN(pathIndex)) {
        this.setView();
        for (let i = 0; i < this.routes.length; i++) {
          if (i === routeIndex) {
            this.routes[i].paths.forEach(path => {
              if (path.polyLine) {
                path.polyLine.setStyle({ opacity: 1 });
              }
            });
          } else {
            this.routes[i].paths.forEach(path => {
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
                  this.routes[i].paths[j].polyLine.setStyle({
                    opacity: 1
                  });
                }
              } else {
                if (this.routes[i].paths[j].polyLine) {
                  this.routes[i].paths[j].polyLine.setStyle({
                    opacity: 0.5
                  });
                }
              }
            }
          } else {
            this.routes[i].paths.forEach(path => {
              if (path.latLngs) {
                path.polyLine.setStyle({ opacity: 0 });
              }
            });
          }
        }
        console.log(activePath);
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
      if (this.routes) {
        this.routes.forEach(route => {
          route.paths.forEach(path => {
            if (path.polyLine) {
              this.mapInstance.removeLayer(path.polyLine);
            }
          });
        });
      }
      this.origin = null;
      this.destination = null;
      this.selectingOrigin = false;
      this.selectingDestination = false;
      this.name = null;
      this.pois = null;
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
  top: 207px;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
