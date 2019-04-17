import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';

import map from './map';
import auth from './auth';

Vue.use(Vuex);

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function (/* { ssrContext } */) {
  const vuexLocal = new VuexPersistence({
    storage: window.localStorage,
    key: 'dukdw',
    reducer: state => ({
      auth: state.auth,
    }),
  });

  const Store = new Vuex.Store({
    modules: {
      map,
      auth,
    },
    plugins: [vuexLocal.plugin],
  });

  return Store;
}
