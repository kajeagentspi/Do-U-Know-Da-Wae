import { BuildingController } from "./BuildingController";

export const BuildingRoutes = [
  {
    method: "get",
    route: "/building",
    controller: BuildingController,
    action: "all"
  },
  {
    method: "get",
    route: "/building/:id",
    controller: BuildingController,
    action: "one"
  },
  {
    method: "get",
    route: "/building/identify",
    controller: BuildingController,
    action: "identify"
  },
  {
    method: "post",
    route: "/building",
    controller: BuildingController,
    action: "save"
  },
  {
    method: "delete",
    route: "/building/:id",
    controller: BuildingController,
    action: "remove"
  }
];
