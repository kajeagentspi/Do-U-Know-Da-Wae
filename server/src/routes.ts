import {
  UserRoutes,
  BuildingRoutes,
  RoomRoutes,
  ExitRoutes,
  StopRoutes,
  MarkerRoutes,
  PathRoutes
} from './entities';

export const Routes = [
  ...UserRoutes,
  ...BuildingRoutes,
  ...RoomRoutes,
  ...ExitRoutes,
  ...StopRoutes,
  ...MarkerRoutes,
  ...PathRoutes,
];