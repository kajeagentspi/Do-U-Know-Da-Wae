<template>
  <q-card v-if="!drawing">
    <q-card-actions class="navbar">
      <q-btn-group flat>
        <q-btn disabled flat icon="explore"/>
        <q-btn label="Search" @click="changeActive('search')"/>
        <q-btn label="Contribute" @click="reset" :disable="type!=='admin'&&type!=='contributor'"/>
        <q-btn label="User" @click="changeActive('user')"/>
      </q-btn-group>
    </q-card-actions>
    <q-card-section v-if="page==='select'">
      <q-btn class="full-width godown" color="dukdw" label="Add Room" @click="changePage('room')"/>
      <q-btn
        class="full-width godown"
        color="dukdw"
        label="Add/Edit Building"
        @click="changePage('building')"
      />
      <q-btn
        class="full-width godown"
        color="dukdw"
        label="Add Jeepney Route"
        @click="changePage('jeepney')"
      />
      <q-btn
        class="full-width godown"
        color="dukdw"
        label="Add Route"
        @click="changePage('route')"
      />
    </q-card-section>
    <q-card-section></q-card-section>
  </q-card>
</template>

<script>
import { mapFields } from "vuex-map-fields";
import { mapState } from "vuex";
export default {
  name: "Contribute",
  computed: {
    ...mapFields("map", ["marker", "drawing", "viewing", "active"]),
    ...mapState("user", ["type"])
  },
  data() {
    return {
      page: "select"
    };
  },
  mounted() {
    if (this.type === "contributor") {
      this.page = "route";
    }
  },
  methods: {
    changePage(pageName) {
      this.page = pageName;
    },
    changeActive(pageName) {
      this.active = pageName;
    },
    reset() {
      if (this.type === "contributor") {
        this.page = "route";
      } else {
        this.page = "select";
      }
    }
  },
  watch: {
    async marker(newValue) {
      this.mapInstance.removeLayer(newValue);
      const { lat, lng } = newValue.getLatLng();
      const poi = {
        lat,
        lng,
        type: "Marker",
        name: await this.reverseGeocode(lat, lng)
      };
      console.log(poi);
    }
  },
  beforeDestroy() {
    this.reset();
  }
};
</script>

<style lang="scss" scoped>
.path-body {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  position: absolute;
  top: 166px;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>