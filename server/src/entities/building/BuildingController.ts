import { getRepository, Like } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { Building, User } from "..";
import * as admin from "firebase-admin";
import * as inside from "point-in-polygon";

export class BuildingController {
  private buildingRepository = getRepository(Building);
  private userRepository = getRepository(User);

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
      relations: ["rooms", "exits"]
    });
  }

  async one(request: Request, response: Response, next: NextFunction) {
    return this.buildingRepository.findOne(request.params.id, {
      relations: ["rooms", "exits"]
    });
  }

  async identify(request: Request, response: Response, next: NextFunction) {
    const { lat, lng } = request.query;
    const buildings = await this.buildingRepository.find({
      relations: ["rooms", "exits"]
    });
    for (let building of buildings) {
      for (let polygon of building.coordinates) {
        if (inside([lat, lng], polygon)) {
          return building;
        }
      }
    }
    return {
      message: "Building not found",
      type: "negative"
    };
  }

  async save(request: Request, response: Response, next: NextFunction) {
    try {
      const { accessToken, name, alternativeNames, id } = request.body;
      const { uid } = await admin.auth().verifyIdToken(accessToken);
      const { type } = await this.userRepository.findOne({ uid });
      if (type === "admin") {
        await this.buildingRepository.update(id, {
          name,
          alternativeNames,
          active: true
        });
        return this.buildingRepository.findOne(id, {
          relations: ["rooms", "exits"]
        });
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
