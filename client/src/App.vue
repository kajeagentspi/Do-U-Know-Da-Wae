<template>
  <div id="q-app">
    <q-layout>
      <q-page-container :style="pageStyle">
        <leaflet-map />
        <wrapper />
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
import Vue from "vue";
export default {
  name: "App",
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
.leaflet-top.leaflet-right {
  padding-top: 60px;
  padding-right: 10px;
}

.icon {
  text-align: center;
  line-height: 20px;
}
.capitalize {
  text-transform: capitalize;
}
.card {
  margin: 15px;
  -webkit-border-radius: 0.8rem;
  border-radius: 0.8rem;
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
.godown {
  margin-bottom: 5px;
}
</style>
