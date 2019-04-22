import { UserRoutes, BuildingRoutes, RoomRoutes, StopRoutes } from "./entities";
// PathRoutes,
// RouteRoutes,
// AllRoutes

export const Routes = [
  ...UserRoutes,
  ...BuildingRoutes,
  ...RoomRoutes,
  ...StopRoutes
  // ...AllRoutes,
  // ...MarkerRoutes,
  // ...PathRoutes,
  // ...RouteRoutes,
];
