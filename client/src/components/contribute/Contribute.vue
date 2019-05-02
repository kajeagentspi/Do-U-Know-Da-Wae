<template>
  <q-card v-if="!drawing">
    <q-card-actions class="navbar">
      <q-btn-group flat>
        <q-btn disabled flat icon="explore" />
        <q-btn label="Search" @click="changeActive('search')" />
        <q-btn label="Contribute" @click="reset" v-if="type !== 'viewer'" />
        <q-btn label="User" @click="changeActive('user')" />
        <q-btn
          label="Admin"
          v-if="type === 'admin'"
          @click="changeActive('admin')"
        />
      </q-btn-group>
    </q-card-actions>
    <div v-if="page === 'select' && !selectedRoute">
      <q-card-section>
        <q-btn
          class="full-width godown"
          color="dukdw"
          label="Add Route"
          @click="changePage('addroute')"
        />
      </q-card-section>
      <q-separator />
      <div class="text-subtitle2 godown">Contributions</div>
      <div class="route-body">
        <route-card
          v-for="(route, index) in contributions"
          :key="index"
          :index="index"
          :route="route"
          @highlight="highlight"
          @setRoute="setRoute"
        />
      </div>
    </div>
    <add-route v-else-if="page === 'addroute'" />
    <div v-else-if="page === 'select' && selectedRoute">
      <q-card-section>
        <q-btn
          class="full-width godown"
          color="dukdw"
          @click="setRoute"
          label="Go back"
        />
        <q-btn
          class="full-width godown"
          color="dukdw"
          label="View full route"
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
import { mapFields } from "vuex-map-fields";
import { mapState, mapActions, mapMutations } from "vuex";
import { CHANGE_VIEW } from "../../store/types";
import * as Api from "../../api";

export default {
  name: "Contribute",
  computed: {
    ...mapFields("map", ["marker", "drawing", "viewing", "active"]),
    ...mapState("user", ["type"])
  },
  data() {
    return {
      page: "select",
      email: "",
      permissionLevel: "viewer",
      contributions: [],
      selectedRoute: null,
      selectedRouteIndex: null
    };
  },
  mounted() {
    this.drawContributions();
  },
  methods: {
    ...mapMutations("map", {
      changeView: CHANGE_VIEW
    }),
    ...mapActions("map", ["drawRoutes", "removeRoutes"]),
    async drawContributions() {
      try {
        const {
          data: { contributions }
        } = await Api.getUser();
        this.routes = this.removeRoutes({ routes: this.contributions });
        this.contributions = contributions;
        this.routes = await this.drawRoutes({ routes: this.contributions });
      } catch (error) {
        this.$q.notify({
          message: "An error occured",
          color: "negative",
          position: "top"
        });
      }
    },
    changePage(pageName) {
      this.page = pageName;
      this.contributions = this.removeRoutes({ routes: this.contributions });
      this.selectedRoute = null;
      this.selectedRouteIndex = null;
    },
    changeActive(pageName) {
      this.active = pageName;
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
    setRoute(routeIndex) {
      if (isNaN(routeIndex)) {
        this.selectedRoute = null;
        this.selectedRouteIndex = null;
        this.viewing = false;
      } else {
        this.selectedRoute = this.contributions[routeIndex];
        this.selectedRouteIndex = routeIndex;
        this.viewing = true;
      }
    },
    reset() {
      this.page = "select";
      this.contributions = this.removeRoutes({ routes: this.contributions });
      this.selectedRoute = null;
      this.selectedRouteIndex = null;
      this.drawContributions();
    }
  },
  watch: {},
  beforeDestroy() {
    this.reset();
  }
};
</script>

<style lang="scss" scoped>
.path-body {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  position: absolute;
  top: 166px;
  bottom: 0;
  left: 0;
  right: 0;
}
.route-body {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  position: absolute;
  top: 153px;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
