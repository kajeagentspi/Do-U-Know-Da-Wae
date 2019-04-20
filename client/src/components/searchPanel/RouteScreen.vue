<template>
  <q-card>
    <q-card-actions class="navbar">
      <q-btn-group flat>
        <q-btn disabled flat icon="explore" />
        <q-btn label="Search" to="/" />
        <q-btn label="Contribute" to="/contribute" />
        <q-btn label="Favorites" to="/favorites" />
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
                @click="change('origin')"
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
                @click="change('destination')"
                to="/destination"
              />
            </div>
            <q-space />
            <q-btn round icon="autorenew" class="col-3 swap" />
          </q-card-section>
        </q-card>
      </q-card-section>
      <q-separator spaced />
      <!-- put results here -->
    </div>
  </q-card>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { SET_LOCATION } from "../../store/types";
export default {
  name: "RouteScreen",
  computed: {
    ...mapState("map", ["origin", "destination", "routes"])
  },
  methods: {
    ...mapMutations("map", {
      setLocation: SET_LOCATION
    }),
    change(type) {
      if (type === "origin") {
        this.setLocation({ locationType: "origin", type: "null" });
      } else {
        this.setLocation({ locationType: "destination", type: "null" });
      }
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
