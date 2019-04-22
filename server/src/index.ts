import "reflect-metadata";
import { createConnection, getRepository } from "typeorm";
import express from "express";
import bodyParser from "body-parser";
import * as admin from "firebase-admin";
import cors from "cors";
import firebaseAccountCredentials from "./firebase.config.json";
import { Request, Response } from "express";
import { Routes } from "./routes";
import { Stop, User, Building } from "./entities";
import Seeder from "./database/seeder";
import serveStatic from "serve-static";
import history from "connect-history-api-fallback";
createConnection()
  .then(async connection => {
    // create express app
    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cors());
    // app.use(history());
    // app.use(serveStatic("public"));
    // Initialize firebase-admin
    const serviceAccount = firebaseAccountCredentials as admin.ServiceAccount;
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://do-u-know-da-wae-78800.firebaseio.com"
    });

    // register express routes from defined application routes
    Routes.forEach(route => {
      (app as any)[route.method](
        `/api${route.route}`,
        (req: Request, res: Response, next: Function) => {
          const result = new (route.controller as any)()[route.action](
            req,
            res,
            next
          );
          if (result instanceof Promise) {
            result.then(result =>
              result !== null && result !== undefined
                ? res.send(result)
                : undefined
            );
          } else if (result !== null && result !== undefined) {
            res.json(result);
          }
        }
      );
    });

    // setup express app here
    // ...

    const seeder = new Seeder();
    const userRepository = getRepository(User);
    const users = await userRepository.find();
    if (users.length === 0) {
      console.log("Seeding Users");
      seeder.seedUsers();
    }
    const stopRepository = getRepository(Stop);
    const stops = await stopRepository.find();
    if (stops.length === 0) {
      console.log("Seeding Stops");
      seeder.seedStops();
    }
    const buildingRepository = getRepository(Building);
    const buildings = await buildingRepository.find();
    if (buildings.length === 0) {
      console.log("Seeding Buildings");
      seeder.seedBuildings();
    }
    // start express server

    app.listen(3000);

    console.log("Successdully Started Server");
  })
  .catch(error => console.log(error));
