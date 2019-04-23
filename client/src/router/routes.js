import {
  Search,
  Wrapper,
  SelectSearchMethod,
  PlaceMarkerCard,
  FavoritesPanel,
  ContributePanel
} from "../components";

import store from "../store";
import { Notify } from "quasar";

const routes = [
  {
    path: "/",
    component: Wrapper,
    children: [
      {
        path: "",
        name: "Search",
        component: Search
      },
      {
        path: "origin",
        name: "Origin",
        component: SelectSearchMethod
      },
      {
        path: "/origin/marker",
        name: "OriginMarker",
        component: PlaceMarkerCard
      },
      {
        path: "destination",
        name: "Destination",
        component: SelectSearchMethod
      },
      {
        path: "/destination/marker",
        name: "DestinationMarker",
        component: PlaceMarkerCard
      },
      {
        path: "/favorites",
        name: "FavoritesPanel",
        component: FavoritesPanel
      },
      {
        path: "/contribute",
        name: "ContributePanel",
        component: ContributePanel,
        beforeEnter: (to, from, next) => {
          store.dispatch("map/reset");
          if (store.state.auth.profile) {
            next();
          } else if (store.state.type === "viewer") {
            Notify.create({
              message: "UP Mail required to contribute",
              color: "negative",
              position: "top"
            });
            next(false);
          } else {
            Notify.create({
              message: "UP Mail login required",
              color: "negative",
              position: "top"
            });
            next("/favorites");
          }
        }
      }
      // ,
      // {
      //   path: "from",
      //   name: "SearchMethodOrigin",
      //   component: SelectSearchMethod
      // },
      // {
      //   path: "to",
      //   name: "SearchMethodDestination",
      //   component: SelectSearchMethod
      // }
    ]
  }
];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push({
    path: "*",
    component: () => import("pages/Error404.vue")
  });
}

export default routes;
