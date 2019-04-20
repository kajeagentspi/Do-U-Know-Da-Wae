import { getRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { User, Marker } from "..";
import * as admin from "firebase-admin";

export class MarkerController {
  private markerRepository = getRepository(Marker);
  private userRepository = getRepository(User);

  async all(request: Request, response: Response, next: NextFunction) {
    return this.markerRepository.find(request.query);
  }

  async one(request: Request, response: Response, next: NextFunction) {
    return this.markerRepository.findOne(request.params.id);
  }

  async save(request: Request, response: Response, next: NextFunction) {
    try {
      const { lat, lng, accessToken, id } = request.body;
      const { uid } = await admin.auth().verifyIdToken(accessToken);
      const { type } = await this.userRepository.findOne({ uid });
      if (type === "admin" || type === "contributor") {
        const marker = await this.markerRepository.findOne(id);
        if (marker) {
          await this.markerRepository.update(marker.id, { lat, lng });
          return this.markerRepository.findOne(marker.id);
        } else {
          const marker = await this.markerRepository.save({ lat, lng });
          return this.markerRepository.findOne(marker.id);
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
        let marker = await this.markerRepository.findOne(request.params.id);
        await this.markerRepository.remove(marker);
        return {
          message: "Successfully Deleted Marker",
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
