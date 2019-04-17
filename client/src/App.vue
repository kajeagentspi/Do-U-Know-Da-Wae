<template>
  <div id="q-app">
    <Map/>
    <Sidebar/>
  </div>
</template>

<script>
import { Map, Sidebar } from './components';

export default {
  name: 'App',
  components: {
    Map,
    Sidebar,
  },
};
</script>

<style>
.q-card {
  -webkit-border-radius: .8rem;
  border-radius: .8rem;
}
.sub-card {
  margin-bottom: 1rem;
}
.icon {
  text-align: center;
  line-height: 20px;
}
</style>
