import { POIController } from "./POIController";

export const POIRoutes = [
  {
    method: "get",
    route: "/poi",
    controller: POIController,
    action: "all"
  },
  {
    method: "get",
    route: "/roomBuilding",
    controller: POIController,
    action: "roomBuilding"
  }
];
