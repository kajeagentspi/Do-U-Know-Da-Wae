<template>
  <q-card>
    <q-card-actions class="navbar">
      <q-btn-group flat>
        <q-btn disabled flat icon="explore" />
        <q-btn label="Search" to="/" />
        <q-btn label="Contribute" to="/contribute" />
        <q-btn label="Favorites" to="/favorites" />
      </q-btn-group>
    </q-card-actions>
    <div class="body">
      <q-card-section>
        <q-card v-if="accessToken">
          <q-item>
            <q-item-section avatar>
              <q-avatar>
                <img :src="profile.picture" />
              </q-avatar>
            </q-item-section>
            <q-item-section>{{ `Hello ${profile.given_name}` }}</q-item-section>
            <q-btn color="red" @click="logout">Logout</q-btn>
          </q-item>
        </q-card>
        <q-btn v-else color="green" class="full-width" @click="login"
          >Login</q-btn
        >
      </q-card-section>
      <q-separator spaced />
      <RouteCard
        v-for="(route, index) in routes"
        :route="route"
        :key="index"
        :index="index"
      />
    </div>
  </q-card>
</template>

<script>
import { mapState, mapActions } from "vuex";
import firebase from "firebase/app";
export default {
  name: "FavoritesPanel",
  computed: {
    ...mapState("auth", ["accessToken", "profile"]),
    ...mapState("map", ["routes"])
  },
  methods: {
    ...mapActions("auth", ["setUser"]),
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
        this.setUser({ profile, accessToken, user });
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
        this.setUser({ profile: null, accessToken: null, user: null });
        this.$q.notify({
          message: "Successfully Logged out",
          color: "positive",
          position: "top"
        });
      } catch (error) {
        this.$q.notify({
          message: "Error Logging out",
          color: "negative",
          position: "top"
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  background-color: red;
  color: white;
}
.swap {
  width: 74px;
  height: 72px;
}
@media (min-width: 641px) {
  .scrollbox {
    height: calc(93vh - 170px);
  }
}
@media (max-width: 640px) {
  .scrollbox {
    height: calc(54vh - 170px);
  }
}
.body {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  position: absolute;
  top: 52px;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
