import {
  LeafletMap,
  Wrapper,
  SearchPanel,
  AdminPanel,
  Contribute,
  User,
  POIItem,
  RouteCard,
  PathCard,
  AddRoom,
  DeleteRoom,
  AddBuilding,
  EditBuilding,
  AddRoute,
  AddIndoorPath,
  AddWalkPath,
  AddJeepPath,
  ViewPathCard
} from "../components";

export default ({ Vue }) => {
  Vue.component("leaflet-map", LeafletMap);
  Vue.component("wrapper", Wrapper);
  Vue.component("search-panel", SearchPanel);
  Vue.component("admin-panel", AdminPanel);
  Vue.component("poi-item", POIItem);
  Vue.component("route-card", RouteCard);
  Vue.component("path-card", PathCard);
  Vue.component("contribute", Contribute);
  Vue.component("add-room", AddRoom);
  Vue.component("delete-room", DeleteRoom);
  Vue.component("add-building", AddBuilding);
  Vue.component("edit-building", EditBuilding);
  Vue.component("view-path-card", ViewPathCard);
  Vue.component("add-route", AddRoute);
  Vue.component("add-indoor-path", AddIndoorPath);
  Vue.component("add-walk-path", AddWalkPath);
  Vue.component("add-jeep-path", AddJeepPath);
  Vue.component("user", User);
};
