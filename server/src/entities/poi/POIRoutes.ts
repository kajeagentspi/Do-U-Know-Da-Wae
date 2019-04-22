import { POIController } from "./POIController";

export const POIRoutes = [
  {
    method: "get",
    route: "/poi",
    controller: POIController,
    action: "all"
  }
];
