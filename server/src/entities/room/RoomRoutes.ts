import { RoomController } from './RoomController';

export const RoomRoutes = [
  {
    method: 'get',
    route: '/room',
    controller: RoomController,
    action: 'all'
  },
  {
    method: 'get',
    route: '/room/:id',
    controller: RoomController,
    action: 'one'
  },
  {
    method: 'post',
    route: '/room',
    controller: RoomController,
    action: 'save'
  },
  {
    method: 'delete',
    route: '/room/:id',
    controller: RoomController,
    action: 'remove'
  }
];