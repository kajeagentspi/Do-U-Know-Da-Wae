import { UserController } from "./UserController";

export const UserRoutes = [
  {
    method: "post",
    route: "/user",
    controller: UserController,
    action: "one"
  },
  {
    method: "post",
    route: "/login",
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
