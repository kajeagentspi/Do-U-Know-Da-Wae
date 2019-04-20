<template>
  <fragment>
    <q-btn class="full-width" color="red" label="Go Back" @click="this.back" />
    <q-separator spaced />
    <q-card>
      <q-card-section>
        <div class="text-h6">{{ `Selecting ${this.type} Room` }}</div>
        <q-separator />
        <q-input v-model="name" outlined label="Search Room Code from SAIS" />
        <q-btn
          class="full-width"
          color="green"
          label="Search"
          @click="this.back"
        />
      </q-card-section>
    </q-card>
    <q-separator spaced />
    <q-scroll-area
      :thumb-style="thumbStyle"
      :content-style="contentStyle"
      :content-active-style="contentActiveStyle"
      class="scrollbox"
    ></q-scroll-area>
  </fragment>
</template>

<script>
export default {
  name: "SearchRoom",
  props: {
    back: { type: Function },
    type: String
  },
  data() {
    return {
      name: ""
    };
  },
  computed: {
    contentStyle() {
      return {
        backgroundColor: "rgba(0,0,0,0.02)",
        color: "#555"
      };
    },

    contentActiveStyle() {
      return {
        backgroundColor: "#eee",
        color: "black"
      };
    },

    thumbStyle() {
      return {
        right: "2px",
        borderRadius: "5px",
        backgroundColor: "#027be3",
        width: "5px",
        opacity: 0.75
      };
    }
  }
};
</script>

<style lang="scss" scoped>
@media (min-width: 641px) {
  .scrollbox {
    height: calc(93vh - 317px);
  }
}
@media (max-width: 640px) {
  .scrollbox {
    height: calc(54vh - 317px);
  }
}
</style>
