import { getRepository } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import { User, Route, Walk, Jeep, Indoor, POI, Path, Marker, Stop, Exit } from '..';
import { walking, driving } from '../config';
import * as admin from 'firebase-admin';
import * as polyline from '@mapbox/polyline'
import axios from 'axios';

export class RouteController {

  private routeRepository = getRepository(Route);
  private userRepository = getRepository(User);
  private walkRepository = getRepository(Walk);
  private jeepRepository = getRepository(Jeep);
  private indoorRepository = getRepository(Indoor);
  private POIRepository = getRepository(POI);
  private markerRepository = getRepository(Marker);
  private stopRepository = getRepository(Stop);
  private exitRepository = getRepository(Exit);

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
    let { startLat, startLng, endLat, endLng, startId, endId } = request.query;
    let start;
    let end;
    if (startId) {
      start = await this.POIRepository.findOne(startId);
      start = await this.typeCast(start);
    } else if (startLat && startLng) {
      start = await this.markerRepository.save({ lat: startLat, lng: startLng });
    }

    if (endId) {
      end = await this.POIRepository.findOne(endId);
      end = await this.typeCast(end);
    } else if (endLat && endLng) {
      end = await this.markerRepository.save({ lat: endLat, lng: endLng });
    }
    let routes = await this.routeRepository.find({ where: { start, end }, relations: ['start', 'end', 'paths'] });
    try {
      if (!routes.length) {
        switch (start.type) {
          case 'Stop':
          case 'Marker':
          case 'Exit':
            switch (end.type) {
              case 'Stop':
              case 'Marker':
              case 'Exit':
                const searchString = `${start.lng},${start.lat};${end.lng},${end.lat}?alternatives=true`;
                const { data: { routes: paths } } = await axios.get(`${walking}/${searchString}`);
                for(let path of paths){
                  const { geometry, distance, duration } = path;
                  const latLngs = polyline.decode(geometry);
                  const walkingPath = await this.walkRepository.save({ start, end, latLngs, geometry, distance, duration});
                  const contributor = await this.userRepository.findOne(1);
                  await this.routeRepository.save({ start, end, paths: [walkingPath], contributor })
                }
                routes = await this.routeRepository.find({ where: { start, end }, relations: ['start', 'end', 'paths'] });
              break;
              case 'Room':
                // add later
                return {
                  message: 'No routes found',
                  type: 'negative'
                }          
            }            
            break;
          case 'Room':
            return {
              message: 'No routes found',
              type: 'negative'
            }
        }
      }
    } catch (error) {
      console.log(error)
      return {
        message: 'An Error Occured',
        type: 'negative'
      }
    }
    return routes;
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
          const { start, end, latLngs, type, id } = path;
          // path contains latLngs and type
          if(id){
            newPaths.push(path)
          } else {
            let newPath;
            const geometry = polyline.encode(path.latLngs);
            if (type === 'Walk') {
              const searchString = `polyline(${geometry})`;
              const { data: { routes: paths } } = await axios.get(`${walking}/${searchString}`);
              const { distance, duration } = paths[0];
              newPath = await this.walkRepository.save({ start, end, latLngs, distance, duration });
            } else if (type === 'Jeep') {
              const searchString = `polyline(${geometry})`;
              const { data: { routes: paths } } = await axios.get(`${driving}/${searchString}`);
              const { distance, duration } = paths[0];
              newPath = await this.jeepRepository.save({ start, end, latLngs, distance, duration });
            } else if (type === 'Indoor') {
              newPath = await this.indoorRepository.save(path);
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
      console.log(error);
      return {
        message: 'An Error Occurred',
        type: 'negative'
      }
    }
  }

}
