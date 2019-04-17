<template>
  <q-card-actions vertical>
    <q-btn
      class="full-width"
      color="green"
      icon="gesture"
      label="Route"
      to="/contribute/route"
    />
    <q-btn
      class="full-width"
      color="green"
      icon="account_balance"
      label="Building"
      to="/contribute/building"
    />
    <q-btn
      class="full-width"
      color="green"
      icon="meeting_room"
      label="Room"
      to="/contribute/room"
    />
  </q-card-actions>
</template>

<script>
export default {
  name: 'ContributeChoice',
};
</script>
