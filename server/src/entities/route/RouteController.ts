import { getRepository, Like } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { User, Route, POI, Building, Room, Stop, Path, PathType } from "..";
import { walking, driving } from "../config";
import * as admin from "firebase-admin";
import * as polyline from "@mapbox/polyline";
import axios from "axios";

export class RouteController {
  private pathRepository = getRepository(Path);
  private routeRepository = getRepository(Route);
  private buildingRepository = getRepository(Building);
  private roomRepository = getRepository(Room);
  private stopRepository = getRepository(Stop);
  private userRepository = getRepository(User);

  async generatePathsFromOSRM(origin: any, destination: any) {
    const searchString = `${origin.lng},${origin.lat};${destination.lng},${
      destination.lat
    }`;
    console.log(`${walking}/${searchString}?alternatives=true&overview=full`);
    console.log(`${driving}/${searchString}?alternatives=true&overview=full`);
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
    let paths = [...jeepneyPaths, ...walkingPaths];
    // remove duplicates
    paths = paths
      .map(e => e["geometry"])
      // store the keys of the unique objects
      .map((e, i, final) => final.indexOf(e) === i && i)
      // eliminate the dead keys & store unique objects
      .filter(e => paths[e])
      .map(e => paths[e]);

    return paths;
  }

  typeCast(poi) {
    switch (poi.type) {
      case "Building":
        return this.buildingRepository.findOne(poi.id);
      case "Room":
        return this.roomRepository.findOne(poi.id);
      case "Stop":
        return this.stopRepository.findOne(poi.id);
    }
  }

  async saveOSRMDataAsPathAndRoute(paths: any, origin: POI, destination: POI) {
    const contributor = await this.userRepository.findOne(null, {
      where: {
        uid: "sxdtxH1nOiYizjEMFKjK2EtFruk1"
      }
    });
    for (let path of paths) {
      const newPath = await this.pathRepository.save({
        latLngs: polyline.decode(path.geometry),
        origin,
        destination,
        type: PathType.WALKING
      });
      await this.routeRepository.save({
        paths: [newPath],
        origin,
        destination,
        contributor
      });
    }
    // paths.forEach(async path => {
    //   const newPath = await this.pathRepository.save({
    //     latLngs: polyline.decode(path.geometry)
    //   });
    // });
    // const path = await this.pathRepository.save({
    //   latLngs: polyline.decode(path.geometry)
    // })
  }

  async all(request: Request, response: Response, next: NextFunction) {
    let { origin, destination } = request.query;
    const routes = [];
    if (origin && destination) {
      const { type: originType } = origin;
      const { type: destinationType } = destination;
      if (
        (originType === "Marker" && destinationType === "Marker") ||
        (originType === "Marker" && destinationType === "Stop") ||
        (originType === "Stop" && destinationType === "Marker") ||
        (originType === "Marker" && destinationType === "Building") ||
        (originType === "Building" && destinationType === "Marker")
      ) {
        const OSRMPaths = await this.generatePathsFromOSRM(origin, destination);
        routes.push(
          OSRMPaths.map(path => {
            return {
              origin,
              destination,
              paths: [
                {
                  origin,
                  destination,
                  type: "Walking",
                  latLngs: polyline.decode(path.geometry)
                }
              ]
            };
          })
        );
      } else if (
        (originType === "Building" && destinationType === "Building") ||
        (originType === "Building" && destinationType === "Stop") ||
        (originType === "Building" && destinationType === "Room") ||
        (originType === "Stop" && destinationType === "Stop") ||
        (originType === "Stop" && destinationType === "Building") ||
        (originType === "Stop" && destinationType === "Room") ||
        (originType === "Room" && destinationType === "Room") ||
        (originType === "Room" && destinationType === "Stop") ||
        (originType === "Room" && destinationType === "Building")
      ) {
        origin = await this.typeCast(origin.id);
        destination = await this.typeCast(destination.id);
        routes.push(
          ...(await this.routeRepository.find({ origin, destination }))
        );
        if (routes.length === 0) {
          if (
            (originType === "Building" && destinationType === "Building") ||
            (originType === "Building" && destinationType === "Stop") ||
            (originType === "Stop" && destinationType === "Stop") ||
            (originType === "Stop" && destinationType === "Building")
          ) {
            //    query osrm start: building end: stop
            //    save to db route path walking
            //    query osrm start: stop end: building
            //    save to db route path walking
            //    push origin destination to routes
            const paths = [
              ...(await this.generatePathsFromOSRM(origin, destination)),
              ...(await this.generatePathsFromOSRM(destination, origin))
            ];
            await this.saveOSRMDataAsPathAndRoute(paths, origin, destination);
            routes.push(
              ...(await this.routeRepository.find({ origin, destination }))
            );
          } else if (originType === "Room" && destinationType === "Stop") {
            //    roomtoBuilding = get room to building route
            //    buildingToStop = get building to stop route
            const contributor = await this.userRepository.findOne(null, {
              where: {
                uid: "sxdtxH1nOiYizjEMFKjK2EtFruk1"
              }
            });
            const building = await this.buildingRepository.findOne(
              origin.building.id
            );
            const roomToBuildingRoutes = await this.routeRepository.find({
              origin,
              destination: building
            });
            let buildingToStopRoutes = await this.routeRepository.find({
              origin: building,
              destination
            });

            // roomToBuilding && buildingToStop => combine //save to db
            // roomToBuilding => generateBuildingToStop then combine //save to db
            // buildingToStop => insert dummy path return to user // no save
            // else get buildingToStop then insert dummy path // save buildingToStop
            if (
              roomToBuildingRoutes.length !== 0 &&
              buildingToStopRoutes.length !== 0
            ) {
              // new route paths = [...roomtoBuilding.paths, ...buildingToStop.paths]
              // save to db
              const listOfPaths = [];
              for (let roomToBuildingRoute of roomToBuildingRoutes) {
                for (let buildingToStopRoute of buildingToStopRoutes) {
                  listOfPaths.push([
                    ...roomToBuildingRoute.paths,
                    ...buildingToStopRoute.paths
                  ]);
                }
              }
              for (let paths of listOfPaths) {
                await this.routeRepository.save({
                  origin,
                  destination,
                  paths,
                  contributor
                });
              }
              routes.push(
                ...(await this.routeRepository.find({ origin, destination }))
              );
            } else if (roomToBuildingRoutes.length !== 0) {
              // query osrm start: building end: stop
              // save to db route path walking
              // query osrm start: stop end: building
              // save to db route path walking
              // get buildingtostop paths
              // combine each result to roomtobuilding
              // path => [..roomtobuilding.paths, buildingtostop]
              // save to db
              // get and push
              const paths = [
                ...(await this.generatePathsFromOSRM(building, destination)),
                ...(await this.generatePathsFromOSRM(destination, building))
              ];
              await this.saveOSRMDataAsPathAndRoute(
                paths,
                building,
                destination
              );
              const buildingToStopPaths = await this.pathRepository.find({
                origin: building,
                destination
              });
              for (let roomToBuildingRoute of roomToBuildingRoutes) {
                for (let buildingToStopPath of buildingToStopPaths) {
                  await this.routeRepository.save({
                    origin,
                    destination,
                    paths: [...roomToBuildingRoute.paths, buildingToStopPath],
                    contributor
                  });
                }
              }
              routes.push(
                ...(await this.routeRepository.find({ origin, destination }))
              );
            } else if (buildingToStopRoutes.length !== 0) {
              const instructionPath = new Path();
              Object.assign(instructionPath, {
                instructions: "No building to room available",
                origin: origin,
                destination: building,
                type: PathType.INDOOR
              });
              routes.push(
                ...buildingToStopRoutes.map(buildingToStopRoute => {
                  buildingToStopRoute.origin = origin;
                  buildingToStopRoute.paths = [
                    instructionPath,
                    ...buildingToStopRoute.paths
                  ];
                  return buildingToStopRoute;
                })
              );
            } else {
              const instructionPath = new Path();
              Object.assign(instructionPath, {
                instructions: "No building to room available",
                origin: origin,
                destination: building,
                type: PathType.INDOOR
              });
              const paths = [
                ...(await this.generatePathsFromOSRM(building, destination)),
                ...(await this.generatePathsFromOSRM(destination, building))
              ];
              await this.saveOSRMDataAsPathAndRoute(
                paths,
                building,
                destination
              );
              buildingToStopRoutes = await this.routeRepository.find({
                origin: building,
                destination
              });
              routes.push(
                ...buildingToStopRoutes.map(buildingToStopRoute => {
                  buildingToStopRoute.origin = origin;
                  buildingToStopRoute.paths = [
                    instructionPath,
                    ...buildingToStopRoute.paths
                  ];
                  return buildingToStopRoute;
                })
              );
            }
          }
          // room to stop
          //    else if (buildingToStop)
          //          create temporary indoor path instructions="No building to room available"
          //          combine temporary to buildingto stop
          //          push
          //    else
          //          query osrm start: building end: stop
          //          save to db route path walking
          //          query osrm start: stop end: building
          //          save to db route path walking
          //
          //          get buildingtostop paths
          //          create temporary indoor path instructions="No building to room available"
          //          combine temporary to buildingto stop
          //          push
        }
      }
    } else {
      routes.push(this.routeRepository.find());
    }
    return routes;
  }
  async one(request: Request, response: Response, next: NextFunction) {}
  async save(request: Request, response: Response, next: NextFunction) {}
  async delete(request: Request, response: Response, next: NextFunction) {}
}
