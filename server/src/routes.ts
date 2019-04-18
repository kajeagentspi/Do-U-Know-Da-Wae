import { UserRoutes, BuildingRoutes, RoomRoutes, ExitRoutes } from './entities';

export const Routes = [
  ...UserRoutes,
  ...BuildingRoutes,
  ...RoomRoutes,
  ...ExitRoutes,
];