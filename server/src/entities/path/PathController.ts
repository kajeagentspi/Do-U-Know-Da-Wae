import { getRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { Path, POI, Building, Room, Stop, Marker, PathType } from "..";
import { walking } from "../config";
import axios from "axios";
import * as polyline from "@mapbox/polyline";

export class PathController {
  private pathRepository = getRepository(Path);
  private buildingRepository = getRepository(Building);
  private roomRepository = getRepository(Room);
  private stopRepository = getRepository(Stop);
  private markerRepository = getRepository(Marker);

  typeCast(poi) {
    switch (poi.type) {
      case "Building":
        return this.buildingRepository.findOne(poi.id);
      case "Room":
        return this.roomRepository.findOne(poi.id);
      case "Stop":
        return this.stopRepository.findOne(poi.id);
      case "Marker":
        return this.markerRepository.create({ ...poi });
    }
  }

  async all(request: Request, response: Response, next: NextFunction) {
    let { origin, destination, type } = request.query;
    if (origin && destination) {
      origin = await this.typeCast(origin);
      destination = await this.typeCast(destination);
      if (type && type === "Jeep") {
        return this.pathRepository.find({
          origin,
          destination,
          type: PathType.JEEP
        });
      } else if (!(origin instanceof Room) || !(destination instanceof Room)) {
        const OSRMPaths = await this.generateWalkingPathsFromOSRM(
          origin,
          destination
        );
        return this.convertOSRMPaths(origin, destination, OSRMPaths);
      }
    }
  }

  async generateWalkingPathsFromOSRM(origin: any, destination: any) {
    const searchString = `${origin.lng},${origin.lat};${destination.lng},${
      destination.lat
    }`;
    console.log(`${walking}/${searchString}?alternatives=true&overview=full`);
    const {
      data: { routes: paths }
    } = await axios.get(
      `${walking}/${searchString}?alternatives=true&overview=full`
    );
    return paths;
  }

  async convertOSRMPaths(origin: POI, destination: POI, OSRMpaths: any) {
    const paths = [];
    for (let OSRMPath of OSRMpaths) {
      paths.push(
        this.pathRepository.create({
          latLngs: polyline.decode(OSRMPath.geometry),
          geometry: OSRMPath.geometry,
          origin,
          destination,
          distance: OSRMPath.distance,
          duration: OSRMPath.duration,
          type: PathType.WALKING
        })
      );
    }
    return paths;
  }
}
