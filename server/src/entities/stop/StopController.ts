import { getRepository, Like } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { User, Stop } from "..";
import * as admin from "firebase-admin";
import { UserType } from "../user/UserModel";

export class StopController {
  private stopRepository = getRepository(Stop);
  private userRepository = getRepository(User);

  async all(request: Request, response: Response, next: NextFunction) {
    let { direction, name } = request.query;
    if (!direction) {
      direction = "";
    }
    if (!name) {
      name = "";
    }
    return this.stopRepository.find({
      where: { name: Like(`%${name}%`), direction: Like(`%${direction}%`) }
    });
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const stop = await this.stopRepository.findOne(request.params.id);
    if (stop) {
      return stop;
    }
    return {
      message: "Stop not found",
      color: "negative",
      position: "top"
    };
  }

  async save(request: Request, response: Response, next: NextFunction) {
    try {
      const { lat, lng, id } = request.body;
      const { token } = request.headers;
      const { uid } = await admin.auth().verifyIdToken(token);
      const user = await this.userRepository.findOne({ uid });
      if (user.type === UserType.ADMIN) {
        const stop = await this.stopRepository.findOne(id);
        if (stop) {
          await this.stopRepository.update(stop.id, { lat, lng });
          return this.stopRepository.findOne(stop.id);
        } else {
          const stop = await this.stopRepository.save({ lat, lng });
          return this.stopRepository.findOne(stop.id);
        }
      }
      return {
        message: "Invalid Operation",
        color: "negative",
        position: "top"
      };
    } catch (error) {
      console.log(error);
      return {
        message: "An Error Occurred",
        color: "negative",
        position: "top"
      };
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    try {
      const { token } = request.headers;
      const { uid } = await admin.auth().verifyIdToken(token);
      const user = await this.userRepository.findOne({ uid });
      if (user.type === UserType.ADMIN) {
        let stop = await this.stopRepository.findOne(request.params.id);
        await this.stopRepository.remove(stop);
        return {
          message: "Successfully Deleted Stop",
          color: "positive",
          position: "top"
        };
      }
      return {
        message: "Invalid Operation",
        color: "negative",
        position: "top"
      };
    } catch (error) {
      console.log(error);
      return {
        message: "An Error Occurred",
        color: "negative",
        position: "top"
      };
    }
  }
}
