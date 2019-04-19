import {
  SearchPanel,
  SearchScreen,
  ContributePanel,
  ContributeChoice,
  FavoritesPanel,
} from '../components';

const routes = [
  {
    path: '/',
    component: SearchPanel,
    children: [
      {
        path: '',
        name: 'Search Screen',
        component: SearchScreen,
      },
    ],
  },
  {
    path: '/contribute',
    component: ContributePanel,
    children: [
      {
        path: '',
        name: 'Contribute Choice',
        component: ContributeChoice,
      },
    ],
  },
  {
    path: '/favorites',
    component: FavoritesPanel,
  },
];

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue'),
  });
}

export default routes;
