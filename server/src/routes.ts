import {
  UserRoutes,
  BuildingRoutes,
  RoomRoutes,
  ExitRoutes,
  StopRoutes,
  MarkerRoutes,
} from './entities';

export const Routes = [
  ...UserRoutes,
  ...BuildingRoutes,
  ...RoomRoutes,
  ...ExitRoutes,
  ...StopRoutes,
  ...MarkerRoutes,
];