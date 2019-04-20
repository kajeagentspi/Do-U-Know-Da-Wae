import { MarkerController } from "./MarkerController";

export const MarkerRoutes = [
  {
    method: "get",
    route: "/marker",
    controller: MarkerController,
    action: "all"
  },
  {
    method: "get",
    route: "/marker/:id",
    controller: MarkerController,
    action: "one"
  },
  {
    method: "post",
    route: "/marker",
    controller: MarkerController,
    action: "save"
  },
  {
    method: "delete",
    route: "/marker/:id",
    controller: MarkerController,
    action: "remove"
  }
];
