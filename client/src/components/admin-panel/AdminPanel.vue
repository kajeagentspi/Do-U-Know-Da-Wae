<template>
  <q-card v-if="!drawing">
    <q-card-actions class="navbar">
      <q-btn-group flat>
        <q-btn disabled flat icon="explore" />
        <q-btn label="Search" @click="changeActive('search')" />
        <q-btn
          label="Contribute"
          @click="changeActive('contribute')"
          v-if="type !== 'viewer'"
        />
        <q-btn label="User" @click="changeActive('user')" />
        <q-btn label="Admin" v-if="type === 'admin'" @click="reset" />
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
        label="Change User Permission"
        @click="changePage('changepermission')"
      />
      <q-btn
        class="full-width godown"
        color="dukdw"
        label="View Reported Routes"
        @click="changePage('reported')"
      />
    </q-card-section>
    <add-building v-else-if="page === 'addbuilding'" />
    <edit-building
      v-else-if="page === 'editbuilding'"
      @changePage="changePage"
    />
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
      <q-btn
        class="full-width godown"
        color="green"
        label="Submit"
        @click="submitChangePermission"
      />
    </q-card-section>
    <view-reported v-else-if="page === 'reported'" />
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
          this.permissionLevel = "viewer";
          break;
      }
    },
    async submitChangePermission() {
      const { data } = await Api.saveUser({
        email: this.email,
        type: this.permissionLevel
      });
      if (data.message) {
        this.$q.notify(data);
      } else {
        this.$q.notify({
          message: "Successfully changed user type",
          color: "positive",
          position: "top"
        });
      }
    },
    changePage(pageName) {
      this.page = pageName;
    },
    changeActive(pageName) {
      this.active = pageName;
    },
    reset() {
      this.page = "select";
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
