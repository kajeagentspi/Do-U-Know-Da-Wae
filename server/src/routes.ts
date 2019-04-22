import {
  UserRoutes,
  BuildingRoutes,
  RoomRoutes,
  StopRoutes,
  RouteRoutes
} from "./entities";

export const Routes = [
  ...UserRoutes,
  ...BuildingRoutes,
  ...RoomRoutes,
  ...StopRoutes,
  ...RouteRoutes
];
