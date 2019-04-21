import {
  UserRoutes,
  BuildingRoutes,
  RoomRoutes,
  StopRoutes,
  MarkerRoutes,
  PathRoutes,
  RouteRoutes,
  AllRoutes
} from "./entities";

export const Routes = [
  ...UserRoutes,
  ...BuildingRoutes,
  ...RoomRoutes,
  ...StopRoutes,
  ...MarkerRoutes,
  ...PathRoutes,
  ...RouteRoutes,
  ...AllRoutes
];
