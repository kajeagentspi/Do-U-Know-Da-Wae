import {
  UserRoutes,
  BuildingRoutes,
  RoomRoutes,
  ExitRoutes,
  StopRoutes,
  MarkerRoutes,
  PathRoutes,
  RouteRoutes,
} from './entities';

export const Routes = [
  ...UserRoutes,
  ...BuildingRoutes,
  ...RoomRoutes,
  ...ExitRoutes,
  ...StopRoutes,
  ...MarkerRoutes,
  ...PathRoutes,
  ...RouteRoutes,
];