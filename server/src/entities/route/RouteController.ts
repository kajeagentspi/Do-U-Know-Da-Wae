import { getRepository, Like } from "typeorm";
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
import { walking, driving } from "../config";
import * as admin from "firebase-admin";
import * as polyline from "@mapbox/polyline";
import axios from "axios";
import { Routes } from "../../routes";

export class RouteController {
  private pathRepository = getRepository(Path);
  private routeRepository = getRepository(Route);
  private buildingRepository = getRepository(Building);
  private roomRepository = getRepository(Room);
  private stopRepository = getRepository(Stop);
  private markerRepository = getRepository(Marker);
  private userRepository = getRepository(User);

  async all(request: Request, response: Response, next: NextFunction) {
    let { origin, destination } = request.query;
    console.log(origin, destination);
    const contributor = await this.userRepository.findOne(null, {
      where: {
        uid: "sxdtxH1nOiYizjEMFKjK2EtFruk1"
      }
    });
    let routes = [];
    if (origin && destination) {
      origin = await this.typeCast(origin);
      destination = await this.typeCast(destination);
      routes = await this.routeRepository.find({ origin, destination });
      // add systemGeneratedRoute check to ensure that system routes are already generated
      const systemGeneratedRoutes = await this.routeRepository.find({
        origin,
        destination,
        contributor
      });
      if (routes.length === 0 || systemGeneratedRoutes.length === 0) {
        if (origin instanceof Room && destination instanceof Room) {
        } else if (origin instanceof Room && destination instanceof Building) {
        } else if (origin instanceof Room && destination instanceof Stop) {
        } else if (origin instanceof Room && destination instanceof Marker) {
        } else if (
          origin instanceof Building &&
          destination instanceof Building
        ) {
          // Walking Only
          await this.getPOItoPOIExceptRoomWalkingPaths(origin, destination);
          // With Jeep
          routes = await this.routeRepository.find({ origin, destination });
        } else if (origin instanceof Building && destination instanceof Stop) {
          // Walking Only
          await this.getPOItoPOIExceptRoomWalkingPaths(origin, destination);
          // With Jeep
          routes = await this.routeRepository.find({ origin, destination });
        } else if (
          origin instanceof Building &&
          destination instanceof Marker
        ) {
          // Walking Only
          const paths = await this.getPOItoPOIExceptRoomWalkingPaths(
            origin,
            destination
          );
          routes.push(
            ...paths.map(path =>
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
          // With Jeep
        } else if (origin instanceof Building && destination instanceof Room) {
        } else if (origin instanceof Stop && destination instanceof Stop) {
          // Walking Only
          await this.getPOItoPOIExceptRoomWalkingPaths(origin, destination);
          // With Jeep
          routes = await this.routeRepository.find({ origin, destination });
        } else if (origin instanceof Stop && destination instanceof Marker) {
          // Walking Only
          const paths = await this.getPOItoPOIExceptRoomWalkingPaths(
            origin,
            destination
          );
          routes.push(
            ...paths.map(path =>
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
          // With Jeep
        } else if (origin instanceof Stop && destination instanceof Room) {
        } else if (origin instanceof Stop && destination instanceof Building) {
          // Walking Only
          await this.getPOItoPOIExceptRoomWalkingPaths(origin, destination);
          // With Jeep
          routes = await this.routeRepository.find({ origin, destination });
        } else if (origin instanceof Marker && destination instanceof Marker) {
          // Walking Only
          const paths = await this.getPOItoPOIExceptRoomWalkingPaths(
            origin,
            destination
          );
          routes.push(
            ...paths.map(path =>
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
          // With Jeep
        } else if (origin instanceof Marker && destination instanceof Room) {
        } else if (
          origin instanceof Marker &&
          destination instanceof Building
        ) {
          // Walking Only
          const paths = await this.getPOItoPOIExceptRoomWalkingPaths(
            origin,
            destination
          );
          routes.push(
            ...paths.map(path =>
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
          // With Jeep
        } else if (origin instanceof Marker && destination instanceof Marker) {
          // Walking Only
          const paths = await this.getPOItoPOIExceptRoomWalkingPaths(
            origin,
            destination
          );
          routes.push(
            ...paths.map(path => {
              this.routeRepository.create({
                origin,
                destination,
                paths: [path],
                distance: path.distance,
                duration: path.duration,
                contributor
              });
            })
          );
          // With Jeep
        }
      }
    } else {
      routes = await this.routeRepository.find();
    }
    return routes;
  }

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

  convertOSRMPaths(origin: POI, destination: POI, OSRMpaths: any) {
    const paths = [];
    for (let OSRMPath of OSRMpaths) {
      if (
        !this.pathRepository.findOne(null, {
          where: { geometry: OSRMPath.geometry }
        })
      ) {
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

  // building => walk => building
  // building => walk => stop
  // building => walk => marker
  // stop => walk => stop
  // stop => walk => building
  // stop => walk => marker
  // marker => walk => stop
  // marker => walk => building
  // marker => walk => marker
  async getPOItoPOIExceptRoomWalkingPaths(origin: POI, destination: POI) {
    let paths = await this.pathRepository.find({ origin, destination });
    if (paths.length === 0) {
      const contributor = await this.userRepository.findOne(null, {
        where: {
          uid: "sxdtxH1nOiYizjEMFKjK2EtFruk1"
        }
      });
      const OSRMPaths = await this.generateWalkingPathsFromOSRM(
        origin,
        destination
      );
      const tempPaths = this.convertOSRMPaths(origin, destination, OSRMPaths);
      if (!(origin instanceof Marker) && !(destination instanceof Marker)) {
        paths = await this.pathRepository.save(tempPaths);
        await Promise.all(
          paths.map(path => {
            this.routeRepository.save({
              origin,
              destination,
              paths: [path],
              distance: path.distance,
              duration: path.duration,
              contributor,
              geometry: path.geometry
            });
          })
        );
      } else {
        paths = tempPaths;
      }
    }
    return paths;
  }

  // room => indoor => building
  async getRoomToBuildingIndoorPaths(origin: Room, destination: Building) {
    let paths = await this.pathRepository.find({ origin, destination });
    if (paths.length === 0) {
      const contributor = await this.userRepository.findOne(null, {
        where: {
          uid: "sxdtxH1nOiYizjEMFKjK2EtFruk1"
        }
      });
      const path = await this.pathRepository.save({
        type: PathType.INDOOR,
        instructions: `Walk outside ${destination.name}`,
        origin,
        destination
      });
      paths.push(path);
      await this.routeRepository.save({
        origin,
        destination,
        paths: [path],
        contributor
      });
    }
    return paths;
  }

  // building => indoor => room
  // room => indoor => room
  async getRoomBuildingToRoomIndoorPaths(origin: POI, destination: Room) {
    let paths = await this.pathRepository.find({ origin, destination });
    if (paths.length === 0) {
      const path = await this.pathRepository.create({
        type: PathType.INDOOR,
        instructions: `No indoor paths available yet.`,
        origin,
        destination
      });
      paths.push(path);
    }
    return paths;
  }
  // async getRoomToStopRoutes(origin: Room, destination: Stop) {
  //   //    roomtoBuilding = get room to building route
  //   //    buildingToStop = get building to stop route
  //   const routes = [];
  //   const contributor = await this.userRepository.findOne(null, {
  //     where: {
  //       uid: "sxdtxH1nOiYizjEMFKjK2EtFruk1"
  //     }
  //   });
  //   const building = await this.buildingRepository.findOne(origin.building.id);
  //   const roomToBuildingRoutes = await this.routeRepository.find({
  //     origin,
  //     destination: building
  //   });
  //   let buildingToStopRoutes = await this.routeRepository.find({
  //     origin: building,
  //     destination
  //   });

  //   // roomToBuilding && buildingToStop => combine //save to db
  //   // roomToBuilding => generateBuildingToStop then combine //save to db
  //   // buildingToStop => insert dummy path return to user // no save
  //   // else get buildingToStop then insert dummy path // save buildingToStop
  //   if (
  //     roomToBuildingRoutes.length !== 0 &&
  //     buildingToStopRoutes.length !== 0
  //   ) {
  //     // new route paths = [...roomtoBuilding.paths, ...buildingToStop.paths]
  //     // save to db
  //     const listOfPaths = [];
  //     for (let roomToBuildingRoute of roomToBuildingRoutes) {
  //       for (let buildingToStopRoute of buildingToStopRoutes) {
  //         listOfPaths.push([
  //           ...roomToBuildingRoute.paths,
  //           ...buildingToStopRoute.paths
  //         ]);
  //       }
  //     }
  //     for (let paths of listOfPaths) {
  //       await this.routeRepository.save({
  //         origin,
  //         destination,
  //         paths,
  //         contributor
  //       });
  //     }
  //     routes.push(
  //       ...(await this.routeRepository.find({ origin, destination }))
  //     );
  //   } else if (roomToBuildingRoutes.length !== 0) {
  //     // query osrm start: building end: stop
  //     // save to db route path walking
  //     // query osrm start: stop end: building
  //     // save to db route path walking
  //     // get buildingtostop paths
  //     // combine each result to roomtobuilding
  //     // path => [..roomtobuilding.paths, buildingtostop]
  //     // save to db
  //     // get and push
  //     const paths = [
  //       ...(await this.generatePathsFromOSRM(building, destination)),
  //       ...(await this.generatePathsFromOSRM(destination, building))
  //     ];
  //     await this.saveOSRMDataAsPathAndRoute(paths, building, destination);
  //     const buildingToStopPaths = await this.pathRepository.find({
  //       origin: building,
  //       destination
  //     });
  //     for (let roomToBuildingRoute of roomToBuildingRoutes) {
  //       for (let buildingToStopPath of buildingToStopPaths) {
  //         await this.routeRepository.save({
  //           origin,
  //           destination,
  //           paths: [...roomToBuildingRoute.paths, buildingToStopPath],
  //           contributor
  //         });
  //       }
  //     }
  //     routes.push(
  //       ...(await this.routeRepository.find({ origin, destination }))
  //     );
  //   } else if (buildingToStopRoutes.length !== 0) {
  //     const instructionPath = new Path();
  //     Object.assign(instructionPath, {
  //       instructions: "Exit the Building",
  //       origin,
  //       destination: building,
  //       type: PathType.INDOOR
  //     });
  //     routes.push(
  //       ...buildingToStopRoutes.map(buildingToStopRoute => {
  //         buildingToStopRoute.origin = origin;
  //         buildingToStopRoute.paths = [
  //           instructionPath,
  //           ...buildingToStopRoute.paths
  //         ];
  //         return buildingToStopRoute;
  //       })
  //     );
  //   } else {
  //     const instructionPath = new Path();
  //     Object.assign(instructionPath, {
  //       instructions: "Exit the Building",
  //       origin,
  //       destination: building,
  //       type: PathType.INDOOR
  //     });
  //     const paths = [
  //       ...(await this.generatePathsFromOSRM(building, destination)),
  //       ...(await this.generatePathsFromOSRM(destination, building))
  //     ];
  //     await this.saveOSRMDataAsPathAndRoute(paths, building, destination);
  //     buildingToStopRoutes = await this.routeRepository.find({
  //       origin: building,
  //       destination
  //     });
  //     routes.push(
  //       ...buildingToStopRoutes.map(buildingToStopRoute => {
  //         buildingToStopRoute.origin = origin;
  //         buildingToStopRoute.paths = [
  //           instructionPath,
  //           ...buildingToStopRoute.paths
  //         ];
  //         return buildingToStopRoute;
  //       })
  //     );
  //   }
  //   return routes;
  // }

  // async getStopToRoomRoutes(origin: Stop, destination: Room) {
  //   const routes = [];
  //   const contributor = await this.userRepository.findOne(null, {
  //     where: {
  //       uid: "sxdtxH1nOiYizjEMFKjK2EtFruk1"
  //     }
  //   });
  //   const building = await this.buildingRepository.findOne(
  //     destination.building.id
  //   );
  //   const stopToBuildingRoutes = await this.routeRepository.find({
  //     origin,
  //     destination: building
  //   });
  //   let buildingToRoomRoutes = await this.routeRepository.find({
  //     origin: building,
  //     destination
  //   });
  //   if (
  //     stopToBuildingRoutes.length !== 0 &&
  //     buildingToRoomRoutes.length !== 0
  //   ) {
  //     const listOfPaths = [];
  //     for (let stopToBuildingRoute of stopToBuildingRoutes) {
  //       for (let buildingToRoomRoute of buildingToRoomRoutes) {
  //         listOfPaths.push([
  //           ...stopToBuildingRoute.paths,
  //           ...buildingToRoomRoute.paths
  //         ]);
  //       }
  //     }
  //     for (let paths of listOfPaths) {
  //       await this.routeRepository.save({
  //         origin,
  //         destination,
  //         paths,
  //         contributor
  //       });
  //     }
  //     routes.push(
  //       ...(await this.routeRepository.find({ origin, destination }))
  //     );
  //   } else if (stopToBuildingRoutes.length !== 0) {
  //     const instructionPath = new Path();
  //     Object.assign(instructionPath, {
  //       instructions: "No building to room available",
  //       origin: building,
  //       destination,
  //       type: PathType.INDOOR
  //     });
  //     routes.push(
  //       ...stopToBuildingRoutes.map(stopToBuildingRoute => {
  //         stopToBuildingRoute.destination = destination;
  //         stopToBuildingRoute.paths = [
  //           ...stopToBuildingRoute.paths,
  //           instructionPath
  //         ];
  //         return stopToBuildingRoute;
  //       })
  //     );
  //   } else if (buildingToRoomRoutes.length !== 0) {
  //     const paths = [
  //       ...(await this.generatePathsFromOSRM(origin, building)),
  //       ...(await this.generatePathsFromOSRM(building, origin))
  //     ];
  //     await this.saveOSRMDataAsPathAndRoute(paths, origin, building);
  //     const stopToBuildingPaths = await this.pathRepository.find({
  //       origin,
  //       destination: building
  //     });
  //     for (let buildingToRoomRoute of buildingToRoomRoutes) {
  //       for (let stopToBuildingPath of stopToBuildingPaths) {
  //         await this.routeRepository.save({
  //           origin,
  //           destination,
  //           paths: [stopToBuildingPath, ...buildingToRoomRoute.paths],
  //           contributor
  //         });
  //       }
  //     }
  //     routes.push(
  //       ...(await this.routeRepository.find({ origin, destination }))
  //     );
  //   } else {
  //     const instructionPath = new Path();
  //     Object.assign(instructionPath, {
  //       instructions: "No building to room available",
  //       origin: building,
  //       destination,
  //       type: PathType.INDOOR
  //     });
  //     const paths = [
  //       ...(await this.generatePathsFromOSRM(origin, building)),
  //       ...(await this.generatePathsFromOSRM(building, origin))
  //     ];
  //     await this.saveOSRMDataAsPathAndRoute(paths, origin, building);
  //     const stopToBuildingRoutes = await this.routeRepository.find({
  //       origin,
  //       destination: building
  //     });
  //     routes.push(
  //       ...stopToBuildingRoutes.map(stopToBuildingRoute => {
  //         stopToBuildingRoute.destination = destination;
  //         stopToBuildingRoute.paths = [
  //           ...stopToBuildingRoute.paths,
  //           instructionPath
  //         ];
  //         return stopToBuildingRoute;
  //       })
  //     );
  //   }
  //   return routes;
  // }

  // async all(request: Request, response: Response, next: NextFunction) {
  // let { origin, destination } = request.query;
  // console.log({ Origin: origin.type, Destination: destination.type });
  // const routes = [];
  // if (origin && destination) {
  //   const { type: originType } = origin;
  //   const { type: destinationType } = destination;
  //   if (
  //     (originType === "Marker" && destinationType === "Marker") ||
  //     (originType === "Marker" && destinationType === "Stop") ||
  //     (originType === "Stop" && destinationType === "Marker") ||
  //     (originType === "Marker" && destinationType === "Building") ||
  //     (originType === "Building" && destinationType === "Marker")
  //   ) {
  //     const OSRMPaths = await this.generatePathsFromOSRM(origin, destination);
  //     routes.push(
  //       OSRMPaths.map(path => {
  //         return {
  //           origin,
  //           destination,
  //           paths: [
  //             {
  //               origin,
  //               destination,
  //               type: "Walking",
  //               latLngs: polyline.decode(path.geometry)
  //             }
  //           ]
  //         };
  //       })
  //     );
  //   } else if (
  //     (originType === "Building" && destinationType === "Building") ||
  //     (originType === "Building" && destinationType === "Stop") ||
  //     (originType === "Building" && destinationType === "Room") ||
  //     (originType === "Stop" && destinationType === "Stop") ||
  //     (originType === "Stop" && destinationType === "Building") ||
  //     (originType === "Stop" && destinationType === "Room") ||
  //     (originType === "Room" && destinationType === "Room") ||
  //     (originType === "Room" && destinationType === "Stop") ||
  //     (originType === "Room" && destinationType === "Building")
  //   ) {
  //     origin = await this.typeCast(origin.id);
  //     destination = await this.typeCast(destination.id);
  //     routes.push(
  //       ...(await this.routeRepository.find({ origin, destination }))
  //     );
  //   }
  // } else {
  //   routes.push(...(await this.routeRepository.find()));
  // }
  // return routes;
  // }
  async one(request: Request, response: Response, next: NextFunction) {}
  async save(request: Request, response: Response, next: NextFunction) {}
  async delete(request: Request, response: Response, next: NextFunction) {}
}
