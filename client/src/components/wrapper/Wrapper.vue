<template>
  <search v-if="active==='search'" class="wrapper" :class="viewing ? 'viewing':'search'"/>
  <contribute
    v-else-if="active==='contribute'"
    class="wrapper"
    :class="viewing ? 'viewing':'contribute'"
  />
  <user v-else-if="active==='user'" class="wrapper" :class="viewing ? 'viewing':'user'"/>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "Wrapper",
  computed: {
    ...mapState("map", ["drawing", "viewing", "active"])
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
  .search,
  .user,
  .contribute {
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
  .viewing,
  .user,
  .contribute {
    height: 98vh;
  }
}
</style>
