import { getRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import {
  User,
  Route,
  POI,
  Building,
  Room,
  Stop,
  Path,
  PathType,
  Marker
} from "..";
import { walking } from "../config";
import * as admin from "firebase-admin";
import * as polyline from "@mapbox/polyline";
import axios from "axios";
import { UserType } from "../user/UserModel";

export class RouteController {
  private pathRepository = getRepository(Path);
  private routeRepository = getRepository(Route);
  private buildingRepository = getRepository(Building);
  private roomRepository = getRepository(Room);
  private stopRepository = getRepository(Stop);
  private markerRepository = getRepository(Marker);
  private userRepository = getRepository(User);
  private POIRepository = getRepository(POI);

  async all(request: Request, response: Response, next: NextFunction) {
    let { origin, destination } = request.query;
    let routes = [];
    if (origin && destination) {
      origin = await this.typeCast(origin);
      destination = await this.typeCast(destination);
      routes = await this.routeRepository.find({
        where: { origin, destination },
        relations: [
          "origin",
          "destination",
          "paths",
          "paths.origin",
          "paths.destination",
          "contributor"
        ]
      });
      if (routes.length === 0) {
        if (origin instanceof Room && destination instanceof Room) {
          if (origin.building === destination.building) {
            routes = await this.getBuildingOrRoomToSameBuildingRoutes(
              origin,
              destination
            );
          } else {
            routes = await this.getRoomToRoomDifferentBuilding(
              origin,
              destination
            );
          }
        } else if (origin instanceof Room && destination instanceof Building) {
          if (origin.building === destination) {
            routes = await this.getRoomToSameBuildingRoutes(
              origin,
              destination
            );
          } else {
            routes = await this.getRoomToPOIRoutes(origin, destination);
          }
        } else if (origin instanceof Room && destination instanceof Stop) {
          routes = await this.getRoomToPOIRoutes(origin, destination);
        } else if (origin instanceof Room && destination instanceof Marker) {
          routes = await this.getRoomToPOIRoutes(origin, destination);
        } else if (
          origin instanceof Building &&
          destination instanceof Building
        ) {
          routes = await this.getPOIToPOIExceptRoomRoutes(origin, destination);
        } else if (origin instanceof Building && destination instanceof Stop) {
          routes = await this.getPOIToPOIExceptRoomRoutes(origin, destination);
        } else if (
          origin instanceof Building &&
          destination instanceof Marker
        ) {
          routes = await this.getPOIToPOIExceptRoomRoutes(origin, destination);
        } else if (origin instanceof Building && destination instanceof Room) {
          if (origin === destination.building) {
            routes = await this.getBuildingOrRoomToSameBuildingRoutes(
              origin,
              destination
            );
          } else {
            routes = await this.POIToRoomRoutes(origin, destination);
          }
        } else if (origin instanceof Stop && destination instanceof Stop) {
          routes = await this.getPOIToPOIExceptRoomRoutes(origin, destination);
        } else if (origin instanceof Stop && destination instanceof Marker) {
          routes = await this.getPOIToPOIExceptRoomRoutes(origin, destination);
        } else if (origin instanceof Stop && destination instanceof Room) {
          routes = await this.POIToRoomRoutes(origin, destination);
        } else if (origin instanceof Stop && destination instanceof Building) {
          routes = await this.getPOIToPOIExceptRoomRoutes(origin, destination);
        } else if (origin instanceof Marker && destination instanceof Marker) {
          routes = await this.getPOIToPOIExceptRoomRoutes(origin, destination);
        } else if (origin instanceof Marker && destination instanceof Room) {
          routes = await this.POIToRoomRoutes(origin, destination);
        } else if (
          origin instanceof Marker &&
          destination instanceof Building
        ) {
          routes = await this.getPOIToPOIExceptRoomRoutes(origin, destination);
        } else if (origin instanceof Marker && destination instanceof Marker) {
          routes = await this.getPOIToPOIExceptRoomRoutes(origin, destination);
        }
      }
    } else {
      routes = await this.routeRepository.find({
        relations: [
          "origin",
          "destination",
          "paths",
          "paths.origin",
          "paths.destination",
          "contributor"
        ]
      });
    }
    return routes;
  }

  async bookmark(request: Request, response: Response, next: NextFunction) {
    const { accessToken, routeId } = request.body;
    const { uid } = await admin.auth().verifyIdToken(accessToken);
    const user = await this.userRepository.findOne(null, {
      where: { uid },
      relations: ["bookmarks"]
    });
    if (user.type !== UserType.BANNED) {
      const route = await this.routeRepository.findOne(routeId);
      const bookmarkedIds = user.bookmarks.map(bookmark => bookmark.id);
      if (route.id in bookmarkedIds) {
        return {
          message: "Route bookmarked already",
          color: "negative"
        };
      } else if (user && route) {
        user.bookmarks.push(route);
        this.userRepository.save(user);
        return {
          message: "Added to bookmarks",
          color: "positive"
        };
      }
    }
    return {
      message: "Failed to add to bookmarks",
      color: "negative"
    };
  }

  async one(request: Request, response: Response, next: NextFunction) {
    return this.routeRepository.findOne(request.params.id, {
      relations: [
        "origin",
        "destination",
        "paths",
        "paths.origin",
        "paths.destination",
        "contributor"
      ]
    });
  }

  async save(request: Request, response: Response, next: NextFunction) {
    try {
      const { paths, accessToken } = request.body;
      const { uid } = await admin.auth().verifyIdToken(accessToken);
      const user = await this.userRepository.findOne(null, { where: { uid } });
      if (user.type === "admin" || user.type === "contributor") {
        const dbPaths: Path[] = [];
        let distance = 0;
        let duration = 0;
        for (let path of paths) {
          if (path.id) {
            const dbPath = await this.pathRepository.findOne(path.id, {
              relations: ["origin", "destination"]
            });
            distance += dbPath.distance;
            duration += dbPath.duration;
            dbPaths.push(dbPath);
          } else {
            let { origin, destination } = path;
            origin = await this.POIRepository.findOne(origin.id);
            destination = await this.POIRepository.findOne(destination.id);
            const newPath = await this.pathRepository.save({
              ...path,
              origin,
              destination
            });
            const dbPath = await this.pathRepository.findOne(newPath.id, {
              relations: ["origin", "destination"]
            });
            distance += dbPath.distance;
            duration += dbPath.duration;
            dbPaths.push(dbPath);
          }
        }
        const origin = dbPaths[0].origin;
        const destination = dbPaths[dbPaths.length - 1].destination;
        const pathIDs = dbPaths.map(path => path.id);
        const saved = await this.routeRepository.save({
          origin,
          destination,
          paths: dbPaths,
          pathString: pathIDs.toString(),
          contributor: user,
          distance,
          duration
        });
        return this.routeRepository.findOne(saved.id, {
          relations: [
            "origin",
            "destination",
            "paths",
            "paths.origin",
            "paths.destination",
            "contributor"
          ]
        });
      } else {
        return {
          message: "UP Mail required to contribute",
          color: "negative"
        };
      }
    } catch (error) {
      return {
        message: "An error occured",
        color: "negative"
      };
    }
  }

  async delete(request: Request, response: Response, next: NextFunction) {}

  typeCast(poi) {
    switch (poi.type) {
      case "Building":
        return this.buildingRepository.findOne(poi.id, {
          relations: ["rooms"]
        });
      case "Room":
        return this.roomRepository.findOne(poi.id, { relations: ["building"] });
      case "Stop":
        return this.stopRepository.findOne(poi.id);
      case "Marker":
        return this.markerRepository.create({ ...poi });
    }
  }

  async mergeRoutes(start: Route[], end: Route[]) {
    const routes = [];
    const contributor = await this.userRepository.findOne(null, {
      where: {
        uid: "sxdtxH1nOiYizjEMFKjK2EtFruk1"
      }
    });
    for (let startToMidRoute of start) {
      for (let midToEnd of end) {
        routes.push({
          origin: startToMidRoute.origin,
          destination: midToEnd.destination,
          paths: [...startToMidRoute.paths, ...midToEnd.paths],
          distance: startToMidRoute.distance + midToEnd.distance,
          duration: startToMidRoute.duration + midToEnd.duration,
          contributor
        });
      }
    }
    return routes;
  }

  async deduplicateRoutes(routes: Route[]) {
    const deduplicatedRoutes = [];
    for (let route of routes) {
      const pathIDs = route.paths.map(path => path.id);
      const inRepo = await this.routeRepository.find({
        pathString: pathIDs.toString()
      });
      if (inRepo.length === 0) {
        route.pathString = pathIDs.toString();
        deduplicatedRoutes.push(route);
      }
    }
    return deduplicatedRoutes;
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
      const inRepo = await this.pathRepository.find({
        where: { geometry: OSRMPath.geometry, type: PathType.WALKING }
      });
      if (inRepo.length === 0) {
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
    }
    return paths;
  }

  // originRoom.building === destinationBuilding
  async getRoomToSameBuildingRoutes(origin: Room, destination: Building) {
    const contributor = await this.userRepository.findOne(null, {
      where: {
        uid: "sxdtxH1nOiYizjEMFKjK2EtFruk1"
      }
    });
    const systemGeneratedRoutes = await this.routeRepository.find({
      origin,
      destination,
      contributor
    });

    if (systemGeneratedRoutes.length === 0) {
      const path = await this.pathRepository.save({
        type: PathType.INDOOR,
        instructions: `Walk outside ${destination.name}`,
        origin,
        destination
      });
      await this.routeRepository.save({
        origin,
        destination,
        paths: [path],
        pathString: path.id.toString(),
        contributor
      });
    }
    return this.routeRepository.find({
      where: { origin, destination },
      relations: [
        "origin",
        "destination",
        "paths",
        "paths.origin",
        "paths.destination",
        "contributor"
      ]
    });
  }

  // originBuilding === destinationRoom.building
  // originRoom.building === destinationRoom.building
  async getBuildingOrRoomToSameBuildingRoutes(origin: POI, destination: Room) {
    const contributor = await this.userRepository.findOne(null, {
      where: {
        uid: "sxdtxH1nOiYizjEMFKjK2EtFruk1"
      }
    });
    const routes = await this.routeRepository.find({
      where: { origin, destination },
      relations: [
        "origin",
        "destination",
        "paths",
        "paths.origin",
        "paths.destination",
        "contributor"
      ]
    });
    if (routes.length === 0) {
      const path = this.pathRepository.create({
        type: PathType.INDOOR,
        instructions: `No indoor paths available yet.`,
        origin,
        destination
      });
      routes.push(
        this.routeRepository.create({
          origin,
          destination,
          paths: [path],
          contributor
        })
      );
    }
    return routes;
  }

  async getPOIToPOIExceptRoomRoutes(origin: POI, destination: POI) {
    const contributor = await this.userRepository.findOne(null, {
      where: {
        uid: "sxdtxH1nOiYizjEMFKjK2EtFruk1"
      }
    });
    const systemGeneratedRoutes = await this.routeRepository.find({
      where: { origin, destination, contributor },
      relations: [
        "origin",
        "destination",
        "paths",
        "paths.origin",
        "paths.destination",
        "contributor"
      ]
    });
    let routes = await this.routeRepository.find({
      where: { origin, destination },
      relations: [
        "origin",
        "destination",
        "paths",
        "paths.origin",
        "paths.destination",
        "contributor"
      ]
    });
    if (systemGeneratedRoutes.length === 0) {
      const OSRMPaths = await this.generateWalkingPathsFromOSRM(
        origin,
        destination
      );
      const tempPaths = await this.convertOSRMPaths(
        origin,
        destination,
        OSRMPaths
      );
      if (!(origin instanceof Marker) && !(destination instanceof Marker)) {
        const paths = await this.pathRepository.save(tempPaths);
        await Promise.all(
          paths.map(async path => {
            await this.routeRepository.save({
              origin,
              destination,
              paths: [path],
              pathString: path.id.toString(),
              distance: path.distance,
              duration: path.duration,
              contributor
            });
          })
        );
        routes = await this.routeRepository.find({
          where: { origin, destination },
          relations: [
            "origin",
            "destination",
            "paths",
            "paths.origin",
            "paths.destination",
            "contributor"
          ]
        });
      } else {
        routes.push(
          ...tempPaths.map(path =>
            this.routeRepository.create({
              origin,
              destination,
              paths: [path],
              distance: path.distance,
              duration: path.duration,
              contributor
            })
          )
        );
      }
    }
    return routes;
  }

  // room => indoor => building => walk => building
  // room => indoor => building => walk => stop
  // room => indoor => building => walk => marker
  async getRoomToPOIRoutes(origin: Room, destination: POI) {
    const roomToBuildingRoutes = await this.getRoomToSameBuildingRoutes(
      origin,
      origin.building
    );
    const buildingToBuildingRoutes = await this.getPOIToPOIExceptRoomRoutes(
      origin.building,
      destination
    );
    const tempRoutes = await this.mergeRoutes(
      roomToBuildingRoutes,
      buildingToBuildingRoutes
    );
    const newRoutes = await this.deduplicateRoutes(tempRoutes);
    if (!(destination instanceof Marker)) {
      await this.routeRepository.save(newRoutes);
      return this.routeRepository.find({
        where: { origin, destination },
        relations: [
          "origin",
          "destination",
          "paths",
          "paths.origin",
          "paths.destination",
          "contributor"
        ]
      });
    } else {
      return newRoutes;
    }
  }

  // room => indoor => building => walk => building => indoor => room
  async getRoomToRoomDifferentBuilding(origin: Room, destination: Room) {
    const roomToDiffBuildingRoutes = await this.getRoomToPOIRoutes(
      origin,
      destination.building
    );
    const destBuildingtoDestRoomRoutes = await this.getBuildingOrRoomToSameBuildingRoutes(
      destination.building,
      destination
    );
    const tempRoutes = await this.mergeRoutes(
      roomToDiffBuildingRoutes,
      destBuildingtoDestRoomRoutes
    );

    const newRoutes = await this.deduplicateRoutes(tempRoutes);
    if (
      destBuildingtoDestRoomRoutes[0].paths[0].instructions !==
      "No indoor paths available yet."
    ) {
      await this.routeRepository.save(newRoutes);
      return this.routeRepository.find({
        where: { origin, destination },
        relations: [
          "origin",
          "destination",
          "paths",
          "paths.origin",
          "paths.destination",
          "contributor"
        ]
      });
    } else {
      return newRoutes;
    }
  }

  async POIToRoomRoutes(origin: POI, destination: Room) {
    const poiToBuildingRoutes = await this.getPOIToPOIExceptRoomRoutes(
      origin,
      destination.building
    );
    const destBuildingtoDestRoomRoutes = await this.getBuildingOrRoomToSameBuildingRoutes(
      destination.building,
      destination
    );
    const tempRoutes = await this.mergeRoutes(
      poiToBuildingRoutes,
      destBuildingtoDestRoomRoutes
    );
    const newRoutes = await this.deduplicateRoutes(tempRoutes);
    if (
      !(origin instanceof Marker) &&
      destBuildingtoDestRoomRoutes[0].paths[0].instructions !==
        "No indoor paths available yet."
    ) {
      await this.routeRepository.save(newRoutes);
      return this.routeRepository.find({
        where: { origin, destination },
        relations: [
          "origin",
          "destination",
          "paths",
          "paths.origin",
          "paths.destination",
          "contributor"
        ]
      });
    } else {
      return newRoutes;
    }
  }
}
