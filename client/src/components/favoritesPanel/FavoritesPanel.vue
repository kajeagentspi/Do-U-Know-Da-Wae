<template>
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
    <q-btn v-else color="green" class="full-width" @click="login">Login</q-btn>
  </q-card-section>
</template>

<script>
import { mapState, mapActions } from "vuex";
import firebase from "firebase/app";

export default {
  name: "Favorites",
  computed: {
    ...mapState("auth", ["accessToken", "profile"])
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
        console.log(accessToken);
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

<style></style>
