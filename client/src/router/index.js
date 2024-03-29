import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */

const Router = new VueRouter({
  scrollBehavior: () => ({ y: 0 }),
  // Leave these as is and change from quasar.conf.js instead!
  // quasar.conf.js -> build -> vueRouterMode
  // quasar.conf.js -> build -> publicPath
  mode: process.env.VUE_ROUTER_MODE,
  base: process.env.VUE_ROUTER_BASE
});

export default Router;
