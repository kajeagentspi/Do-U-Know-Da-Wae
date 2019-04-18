import { StopController } from './StopController';

export const StopRoutes = [
  {
    method: 'get',
    route: '/stop',
    controller: StopController,
    action: 'all'
  },
  {
    method: 'get',
    route: '/stop/:id',
    controller: StopController,
    action: 'one'
  },
  {
    method: 'post',
    route: '/stop',
    controller: StopController,
    action: 'save'
  },
  {
    method: 'delete',
    route: '/stop/:id',
    controller: StopController,
    action: 'remove'
  }
];
