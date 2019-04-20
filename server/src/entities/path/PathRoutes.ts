import { PathController } from "./PathController";

export const PathRoutes = [
  {
    method: "get",
    route: "/path",
    controller: PathController,
    action: "all"
  },
  {
    method: "get",
    route: "/path/:id",
    controller: PathController,
    action: "one"
  },
  {
    method: "post",
    route: "/path",
    controller: PathController,
    action: "save"
  }
];
