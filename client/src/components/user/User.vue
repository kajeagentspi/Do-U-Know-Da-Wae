<template>
  <q-card>
    <q-card-actions class="navbar">
      <q-btn-group flat>
        <q-btn disabled flat icon="explore" />
        <q-btn label="Search" @click="changeActive('search')" />
        <q-btn
          label="Contribute"
          @click="changeActive('contribute')"
          :disable="type !== 'admin' && type !== 'contributor'"
        />
        <q-btn label="User" @click="reset" />
      </q-btn-group>
    </q-card-actions>
    <div v-if="!selectedRoute">
      <q-card-section>
        <q-btn
          class="full-width godown"
          color="dukdw"
          v-if="accessToken === null"
          label="Login"
          @click="login"
        />
        <q-card v-else>
          <q-item>
            <q-item-section avatar>
              <q-avatar>
                <img :src="profile.picture" />
              </q-avatar>
            </q-item-section>
            <q-item-section>{{ `Hello ${profile.given_name}` }}</q-item-section>
            <q-btn color="dukdw" @click="logout">Logout</q-btn>
          </q-item>
        </q-card>
      </q-card-section>
      <q-separator />
      <div class="route-body">
        <route-card
          v-for="(route, index) in bookmarks"
          :key="index"
          :index="index"
          :route="route"
          @highLight="highLight"
          @setRoute="setRoute"
        />
      </div>
    </div>
    <div v-else>
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
          @click="highLight({ routeIndex: selectedRouteIndex })"
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
          @highLight="highLight"
        />
      </div>
    </div>
  </q-card>
</template>

<script>
import firebase from "firebase/app";
import randomColor from "random-color";
import L from "leaflet";
import { mapState, mapActions, mapMutations } from "vuex";
import { mapFields } from "vuex-map-fields";
import { CHANGE_VIEW } from "../../store/types";

export default {
  name: "User",
  computed: {
    ...mapState("user", ["accessToken", "profile", "type"]),
    ...mapFields("user", ["bookmarks"]),
    ...mapFields("map", ["active", "viewing"]),
    ...mapState("map", ["mapInstance"])
  },
  data() {
    return {
      selectedRoute: null,
      selectedRouteIndex: null,
      routes: []
    };
  },
  methods: {
    ...mapMutations("map", {
      changeView: CHANGE_VIEW
    }),
    ...mapActions("user", ["setUser", "getUser"]),
    async login() {
      try {
        const provider = new firebase.auth.GoogleAuthProvider();
        const result = await this.$auth.signInWithPopup(provider);
        const {
          additionalUserInfo: { profile },
          user
        } = result;
        const accessToken = await this.$auth.currentUser.getIdToken(
          /* forceRefresh */ true
        );
        await this.setUser({ profile, accessToken, user });
        this.drawLines();
        this.$q.notify({
          message: "Successfully Logged in",
          color: "positive",
          position: "top"
        });
      } catch (error) {
        this.$q.notify({
          message: "Error Logging in",
          color: "negative",
          position: "top"
        });
      }
    },
    async logout() {
      try {
        await this.$auth.signOut();
        this.$q.notify({
          message: "Successfully Logged out",
          color: "positive",
          position: "top"
        });
        this.reset();
        this.setUser({ accessToken: null });
      } catch (error) {
        this.$q.notify({
          message: "Error Logging out",
          color: "negative",
          position: "top"
        });
      }
    },
    highLight({ routeIndex, pathIndex }) {
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
        this.selectedRoute = this.bookmarks[routeIndex];
        this.selectedRouteIndex = routeIndex;
        this.viewing = true;
      }
    },
    changeActive(pageName) {
      this.active = pageName;
    },
    reset() {
      this.selectedRoute = null;
      if (this.routes) {
        this.routes.forEach(route => {
          route.paths.forEach(path => {
            if (path.polyLine) {
              this.mapInstance.removeLayer(path.polyLine);
            }
          });
        });
      }
    },
    drawLines() {
      const colors = [];
      this.bookmarks.forEach(route => {
        const newRoute = JSON.parse(JSON.stringify(route));
        let color = randomColor().hexString();
        while (color in colors) {
          color = randomColor(0.99, 0.99).hexString();
        }
        newRoute.color = color;
        newRoute.paths = newRoute.paths.map(path => {
          if (path.latLngs) {
            path.polyLine = L.polyline(path.latLngs, {
              color
            }).addTo(this.mapInstance);
          }
          return path;
        });
        this.routes.push(newRoute);
      });
    }
  },
  mounted() {
    if (this.accessToken) {
      this.getUser();
      this.drawLines();
    }
  },
  beforeDestroy() {
    this.reset();
  }
};
</script>

<style lang="scss" scoped>
.route-body {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  position: absolute;
  top: 140px;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
