import { getRepository } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import { User, Path, POI, Stop, Exit, Jeep, Walk, Indoor, Room, Marker, Route } from '..';
import { walking, driving } from '../config';
import * as admin from 'firebase-admin';
import * as polyline from '@mapbox/polyline'
import axios from 'axios';

export class PathController {

  private userRepository = getRepository(User);
  private POIRepository = getRepository(POI);
  private stopRepository = getRepository(Stop);
  private markerRepository = getRepository(Marker);
  private roomRepository = getRepository(Room);
  private exitRepository = getRepository(Exit);
  private pathRepository = getRepository(Path);
  private walkRepository = getRepository(Walk);
  private jeepRepository = getRepository(Jeep);
  private indoorRepository = getRepository(Indoor);
  private routeRepository = getRepository(Route);

  typeCast(poi: POI) {
    switch (String(poi.type)) {
      case 'Stop':
        return this.stopRepository.findOne(poi.id);
      case 'Marker':
        return this.markerRepository.findOne(poi.id);
      case 'Exit':
        return this.exitRepository.findOne(poi.id);
    }
  }
  async all(request: Request, response: Response, next: NextFunction) {
    const { type, startId, endId } = request.query;
    let paths = await this.pathRepository.find({ where: { ...request.query }, relations: ['start', 'end'] });
    try {
      if (!paths.length && type && type !== 'Indoor') {
        const startTemp = await this.POIRepository.findOne(startId);
        const endTemp = await this.POIRepository.findOne(endId);
        const start = await this.typeCast(startTemp);
        const end = await this.typeCast(endTemp);
        let searchString;
        let routes;
        if (type === 'Walk') {
          searchString = `${start.lng},${start.lat};${end.lng},${end.lat}?alternatives=true`
          const { data: { routes } } = await axios.get(`${walking}/${searchString}`)
          for(let route of routes){
            const { geometry, distance, duration } = route;
            const latLngs = polyline.decode(geometry);
            const walkingPath = await this.walkRepository.save({ start, end, latLngs, geometry, distance, duration });
            const contributor = await this.userRepository.findOne(1);
            await this.routeRepository.save({ start, end, paths: [walkingPath], contributor })
          }
        } else if (type === 'Jeep') {
          searchString = `${start.lng},${start.lat};${end.lng},${end.lat}?alternatives=true`
          const { data: { routes } } = await axios.get(`${walking}/${searchString}`)
          for(let route of routes){
            const { geometry, distance, duration } = route;
            const latLngs = polyline.decode(geometry);
            const walkingPath = await this.jeepRepository.save({ start, end, latLngs, geometry, distance, duration});
            const contributor = await this.userRepository.findOne(1);
            await this.routeRepository.save({ start, end, paths: [walkingPath], contributor })
          }
        }
        paths = await this.pathRepository.find({ where: { ...request.query }, relations: ['start', 'end'] });
      }  
    } catch (error) {
      console.log(error)
      return {
        message: 'An Error Occured',
        type: 'negative'
      }
    }
    return paths
  }

  async one(request: Request, response: Response, next: NextFunction) {
    return this.pathRepository.findOne(request.params.id, { relations: ['start', 'end'] });
  }
  
  async save(request: Request, response: Response, next: NextFunction) {
    try {
      const { startId, endId, type, latLngs, instructions, accessToken } = request.body;
      const { uid } = await admin.auth().verifyIdToken(accessToken);
      const { type: userType } = await this.userRepository.findOne({ uid });
      if (userType === 'admin' || userType === 'contributor') {
        const start = await this.POIRepository.findOne(startId);
        const end = await this.POIRepository.findOne(endId);
        switch (type) {
          case 'jeep':
            if (start instanceof Stop && end instanceof Stop) {
              const path = await this.jeepRepository.save({ start, end, latLngs });
              return this.jeepRepository.findOne(path.id, { relations: ['start', 'end'] });
            } else {
              return {
                message: 'Invalid Points of Interest'
              }
            }
          case 'walk':
            if (!(start instanceof Room) && !(end instanceof Room)) {
              const path = await this.walkRepository.save({ start, end, latLngs });
              return this.walkRepository.findOne(path.id, { relations: ['start', 'end'] });
            } else {
              return {
                message: 'Invalid Points of Interest'
              }
            }
          case 'indoor':
            if ((start instanceof Exit && end instanceof Room) || (start instanceof Room && end instanceof Exit)) {
              const path = await this.indoorRepository.save({ start, end, instructions });
              return this.indoorRepository.findOne(path.id, { relations: ['start', 'end'] });
            } else {
              return {
                message: 'Invalid Points of Interest'
              }
            }
        }
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
