import { getRepository } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import { User, Route, Walk, Jeep, Indoor, POI, Path } from '..';
import * as admin from 'firebase-admin';

export class RouteController {

  private routeRepository = getRepository(Route);
  private userRepository = getRepository(User);
  private walkRepository = getRepository(Walk);
  private jeepRepository = getRepository(Jeep);
  private indoorRepository = getRepository(Indoor);
  private POIRepository = getRepository(POI);
  
  async all(request: Request, response: Response, next: NextFunction) {
    return this.routeRepository.find({ where: { ...request.query }, relations: ['start', 'end', 'paths'] });
  }

  async one(request: Request, response: Response, next: NextFunction) {
    return this.routeRepository.findOne(request.params.id, { relations: ['start', 'end', 'paths'] });
  }

  async save(request: Request, response: Response, next: NextFunction) {
    try {
      const { paths, accessToken, id } = request.body
      const { uid } = await admin.auth().verifyIdToken(accessToken);
      const user = await this.userRepository.findOne({ uid });
      if (user.type === 'admin' || user.type === 'contributor') {
        const newPaths: Path[] = []
        for (let path of paths) {
          if(path.hasOwnProperty('id')){
            newPaths.push(path)
          } else {
            let newPath;
            switch (path.type) {
              case 'Walk':
                newPath = await this.walkRepository.save(path);
                break;
              case 'Jeep':
                newPath = await this.jeepRepository.save(path);
                break;
              case 'Indoor':
                newPath = await this.indoorRepository.save(path);
                break;
            }
            newPaths.push(newPath)
          }
        }
        const route = await this.routeRepository.findOne(id);
        const start = await this.POIRepository.findOne(newPaths[0].start.id)
        const end = await this.POIRepository.findOne(newPaths[newPaths.length - 1].end.id)
        if (route) {
          await this.routeRepository.update(route.id, { start, end, contributor: user, paths: newPaths });
          return this.routeRepository.findOne(route.id);
        } else {
          return this.routeRepository.save({ start, end, contributor: user, paths: newPaths });
        }
      }
      return {
        message: 'Operation not permitted',
        type: 'negative'
      }
    } catch (error) {
      console.log(error)
      return {
        message: 'An Error Occurred',
        type: 'negative'
      }
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
        return {
          message: 'Successfully Deleted Route',
          type: 'positive'
        };
      }
      return {
        message: 'Operation not permitted',
        type: 'negative'
      }
    } catch (error) {
      return {
        message: 'An Error Occurred',
        type: 'negative'
      }
    }
  }

}
