import {
  SearchPanel,
  SearchScreen,
  ContributePanel,
  ContributeChoice,
  FavoritesPanel,
  SelectSearchMethod
} from "../components";

const routes = [
  {
    path: "/",
    component: SearchPanel,
    children: [
      {
        path: "",
        name: "Search Screen",
        component: SearchScreen
      },
      {
        path: "from",
        name: "Select Search Method",
        component: SelectSearchMethod
      },
      {
        path: "to",
        name: "Select Search Method",
        component: SelectSearchMethod
      }
    ]
  },
  {
    path: "/contribute",
    component: ContributePanel,
    children: [
      {
        path: "",
        name: "Contribute Choice",
        component: ContributeChoice
      }
    ]
  },
  {
    path: "/favorites",
    component: FavoritesPanel
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
