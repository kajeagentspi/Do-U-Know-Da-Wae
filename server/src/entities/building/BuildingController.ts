import { getRepository, Like } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { Building, User, Marker } from "..";
import polygonCenter from "geojson-polygon-center";
import * as admin from "firebase-admin";
import inside from "point-in-polygon";
import axios from "axios";
import qs from "qs";

export class BuildingController {
  private buildingRepository = getRepository(Building);
  private userRepository = getRepository(User);
  private markerRepository = getRepository(Marker);

  async all(request: Request, response: Response, next: NextFunction) {
    let { name } = request.query;
    if (!name) {
      name = "";
    }
    return this.buildingRepository.find({
      where: [
        {
          name: Like(`%${name}%`)
        },
        { alternativeNames: Like(`%${name}%`) }
      ],
      relations: ["rooms"]
    });
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const building = await this.buildingRepository.findOne(request.params.id, {
      relations: ["rooms"]
    });
    if (building) {
      return building;
    }
    return {
      message: "Building not found",
      color: "negative"
    };
  }

  async identify(request: Request, response: Response, next: NextFunction) {
    const { lat, lng } = request.query;
    const buildings = await this.buildingRepository.find({
      relations: ["rooms"]
    });
    for (let building of buildings) {
      for (let polygon of building.coordinates) {
        if (inside([lat, lng], polygon)) {
          return building;
        }
      }
    }
    const query = {
      lat,
      lon: lng,
      format: "json"
    };
    const {
      data: { display_name }
    } = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?${qs.stringify(query)}`
    );
    const name = display_name
      .split(", ")
      .slice(0, 2)
      .join(", ");
    return this.markerRepository.create({
      name,
      lat,
      lng,
      type: "Marker"
    });
  }

  async save(request: Request, response: Response, next: NextFunction) {
    try {
      const {
        accessToken,
        name,
        coordinates,
        alternativeNames,
        id
      } = request.body;
      const { uid } = await admin.auth().verifyIdToken(accessToken);
      const { type } = await this.userRepository.findOne({ uid });
      if (type === "admin") {
        if (id) {
          await this.buildingRepository.update(id, {
            name,
            alternativeNames
          });
          return this.buildingRepository.findOne(id, {
            relations: ["rooms"]
          });
        } else {
          const {
            coordinates: [lat, lng]
          } = polygonCenter(coordinates);
          const building = await this.buildingRepository.save({
            coordinates,
            name,
            lat,
            lng,
            alternativeNames
          });
          return this.buildingRepository.findOne(building.id);
        }
      }
      return {
        message: "Invalid Operation",
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
      const { type } = await this.userRepository.findOne({ uid });
      if (type === "admin") {
        let building = await this.buildingRepository.findOne(request.params.id);
        await this.buildingRepository.remove(building);
        return {
          message: "Successfully Deleted Building",
          type: "positive"
        };
      }
      return {
        message: "Invalid Operation",
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
