<template>
  <div v-if="page === 'select' && !selectedRoute">
    <q-card-section>
      <q-item>
        <q-item-section class="text-h6">Reported Routes</q-item-section>
      </q-item>
    </q-card-section>
    <div class="route-body">
      <route-card
        v-for="(route, index) in reportedRoutes"
        :key="index"
        :index="index"
        :route="route"
        @highlight="highlight"
        @setRoute="setRoute"
      />
      <q-card-section v-if="reportedRoutes.length === 0">
        <q-item>
          <q-item-section class="text-h6">No Reported Routes</q-item-section>
        </q-item>
      </q-card-section>
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
        @click="highlight({ routeIndex: selectedRouteIndex })"
      />
      <q-btn
        class="full-width godown"
        color="dukdw"
        label="Delete Path and Demote Contributor"
        @click="processReport(true)"
      />
      <q-btn
        class="full-width godown"
        color="dukdw"
        label="Delete Report"
        @click="processReport(false)"
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
      reportedRoutes: [],
      selectedRoute: null,
      selectedRouteIndex: null
    };
  },
  mounted() {
    this.drawReportedRoutes();
  },
  methods: {
    ...mapMutations("map", {
      changeView: CHANGE_VIEW
    }),
    ...mapActions("map", ["drawRoutes", "removeRoutes"]),
    async drawReportedRoutes() {
      try {
        const { data } = await Api.reportedRoute();
        this.reportedRoutes = this.removeRoutes({
          routes: this.reportedRoutes
        });
        this.reportedRoutes = data;
        this.reportedRoutes = await this.drawRoutes({
          routes: this.reportedRoutes
        });
      } catch (error) {
        this.$q.notify({
          message: "An error occured",
          color: "negative",
          position: "top"
        });
      }
    },
    async processReport(remove) {
      const { data } = await Api.processReportRoute({
        remove,
        routeId: this.selectedRoute.id
      });
      this.drawReportedRoutes();
      this.page = "select";
      this.setRoute();
      this.$q.notify(data);
    },
    changePage(pageName) {
      this.page = pageName;
      this.reportedRoutes = this.removeRoutes({ routes: this.reportedRoutes });
      this.selectedRoute = null;
      this.selectedRouteIndex = null;
    },
    changeActive(pageName) {
      this.active = pageName;
      if (this.active === "contribute") {
        this.page = "select";
        this.drawReportedRoutes();
      }
    },
    highlight({ routeIndex, pathIndex }) {
      if (isNaN(routeIndex) && isNaN(pathIndex)) {
        this.changeView({
          coordinates: [
            {
              lat: this.reportedRoutes[routeIndex].origin.lat,
              lng: this.reportedRoutes[routeIndex].origin.lng
            },
            {
              lat: this.reportedRoutes[routeIndex].destination.lat,
              lng: this.reportedRoutes[routeIndex].destination.lng
            }
          ]
        });
        this.reportedRoutes.forEach(route => {
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
              lat: this.reportedRoutes[routeIndex].origin.lat,
              lng: this.reportedRoutes[routeIndex].origin.lng
            },
            {
              lat: this.reportedRoutes[routeIndex].destination.lat,
              lng: this.reportedRoutes[routeIndex].destination.lng
            }
          ]
        });
        for (let i = 0; i < this.reportedRoutes.length; i++) {
          if (i === routeIndex) {
            this.reportedRoutes[i].paths.forEach(path => {
              if (path.polyLine) {
                path.polyLine.setStyle({ opacity: 1 });
              }
            });
          } else {
            this.reportedRoutes[i].paths.forEach(path => {
              if (path.polyLine) {
                path.polyLine.setStyle({ opacity: 0 });
              }
            });
          }
        }
      } else {
        let activePath;
        for (let i = 0; i < this.reportedRoutes.length; i++) {
          if (i === routeIndex) {
            for (let j = 0; j < this.reportedRoutes[i].paths.length; j++) {
              if (j === pathIndex) {
                activePath = this.reportedRoutes[i].paths[j];
                if (this.reportedRoutes[i].paths[j].polyLine) {
                  this.reportedRoutes[i].paths[j].polyLine.setStyle({
                    opacity: 1
                  });
                }
              } else {
                if (this.reportedRoutes[i].paths[j].polyLine) {
                  this.reportedRoutes[i].paths[j].polyLine.setStyle({
                    opacity: 0.5
                  });
                }
              }
            }
          } else {
            this.reportedRoutes[i].paths.forEach(path => {
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
        this.selectedRoute = this.reportedRoutes[routeIndex];
        this.selectedRouteIndex = routeIndex;
        this.viewing = true;
      }
    },
    reset() {
      this.page = "select";
      this.reportedRoutes = this.removeRoutes({ routes: this.reportedRoutes });
      this.selectedRoute = null;
      this.selectedRouteIndex = null;
    }
  },
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
  top: 248px;
  bottom: 0;
  left: 0;
  right: 0;
}
.route-body {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  position: absolute;
  top: 100px;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
