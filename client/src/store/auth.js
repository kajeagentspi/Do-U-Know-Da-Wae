import { getField, updateField } from 'vuex-map-fields';
import { SET_USER } from './types';

const auth = {
  namespaced: true,
  state: {
    credential: null,
    profile: null,
    user: null,
  },
  getters: {
    getField,
  },
  mutations: {
    updateField,
    [SET_USER]: (state, payload) => {
      const { credential, profile, user } = payload;
      console.log({ profile, credential, user });
      state.credential = credential;
      state.profile = profile;
      state.user = user;
    },
  },
  actions: {
  },
};
export default auth;
