import { ExitController } from './ExitController';

export const ExitRoutes = [
  {
    method: 'get',
    route: '/room',
    controller: ExitController,
    action: 'all'
  },
  {
    method: 'get',
    route: '/room/:id',
    controller: ExitController,
    action: 'one'
  },
  {
    method: 'post',
    route: '/room',
    controller: ExitController,
    action: 'save'
  },
  {
    method: 'delete',
    route: '/room/:id',
    controller: ExitController,
    action: 'remove'
  }
];