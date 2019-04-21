import { getRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import {
  User,
  Route,
  Walk,
  Jeep,
  Indoor,
  POI,
  Path,
  Marker,
  Stop,
  Room,
  Building
} from "..";
import { walking, driving } from "../config";
import * as admin from "firebase-admin";
import * as polyline from "@mapbox/polyline";
import axios from "axios";

export class RouteController {
  private routeRepository = getRepository(Route);
  private userRepository = getRepository(User);
  private walkRepository = getRepository(Walk);
  private jeepRepository = getRepository(Jeep);
  private indoorRepository = getRepository(Indoor);
  private POIRepository = getRepository(POI);
  private markerRepository = getRepository(Marker);
  private stopRepository = getRepository(Stop);
  private roomRepository = getRepository(Room);
  private buildingRepository = getRepository(Building);

  typeCast(id: number, type: String) {
    switch (type) {
      case "Stop":
        return this.stopRepository.findOne(id);
      case "Marker":
        return this.markerRepository.findOne(id);
      case "Room":
        return this.roomRepository.findOne(id, {
          relations: ["building"]
        });
      case "Building":
        return this.buildingRepository.findOne(id);
    }
  }

  async generatePathsFromOSRM(
    startLat: any,
    startLng: any,
    endLat: any,
    endLng: any
  ) {
    const searchString = `${startLng},${startLat};${endLng},${endLat}`;
    console.log(`${walking}/${searchString}?alternatives=true&overview=full`);
    const {
      data: { routes: jeepneyPaths }
    } = await axios.get(
      `${driving}/${searchString}?alternatives=true&overview=full`
    );
    const {
      data: { routes: walkingPaths }
    } = await axios.get(
      `${walking}/${searchString}?alternatives=true&overview=full`
    );
    return {
      jeepneyPaths,
      walkingPaths
    };
  }

  async savePathAndRoute({
    start,
    end,
    latLngs,
    type,
    distance,
    duration,
    geometry,
    instrtuctions,
    contributor
  }) {
    let path;
    switch (type) {
      case "Walk":
        path = await this.walkRepository.save({
          start,
          end,
          latLngs,
          distance,
          duration,
          geometry
        });
        break;
      case "Jeep":
        path = await this.jeepRepository.save({
          start,
          end,
          latLngs,
          distance,
          duration,
          geometry
        });
        break;
      case "Indoor":
        path = await this.indoorRepository.save({
          start,
          end,
          instrtuctions
        });
        break;
    }
    await this.routeRepository.save({
      start,
      end,
      paths: [path],
      contributor,
      distance,
      duration
    });
  }

  async all(request: Request, response: Response, next: NextFunction) {
    let { origin, destination } = request.query;
    let routes = [];
    if (origin && destination) {
      if (origin.id && destination.id) {
        const start = await this.typeCast(origin.id, origin.type);
        const end = await this.typeCast(destination.id, destination.type);
        const dbRoutes = await this.routeRepository.find({
          where: { start, end },
          relations: ["start", "end", "paths"]
        });
        if (dbRoutes.length !== 0) {
          routes.push(...dbRoutes);
        } else {
          if (!(start instanceof Room) || !(end instanceof Room)) {
            const contributor = await this.userRepository.findOne({
              where: {
                uid: "sxdtxH1nOiYizjEMFKjK2EtFruk1"
              }
            });
            const {
              jeepneyPaths,
              walkingPaths
            } = await this.generatePathsFromOSRM(
              start.lat,
              start.lng,
              end.lat,
              end.lng
            );
            for (let path of walkingPaths) {
              const { distance, duration, geometry } = path;
              const latLngs = polyline.decode(geometry);
              this.savePathAndRoute({
                start,
                end,
                latLngs,
                type: "Walk",
                distance,
                duration,
                geometry,
                contributor,
                instrtuctions: null
              });
            }
            // jeepneyPaths for dev only
            for (let path of jeepneyPaths) {
              const { distance, duration, geometry } = path;
              const latLngs = polyline.decode(geometry);
              this.savePathAndRoute({
                start,
                end,
                latLngs,
                type: "Jeep",
                distance,
                duration,
                geometry,
                contributor,
                instrtuctions: null
              });
            }
            routes.push(
              ...(await this.routeRepository.find({
                where: { start, end },
                relations: ["start", "end", "paths"]
              }))
            );
          }
        }
      }
    } else {
      routes.push(
        ...(await this.routeRepository.find({
          relations: ["start", "end", "paths"]
        }))
      );
    }
    return routes;
  }

  async one(request: Request, response: Response, next: NextFunction) {
    return this.routeRepository.findOne(request.params.id, {
      relations: ["start", "end", "paths"]
    });
  }

  async save(request: Request, response: Response, next: NextFunction) {
    try {
      const { paths, accessToken, id } = request.body;
      const { uid } = await admin.auth().verifyIdToken(accessToken);
      const user = await this.userRepository.findOne({ uid });
      if (user.type === "admin" || user.type === "contributor") {
        const newPaths: Path[] = [];
        for (let path of paths) {
          const { start, end, latLngs, type, id } = path;
          // path contains latLngs and type
          if (id) {
            newPaths.push(path);
          } else {
            let newPath;
            const geometry = polyline.encode(path.latLngs);
            if (type === "Walk") {
              const searchString = `polyline(${geometry})`;
              const {
                data: { routes: paths }
              } = await axios.get(`${walking}/${searchString}`);
              const { distance, duration } = paths[0];
              newPath = await this.walkRepository.save({
                start,
                end,
                latLngs,
                distance,
                duration
              });
            } else if (type === "Jeep") {
              const searchString = `polyline(${geometry})`;
              const {
                data: { routes: paths }
              } = await axios.get(`${driving}/${searchString}`);
              const { distance, duration } = paths[0];
              newPath = await this.jeepRepository.save({
                start,
                end,
                latLngs,
                distance,
                duration
              });
            } else if (type === "Indoor") {
              newPath = await this.indoorRepository.save(path);
            }
            newPaths.push(newPath);
          }
        }
        const route = await this.routeRepository.findOne(id);
        const start = await this.POIRepository.findOne(newPaths[0].start.id);
        const end = await this.POIRepository.findOne(
          newPaths[newPaths.length - 1].end.id
        );
        if (route) {
          await this.routeRepository.update(route.id, {
            start,
            end,
            contributor: user,
            paths: newPaths
          });
          return this.routeRepository.findOne(route.id);
        } else {
          return this.routeRepository.save({
            start,
            end,
            contributor: user,
            paths: newPaths
          });
        }
      }
      return {
        message: "Operation not permitted",
        type: "negative"
      };
    } catch (error) {
      console.log(error);
      return {
        message: "An Error Occurred",
        type: "negative"
      };
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    try {
      const { accessToken } = request.body;
      const { uid } = await admin.auth().verifyIdToken(accessToken);
      const user = await this.userRepository.findOne({ uid });
      let route = await this.routeRepository.findOne(request.params.id);
      if (user.type === "admin" || user.id === route.contributor.id) {
        await this.routeRepository.remove(route);
        return {
          message: "Successfully Deleted Route",
          type: "positive"
        };
      }
      return {
        message: "Operation not permitted",
        type: "negative"
      };
    } catch (error) {
      console.log(error);
      return {
        message: "An Error Occurred",
        type: "negative"
      };
    }
  }
}
