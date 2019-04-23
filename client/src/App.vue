<template>
  <div id="q-app">
    <q-layout>
      <q-page-container :style="pageStyle">
        <Map/>
        <Wrapper/>
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
  computed: {
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
  data() {
    return {
      heightHeader: 0,
      heightFooter: 0,
      screenHeight: 0
    };
  },
  mounted() {
    Vue.nextTick(() => this.setPageTweaks());
  },
  methods: {
    setPageTweaks() {
      const elHeader = document.querySelector(".q-header");
      const elFooter = document.querySelector(".q-footer");
      this.heightHeader = elHeader ? elHeader.clientHeight : 0;
      this.heightFooter = elFooter ? elFooter.clientHeight : 0;
      this.screenHeight = Screen.height;
    }
  },
  watch: {
    $route() {
      Vue.nextTick(() => this.setPageTweaks());
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
.card {
  margin: 15px;
  /* -webkit-border-radius: 0.8rem;
  border-radius: 0.8rem; */
}
.text-dukdw {
  color: red;
}
.bg-dukdw {
  background: red;
}
.navbar {
  background-color: red;
  color: white;
}
</style>
