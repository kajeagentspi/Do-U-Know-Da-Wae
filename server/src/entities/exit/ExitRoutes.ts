import { ExitController } from "./ExitController";

export const ExitRoutes = [
  {
    method: "get",
    route: "/exit",
    controller: ExitController,
    action: "all"
  },
  {
    method: "get",
    route: "/exit/:id",
    controller: ExitController,
    action: "one"
  },
  {
    method: "post",
    route: "/exit",
    controller: ExitController,
    action: "save"
  },
  {
    method: "delete",
    route: "/exit/:id",
    controller: ExitController,
    action: "remove"
  }
];
