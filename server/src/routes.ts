import {
  UserRoutes,
  BuildingRoutes,
  RoomRoutes,
  StopRoutes,
  RouteRoutes,
  PathRoutes,
  POIRoutes
} from "./entities";

export const Routes = [
  ...UserRoutes,
  ...BuildingRoutes,
  ...RoomRoutes,
  ...StopRoutes,
  ...RouteRoutes,
  ...PathRoutes,
  ...POIRoutes
];
