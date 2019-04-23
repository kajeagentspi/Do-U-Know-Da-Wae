<template>
  <q-card class="card" @mouseover="highLight({routeIndex: index})" @mouseleave="highLight">
    <q-expansion-item>
      <template v-slot:header>
        <q-avatar icon="bluetooth" color="primary" text-color="white"/>

        <q-item-section>Bluetooth technology</q-item-section>

        <q-item-section side>
          <div class="row items-center">
            <q-icon name="star" color="red" size="24px"/>
            <q-icon name="star" color="red" size="24px"/>
            <q-icon name="star" color="red" size="24px"/>
          </div>
        </q-item-section>
      </template>
      <q-card>
        <q-card-section>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem, eius reprehenderit eos corrupti
          commodi magni quaerat ex numquam, dolorum officiis modi facere maiores architecto suscipit iste
          eveniet doloribus ullam aliquid.
        </q-card-section>
      </q-card>
    </q-expansion-item>
  </q-card>
</template>

<script>
export default {
  name: "RouteCard",
  props: ["route", "index"],
  methods: {
    highLight(data) {
      this.$emit("highLight", data);
    }
  }
};
</script>

<style>
</style>
