<template>
  <fragment>
    <q-card>
      <q-separator class="row">
        <div class="col-10">
          <q-btn class="full-width" label="Select Origin" no-ripple size="l" />
          <q-btn
            class="full-width"
            label="Select Destination"
            no-ripple
            size="l"
          />
        </div>
        <q-btn icon="autorenew" class="col-2" />
      </q-separator>
    </q-card>
    <q-separator inset />
    <q-scroll-area class="scrollbox">
      <q-card v-for="index in 10" :key="index">
        <q-separator class="row">
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
        </q-separator>
      </q-card>
    </q-scroll-area>
  </fragment>
</template>

<script>
export default {
  name: "SearchScreen"
};
</script>

<style lang="scss" scoped>
@media (min-width: 641px) {
  .scrollbox {
    height: calc(96vh - 170px);
  }
}
@media (max-width: 640px) {
  .scrollbox {
    height: calc(57vh - 170px);
  }
}
</style>
