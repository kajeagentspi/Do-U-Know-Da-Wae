import {
  ContributePanel,
  ContributeChoice,
} from '../components';

const routes = [
  {
    path: '/',
    name: 'search',
  },
  {
    path: '/contribute',
    name: 'contribute',
    component: ContributePanel,
    children: [
      {
        path: '',
        name: 'Contribute Choice',
        component: ContributeChoice,
      },
    ],
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
