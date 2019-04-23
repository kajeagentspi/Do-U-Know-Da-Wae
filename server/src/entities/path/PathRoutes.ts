import { PathController } from "./PathController";

export const PathRoutes = [
  {
    method: "get",
    route: "/path",
    controller: PathController,
    action: "all"
  }
];
