import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from "vuex-persist";

import map from "./map";
import user from "./user";
Vue.use(Vuex);

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  key: "dukdw",
  reducer: state => ({
    user: state.user
  })
});

const Store = new Vuex.Store({
  modules: {
    map,
    user
  },
  plugins: [vuexLocal.plugin]
});

export default Store;
