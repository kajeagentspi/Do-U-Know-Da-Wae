import { Wrapper } from "../components";

const routes = [
  {
    path: "/",
    component: Wrapper
  }
];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push({
    path: "*",
    component: () => import("pages/Error404.vue")
  });
}

export default routes;
