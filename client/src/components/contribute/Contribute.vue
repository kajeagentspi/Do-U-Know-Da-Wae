<template>
  <q-card v-if="!drawing">
    <q-card-actions class="navbar">
      <q-btn-group flat>
        <q-btn disabled flat icon="explore" />
        <q-btn label="Search" @click="changeActive('search')" />
        <q-btn
          label="Contribute"
          @click="reset"
          :disable="type !== 'admin' && type !== 'contributor'"
        />
        <q-btn label="User" @click="changeActive('user')" />
      </q-btn-group>
    </q-card-actions>
    <q-card-section v-if="page === 'select'">
      <q-btn
        class="full-width godown"
        color="dukdw"
        label="Add Building"
        @click="changePage('addbuilding')"
      />
      <q-btn
        class="full-width godown"
        color="dukdw"
        label="Edit Building"
        @click="changePage('editbuilding')"
      />
      <q-btn
        class="full-width godown"
        color="dukdw"
        label="Add Room"
        @click="changePage('addroom')"
      />
      <q-btn
        class="full-width godown"
        color="dukdw"
        label="Delete Room"
        @click="changePage('deleteroom')"
      />
      <q-btn
        class="full-width godown"
        color="dukdw"
        label="Add Route"
        @click="changePage('addroute')"
      />
      <q-btn
        class="full-width godown"
        color="dukdw"
        label="Change User Permission"
        @click="changePage('changepermission')"
      />
    </q-card-section>
    <add-room v-if="page === 'addroom'" />
    <delete-room v-else-if="page === 'deleteroom'" />
    <add-building v-else-if="page === 'addbuilding'" />
    <edit-building v-else-if="page === 'editbuilding'" />
    <add-route v-else-if="page === 'addroute'" />
    <q-card-section v-else-if="page === 'changepermission'">
      <q-input
        class="full-width godown"
        outlined
        v-model="email"
        placeholder="user@up.edu.ph"
        label="Enter Email"
      />
      <q-btn
        class="full-width godown"
        color="dukdw"
        :label="permissionLevel"
        @click="changePermission"
      />
      <q-btn class="full-width godown" color="green" label="Submit" />
    </q-card-section>
  </q-card>
</template>

<script>
import { mapFields } from "vuex-map-fields";
import { mapState } from "vuex";
import * as Api from "../../api";

export default {
  name: "Contribute",
  computed: {
    ...mapFields("map", ["marker", "drawing", "viewing", "active"]),
    ...mapState("user", ["type"])
  },
  data() {
    return {
      page: "select",
      email: "",
      permissionLevel: "viewer"
    };
  },
  mounted() {
    if (this.type === "contributor") {
      this.page = "route";
    }
  },
  methods: {
    changePermission() {
      switch (this.permissionLevel) {
        case "viewer":
          this.permissionLevel = "contributor";
          break;
        case "contributor":
          this.permissionLevel = "admin";
          break;
        case "admin":
          this.permissionLevel = "banned";
          break;
        case "banned":
          this.permissionLevel = "viewer";
          break;
      }
    },
    async submitChangePermission() {
      await Api.saveUser({
        email: this.email,
        permissionLevel: this.permissionLevel
      });
    },
    changePage(pageName) {
      this.page = pageName;
    },
    changeActive(pageName) {
      this.active = pageName;
    },
    reset() {
      if (this.type === "contributor") {
        this.page = "route";
      } else {
        this.page = "select";
      }
    }
  },
  watch: {},
  beforeDestroy() {
    this.reset();
  }
};
</script>

<style lang="scss" scoped>
.path-body {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  position: absolute;
  top: 166px;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
