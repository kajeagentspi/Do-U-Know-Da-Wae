<template>
  <q-card>
    <q-card-actions class="navbar">
      <q-btn-group flat>
        <q-btn disabled flat icon="explore"/>
        <q-btn label="Search" to="/"/>
        <q-btn label="Contribute" to="/contribute"/>
        <q-btn label="Favorites" to="/favorites"/>
      </q-btn-group>
    </q-card-actions>
    <div class="body">
      <q-card-section>
        <q-card flat>
          <q-card-section class="row">
            <div class="col-8">
              <q-btn
                class="full-width ellipsis"
                :label="
                  origin ? `[${origin.type}] ${origin.name}` : 'Select Origin'
                "
                no-ripple
                flat
                size="l"
                to="/origin"
              />
              <q-btn
                class="full-width ellipsis"
                :label="
                  destination
                    ? `[${destination.type}] ${destination.name}`
                    : 'Select Destination'
                "
                no-ripple
                flat
                size="l"
                to="/destination"
              />
            </div>
            <q-space/>
            <q-btn round icon="autorenew" class="col-3 swap"/>
          </q-card-section>
        </q-card>
      </q-card-section>
      <q-separator spaced/>
      <q-btn label="test" @click="pan"/>
      <ItineraryCard v-for="index in 5" :key="index"/>
    </div>
  </q-card>
</template>

<script>
import L from "leaflet";
import { ItineraryCard } from "../";
import { mapState } from "vuex";
import { mapFields } from "vuex-map-fields";
export default {
  name: "RouteScreen",
  computed: {
    ...mapState("map", ["origin", "destination"]),
    ...mapFields("map", ["mapInstance"])
  },
  components: {
    ItineraryCard
  },
  methods: {
    pan() {
      const latLng = { lat: 14.158184881919258, lng: 121.24726429581644 };
      const marker = new L.Marker(latLng, { draggable: true }).on("drag", e => {
        console.log(e.latlng);
      });
      marker.addTo(this.mapInstance);
      this.mapInstance.invalidateSize();
    }
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  background-color: red;
  color: white;
}
.swap {
  width: 74px;
  height: 72px;
}

@media (min-width: 641px) {
  .scrollbox {
    height: calc(93vh - 170px);
  }
}
@media (max-width: 640px) {
  .scrollbox {
    height: calc(54vh - 170px);
  }
}
.body {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  position: absolute;
  top: 52px;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
