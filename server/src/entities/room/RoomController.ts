import { getRepository, Like } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { Building, Room, User, Route } from "..";
import * as admin from "firebase-admin";

export class RoomController {
  private buildingRepository = getRepository(Building);
  private roomRepository = getRepository(Room);
  private userRepository = getRepository(User);

  async all(request: Request, response: Response, next: NextFunction) {
    let { name, buildingId } = request.query;
    if (!name) {
      name = "";
    }
    if (buildingId) {
      buildingId = "*";
    }
    return this.roomRepository.find({
      where: { name: Like(`%${name}%`), buildingId }
    });
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const room = await this.roomRepository.findOne(request.params.id);
    if (room) {
      return room;
    }
    return {
      message: "Room not found",
      color: "negative"
    };
  }

  async save(request: Request, response: Response, next: NextFunction) {
    try {
      const {
        buildingId,
        buildingCode,
        name,
        level,
        accessToken,
        id
      } = request.body;
      // const { uid } = await admin.auth().verifyIdToken(accessToken);
      // const { type } = await this.userRepository.findOne({ uid });
      const type = "admin"; //remove this boi
      if (type === "admin" || type === "contributor") {
        if (id) {
          const room = await this.roomRepository.findOne(id);
          await this.roomRepository.update(room.id, { name, level });
          return this.roomRepository.findOne(room.id, {
            relations: ["building"]
          });
        } else {
          let building;
          if (buildingCode) {
            building = await this.buildingRepository.findOne(null, {
              where: {
                buildingCode
              }
            });
          } else {
            building = await this.buildingRepository.findOne(buildingId);
          }
          const room = await this.roomRepository.save({
            building,
            name: name.toUpperCase(),
            level
          });
          return this.roomRepository.findOne(room.id, {
            relations: ["building"]
          });
        }
      }
      return {
        message: "Operation not permitted",
        color: "negative"
      };
    } catch (error) {
      console.log(error);
      return {
        message: "An Error Occurred",
        color: "negative"
      };
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    try {
      const { accessToken } = request.body;
      const { uid } = await admin.auth().verifyIdToken(accessToken);
      const { type } = await this.userRepository.findOne({ uid });
      if (type === "admin") {
        let room = await this.roomRepository.findOne(request.params.id);
        await this.roomRepository.remove(room);
        return {
          message: "Successfully Deleted Room",
          color: "positive"
        };
      }
      return {
        message: "Operation not permitted",
        color: "negative"
      };
    } catch (error) {
      console.log(error);
      return {
        message: "An Error Occurred",
        color: "negative"
      };
    }
  }
}
