import { UserController } from "./UserController";

export const UserRoutes = [
  {
    method: "get",
    route: "/user",
    controller: UserController,
    action: "all"
  },
  {
    method: "get",
    route: "/user/:id",
    controller: UserController,
    action: "one"
  },
  {
    method: "post",
    route: "/user",
    controller: UserController,
    action: "save"
  },
  {
    method: "delete",
    route: "/user/:id",
    controller: UserController,
    action: "remove"
  }
];
