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
    method: "get",
    route: "/reported",
    controller: RouteController,
    action: "reported"
  },
  {
    method: "post",
    route: "/report",
    controller: RouteController,
    action: "report"
  },
  {
    method: "post",
    route: "/processreport",
    controller: RouteController,
    action: "processReport"
  },
  {
    method: "post",
    route: "/bookmark",
    controller: RouteController,
    action: "bookmark"
  },
  {
    method: "post",
    route: "/removebookmark",
    controller: RouteController,
    action: "removeBookmark"
  },
  {
    method: "delete",
    route: "/route/:id",
    controller: RouteController,
    action: "remove"
  }
];
