<template>
  <search class="wrapper" :class="viewing ? 'viewing':'search'"/>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "Wrapper",
  computed: {
    ...mapState("map", ["marking", "viewing"])
  }
};
</script>

<style lang="scss" scoped>
@media (max-width: 640px) {
  .wrapper {
    left: 1vw;
    right: 1vw;
    bottom: 1vw;
    width: 98vw;
    position: absolute;
    overflow: hidden;
    z-index: 0;
  }
  .search {
    height: 60%;
  }
  .viewing {
    height: 40%;
  }
}

@media (min-width: 641px) {
  .wrapper {
    width: 360px;
    overflow: hidden;
    z-index: 0;
    left: 1vh;
    top: 1vh;
    bottom: 1vh;
  }
  .search,
  .viewing {
    height: 98vh;
  }
}
</style>
