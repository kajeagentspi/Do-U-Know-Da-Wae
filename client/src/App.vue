<template>
  <div id="q-app">
    <q-layout>
      <q-page-container :style="pageStyle">
        <Map />
        <Wrapper />
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
import { Map, Wrapper } from "./components";
import Vue from "vue";
export default {
  name: "App",
  components: {
    Map,
    Wrapper
  },
  data() {
    return {
      heightHeader: 0,
      heightFooter: 0,
      screenHeight: 0
    };
  },
  mounted() {
    // on initial load set our pageTweaks on nextTick!!!
    Vue.nextTick(() => this.setPageTweaks());
  },
  watch: {
    // every time the router changes set our pageTweaks on nextTick!!!
    $route() {
      Vue.nextTick(() => this.setPageTweaks());
    }
  },
  computed: {
    // create our pageStyle based on our values saved in the component data
    pageStyle() {
      const paddingTop = this.heightHeader + "px !important";
      const paddingBottom = this.heightFooter + "px !important";
      const minHeight =
        this.screenHeight -
        this.heightHeader -
        this.heightFooter +
        "px !important";
      return {
        paddingTop,
        paddingBottom,
        minHeight
      };
    }
  },
  methods: {
    // define pageTweaks method that updates the values we need
    setPageTweaks() {
      const elHeader = document.querySelector(".q-header");
      const elFooter = document.querySelector(".q-footer");
      this.heightHeader = elHeader ? elHeader.clientHeight : 0;
      this.heightFooter = elFooter ? elFooter.clientHeight : 0;
      this.screenHeight = Screen.height;
    }
  }
};
</script>

<style>
.icon {
  text-align: center;
  line-height: 20px;
}
.capitalize {
  text-transform: capitalize;
}
</style>
