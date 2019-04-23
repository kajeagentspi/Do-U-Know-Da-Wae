import { POIItem } from "../components";
import { RouteCard } from "../components";

export default ({ Vue }) => {
  Vue.component("poi-item", POIItem);
  Vue.component("route-card", RouteCard);
};
