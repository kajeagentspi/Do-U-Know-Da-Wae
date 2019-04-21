<template>
  <q-card
    :color="index === 'Add' ? 'white' : 'red-5'"
    :text-color="index === 'Add' ? 'black' : 'white'"
    class="sub-card"
  >
    <q-card-section v-if="index !== 'Add'">
      <q-btn
        :disabled="index !== 0"
        :style="index === 0 ? 'width: 85%' : 'width: 100%'"
        @click="togglePathType"
        :label="paths[index].type"
      />
      <q-btn
        flat
        icon="cancel"
        no-ripple
        round
        size="md"
        style="width: 15%"
        v-if="index === 0"
      />
    </q-card-section>

    <q-card-section class="full-width" v-if="index === 'Add'">
      <q-btn class="full-width" size="lg" icon="add" flat @click="addPath" />
    </q-card-section>

    <q-card-section
      class="full-width row"
      v-if="index !== 'Add' && paths[index].type === 'Walking'"
    >
      <q-btn
        align="left"
        class="col-10"
        flat
        icon="lens"
        :label="paths[index].origin ? paths[index].origin.name : 'origin'"
        no-ripple
        size="l"
        @click="selectEnd('origin')"
        :disabled="index !== 0"
      />
      <q-btn
        :label="paths[index].originType"
        class="col-2"
        @click="changeEndType('origin')"
      />
      <q-btn
        align="left"
        class="col-10"
        flat
        icon="lens"
        :label="
          paths[index].destination
            ? paths[index].destination.name
            : 'destination'
        "
        no-ripple
        size="l"
        @click="selectEnd('destination')"
        :disabled="index !== 0 || paths[index].type === 'manual'"
      />
      <q-btn
        :label="paths[index].destinationType"
        class="col-2"
        @click="changeEndType('destination')"
      />
      <q-btn
        :label="paths[index].mode"
        :disabled="index !== 0"
        @click="toggleMode"
      />
      <q-space />
      <!-- <q-btn
        :label="paths[index].snap ? 'Snap' : 'No Snap'"
        :disabled="index!==0"
        @click="toggleSnap"
      />-->
    </q-card-section>
    <!-- <q-card-section class="full-width row" v-if="path.type === 'Indoor'">
      <q-list class="full-width" v-if="path.instructions.length != 0">
        <template v-for="(instruction, key) in path.instructions">
          <q-item v-bind:key="key">
            <q-item-section
              :label="instruction"
              :style="
                path.instructions.length === key + 1
                  ? 'width: 85%'
                  : 'width: 100%'
              "
            />
            <q-item-side
              right
              :style="
                path.instructions.length === key + 1
                  ? 'width: 15%'
                  : 'width: 0%'
              "
            >
              <q-btn
                color="white"
                flat
                icon="cancel"
                no-ripple
                round
                size="md"
                @click="deleteInstruction"
                v-if="path.instructions.length === key + 1 && mode === 'add'"
              />
            </q-item-side>
          </q-item>
        </template>
      </q-list>
      <q-input class="col-10" v-model="temp" v-if="this.paths.length === this.path.index + 1"/>
      <q-btn
        class="col-2"
        color="white"
        label="add"
        text-color="black"
        @click="addInstruction"
        v-if="this.paths.length === this.path.index + 1"
      />
    </q-card-section>-->
  </q-card>
</template>

<script>
import { mapFields } from "vuex-map-fields";
import { mapActions } from "vuex";
export default {
  name: "PathCard",
  props: ["index"],
  mounted() {},
  computed: {
    ...mapFields("map", [
      "mapInstance",
      "paths",
      "MarkerPathOrigin",
      "MarkerPathDestination"
    ])
  },
  methods: {
    ...mapActions("map", ["resetCurrentPath"]),
    addPath() {
      this.paths.unshift({
        type: "Walking",
        index: this.paths.length,
        snap: false,
        mode: "auto",
        polyLine: null,
        instructions: [],
        origin: null,
        destination: null,
        originMarker: null,
        destinationMarker: null,
        originType: "b",
        destinationType: "b"
      });
    },
    togglePathType() {
      let [path, ...others] = this.paths;
      switch (path.type) {
        case "Indoor":
          path.type = "Walking";
          path.originType = "b";
          path.destinationType = "r";
          break;
        case "Walking":
          path.type = "Jeepney";
          path.originType = "b";
          path.destinationType = "b";
          break;
        case "Jeepney":
          path.type = "Indoor";
          path.originType = "s";
          path.destinationType = "s";
          break;
      }
      path = {
        ...path,
        snap: false,
        mode: "auto",
        instructions: [],
        polyLine: null,
        origin: null,
        destination: null,
        originMarker: null,
        destinationMarker: null
      };
      this.resetCurrentPath();
      this.paths = [path, ...others];
    },
    changeEndType(endType) {
      let [path, ...others] = this.paths;
      const { type, originType, destinationType } = path;
      if (type === "Walking") {
        if (endType === "origin") {
          switch (originType) {
            case "b":
              path.originType = "s";
              break;
            case "s":
              path.originType = "b";
              break;
          }
        } else if (endType === "destination") {
          switch (destinationType) {
            case "b":
              path.destinationType = "s";
              break;
            case "s":
              path.destinationType = "b";
              break;
          }
        }
      } else if (type === "Indoor") {
        if (endType === "origin") {
          switch (originType) {
            case "b":
              path.originType = "r";
              break;
            case "r":
              path.originType = "b";
              break;
          }
        } else if (endType === "destination") {
          switch (destinationType) {
            case "b":
              path.destinationType = "r";
              break;
            case "r":
              path.destinationType = "b";
              break;
          }
        }
      }

      path = {
        ...path,
        instructions: [],
        polyLine: null,
        origin: null,
        destination: null,
        originMarker: null,
        destinationMarker: null
      };
      this.resetCurrentPath();
      this.paths = [path, ...others];
    },
    selectEnd(endType) {
      // walking either building or stop
      // jeep stop to stop
      // indoor building to room in building
      // if not room in building then add additional indoor to building
      const { mode, type, originType, destinationType } = this.paths[0];
      if (endType === "origin") {
        if (mode === "auto") {
          switch (type) {
            case "Walking":
            case "Jeepney":
              switch (originType) {
                case "b":
                  this.MarkerPathOrigin = true;
                  this.mapInstance.editTools.startMarker();
                  break;
                case "s":
                  this.MarkerPathOrigin = true;
                  this.$q.notify({
                    message: "Please Select A Stop from the map"
                  });
                  break;
              }
          }
        }
      } else if (endType === "destination") {
        if (mode === "auto") {
          switch (type) {
            case "Walking":
            case "Jeepney":
              switch (destinationType) {
                case "b":
                  this.MarkerPathDestination = true;
                  this.mapInstance.editTools.startMarker();
                  break;
                case "s":
                  this.MarkerPathDestination = true;
                  this.$q.notify({
                    message: "Please Select A Stop from the map"
                  });
                  break;
              }
          }
        }
      }
    },
    toggleSnap() {
      let [path, ...others] = this.paths;
      path.snap = !path.snap;
      path = {
        ...path,
        instructions: [],
        polyLine: null,
        origin: null,
        destination: null,
        originMarker: null,
        destinationMarker: null
      };
      this.resetCurrentPath();
      this.paths = [path, ...others];
    },
    toggleMode() {
      let [path, ...others] = this.paths;
      switch (path.mode) {
        case "auto":
          path.mode = "manual";
          break;
        case "manual":
          path.mode = "auto";
          break;
      }
      path = {
        ...path,
        instructions: [],
        polyLine: null,
        origin: null,
        destination: null,
        originMarker: null,
        destinationMarker: null
      };
      this.resetCurrentPath();
      this.paths = [path, ...others];
    }

    // deletePath() {
    //   const path = this.paths.pop();
    //   this.mapInstance.removeLayer(path[0].layer);
    // },
    // toggleMode() {
    //   switch (this.path.mode) {
    //     case "Auto":
    //       this.paths[this.paths.length - 1 - this.path.index].mode = "Manual";
    //       break;
    //     case "Manual":
    //       this.paths[this.paths.length - 1 - this.path.index].mode = "Search";
    //       break;
    //     case "Search":
    //       this.paths[this.paths.length - 1 - this.path.index].mode = "Auto";
    //       break;
    //   }
    // },
    // selectEnd(type) {
    //   switch (type) {
    //     case "OriginWalking":
    //       switch (this.path.mode) {
    //         case "Auto":
    //           if (this.paths.length > 1) {
    //             this.mapInstance.editTools.startPolyline(
    //               this.paths[1].latLngs.slice(-1)[0]
    //             );
    //           } else {
    //             this.selectingStartWalkCoordinates = true;
    //             this.mapInstance.editTools.startMarker();
    //           }
    //           break;
    //         case "Manual":
    //           if (this.paths.length > 1) {
    //             this.mapInstance.editTools.startPolyline(
    //               this.paths[1].latLngs.slice(-1)[0]
    //             );
    //           } else {
    //             this.mapInstance.editTools.startPolyline();
    //           }
    //           if (this.path.layer) {
    //             this.path.layer.editor.continueBackward();
    //           }
    //           break;
    //         case "Search":
    //           break;
    //       }
    //       break;
    //     case "DestinationWalking":
    //       switch (this.path.mode) {
    //         case "Auto":
    //           this.selectingEndWalkCoordinates = true;
    //           this.mapInstance.editTools.startMarker();
    //           break;
    //         case "Manual":
    //           if (this.path.layer) {
    //             this.path.layer.editor.continueForward();
    //           }
    //           break;
    //         case "Search":
    //           break;
    //       }
    //       break;
    //   }
    // },
    // addInstruction() {
    //   this.paths[this.paths.length - 1 - this.path.index].instructions.push(
    //     this.temp
    //   );
    //   this.temp = "";
    // },
    // deleteInstruction() {
    //   this.paths[this.paths.length - 1 - this.path.index].instructions.pop();
    // },
    // toggleSnap() {
    //   switch (this.path.snap) {
    //     case false:
    //       this.paths[this.paths.length - 1 - this.paths.index].snap = true;
    //       break;
    //     case true:
    //       this.paths[this.paths.length - 1 - this.paths.index].snap = false;
    //       break;
    //   }
    // }
  }
};
</script>
