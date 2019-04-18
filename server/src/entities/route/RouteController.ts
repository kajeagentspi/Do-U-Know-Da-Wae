import { getRepository } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import { User, Route } from '..';
import * as admin from 'firebase-admin';

export class RouteController {

  private routeRepository = getRepository(Route);
  private userRepository = getRepository(User);

  async all(request: Request, response: Response, next: NextFunction) {
    return this.routeRepository.find({ where: { ...request.query }, relations: ['start', 'end', 'paths'] });
  }

  async one(request: Request, response: Response, next: NextFunction) {
    return this.routeRepository.findOne(request.params.id, { relations: ['start', 'end', 'paths'] });
  }

  async save(request: Request, response: Response, next: NextFunction) {
    try {
      console.log(request.body)
      // const { lat, lng, accessToken, id } = request.body;
      // const { uid } = await admin.auth().verifyIdToken(accessToken);
      // const { type } = await this.userRepository.findOne({ uid });
      // if (type === 'admin' || type === 'contributor') {
      //   if (id) {
      //     await this.routeRepository.update(id, { lat, lng });
      //     return this.routeRepository.findOne(id);
      //   } else {
      //     const marker = await this.routeRepository.save({ lat, lng });
      //     return this.routeRepository.findOne(marker.id);
      //   }
      // } else {
      //   return [];
      // }
    } catch (error) {
      return [];
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    try {
      const { accessToken } = request.body;
      const { uid } = await admin.auth().verifyIdToken(accessToken);
      const user = await this.userRepository.findOne({ uid });
      let route = await this.routeRepository.findOne(request.params.id);
      if (user.type === 'admin' || user.id === route.contributor.id) {
        await this.routeRepository.remove(route);
      }
      return [];
    } catch (error) {
      return [];
    }
  }

}
