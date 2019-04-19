<template>
  <fragment>
    <q-card>
      <q-card-section class="row">
        <div class="col-10">
          <q-btn
            class="full-width ellipsis"
            :label="
              origin ? `[${origin.type}] ${origin.name}` : 'Select Origin'
            "
            no-ripple
            size="l"
            to="/from"
          />
          <q-btn
            class="full-width ellipsis"
            :label="
              destination
                ? `[${destination.type}] ${destination.name}`
                : 'Select Destination'
            "
            no-ripple
            size="l"
            to="/to"
          />
        </div>
        <q-btn icon="autorenew" class="col-2" />
      </q-card-section>
    </q-card>
    <q-card-section inset />
    <q-scroll-area class="scrollbox">
      <q-card v-for="index in 10" :key="index">
        <q-card-section class="row">
          <div class="col-10">
            <q-btn
              class="full-width"
              label="Select Origin"
              no-ripple
              size="l"
            />
            <q-btn
              class="full-width"
              label="Select Destination"
              no-ripple
              size="l"
            />
          </div>
          <q-btn icon="autorenew" class="col-2" />
        </q-card-section>
      </q-card>
    </q-scroll-area>
  </fragment>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "SearchScreen",
  computed: {
    ...mapState("map", ["origin", "destination"])
  }
};
</script>

<style lang="scss" scoped>
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
</style>
