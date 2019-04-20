<template>
  <router-view
    class="wrapper"
    :class="
      $route.path === '/'
        ? 'route'
        : $route.path === '/origin'
        ? 'originDestination'
        : $route.path === '/destination'
        ? 'originDestination'
        : $route.path === '/origin/marker'
        ? 'mark'
        : $route.path === '/destination/marker'
        ? 'mark'
        : ''
    "
  />
</template>
<script>
export default {
  name: "Wrapper"
};
</script>

<style lang="scss">
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
  .route {
    height: 60%;
  }
  .originDestination {
    height: 80%;
  }
  .mark {
    height: 20%;
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
  .route,
  .originDestination,
  .mark {
    height: 98vh;
  }
}
</style>
