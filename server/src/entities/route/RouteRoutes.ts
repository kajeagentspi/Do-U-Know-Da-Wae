import { RouteController } from "./RouteController";

export const RouteRoutes = [
  {
    method: "get",
    route: "/route",
    controller: RouteController,
    action: "all"
  },
  {
    method: "get",
    route: "/route/:id",
    controller: RouteController,
    action: "one"
  },
  {
    method: "post",
    route: "/route",
    controller: RouteController,
    action: "save"
  },
  {
    method: "post",
    route: "/bookmark",
    controller: RouteController,
    action: "bookmark"
  },
  {
    method: "delete",
    route: "/route/:id",
    controller: RouteController,
    action: "remove"
  }
];
