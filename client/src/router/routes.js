import {
  RouteScreen,
  Wrapper,
  SelectSearchMethod,
  PlaceMarkerCard
} from "../components";

const routes = [
  {
    path: "/",
    component: Wrapper,
    children: [
      {
        path: "",
        name: "RouteScreen",
        component: RouteScreen,
        meta: { bodyClass: "route" }
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
