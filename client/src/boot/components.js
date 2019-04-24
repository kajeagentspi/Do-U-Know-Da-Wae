import { POIItem, RouteCard, PathCard, Search } from "../components";

export default ({ Vue }) => {
  Vue.component("poi-item", POIItem);
  Vue.component("route-card", RouteCard);
  Vue.component("path-card", PathCard);
  Vue.component("search", Search);
};
