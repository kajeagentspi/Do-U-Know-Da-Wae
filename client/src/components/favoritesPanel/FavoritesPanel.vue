<template>
  <q-card-main>
    <q-card v-if="credential">
      <q-item>
        <q-item-side :avatar="profile.picture"/>
        <q-item-main :label="`Hello ${profile.given_name}`" label-lines="1" />
        <q-item-side>
          <q-btn color="red" @click="logout">Logout</q-btn>
        </q-item-side>
      </q-item>
    </q-card>
    <q-btn v-else color="green" class="full-width" @click="login">Login</q-btn>
  </q-card-main>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import firebase from 'firebase/app';
import { SET_USER } from '../../store/types';

export default {
  name: 'Favorites',
  computed: {
    ...mapState('auth', ['credential', 'profile']),
  },
  methods: {
    ...mapMutations('auth', {
      setUser: SET_USER,
    }),
    async login() {
      try {
        const provider = new firebase.auth.GoogleAuthProvider();
        const result = await this.$auth.signInWithPopup(provider);
        const { additionalUserInfo: { profile }, credential, user } = result;
        this.setUser({ profile, credential, user });
        this.$q.notify({
          message: 'Successfully Logged in',
          color: 'positive',
          position: 'top',
        });
      } catch (error) {
        this.$q.notify({
          message: 'Error Logging in',
          color: 'negative',
          position: 'top',
        });
      }
    },
    async logout() {
      try {
        await this.$auth.signOut();
        this.setUser({ profile: null, credential: null, user: null });
        this.$q.notify({
          message: 'Successfully Logged out',
          color: 'positive',
          position: 'top',
        });
      } catch (error) {
        this.$q.notify({
          message: 'Error Logging out',
          color: 'negative',
          position: 'top',
        });
      }
    },
  },
};
</script>

<style>

</style>
