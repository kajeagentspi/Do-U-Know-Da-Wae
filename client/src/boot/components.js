import {
  POIItem,
  RouteCard,
  PathCard,
  Search,
  Contribute,
  AddRoom,
  EditablePathCard,
  User
} from "../components";

export default ({ Vue }) => {
  Vue.component("search", Search);
  Vue.component("poi-item", POIItem);
  Vue.component("route-card", RouteCard);
  Vue.component("path-card", PathCard);
  Vue.component("contribute", Contribute);
  Vue.component("add-room", AddRoom);
  Vue.component("editable-path-card", EditablePathCard);
  Vue.component("user", User);
};
