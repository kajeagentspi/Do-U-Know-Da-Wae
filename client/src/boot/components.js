import {
  POIItem,
  RouteCard,
  PathCard,
  Search,
  Contribute,
  AddRoom,
  DeleteRoom,
  AddBuilding,
  EditBuilding,
  AddRoute,
  AddIndoorPath,
  AddWalkPath,
  AddJeepPath,
  ViewPathCard,
  User
} from "../components";

export default ({ Vue }) => {
  Vue.component("search", Search);
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
