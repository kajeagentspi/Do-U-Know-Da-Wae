import { getRepository } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import { Building, Room, User } from '..';
import * as admin from 'firebase-admin';

export class RoomController {

  private buildingRepository = getRepository(Building);
  private roomRepository = getRepository(Room);
  private userRepository = getRepository(User);

  async all(request: Request, response: Response, next: NextFunction) {
    return this.roomRepository.find(request.query);
  }

  async one(request: Request, response: Response, next: NextFunction) {
    return this.roomRepository.findOne(request.params.id);
  }

  async save(request: Request, response: Response, next: NextFunction) {
    const { buildingId, name, level, accessToken } = request.body;
    const result = await admin.auth().verifyIdToken(accessToken);
    const { uid } = result;
    const user = await this.userRepository.findOne({ uid });
    const building = await this.buildingRepository.findOne(buildingId);
    const room = await this.roomRepository.findOne({ building, name });
    if (user && user.type==='admin') {
      if (room) {
        await this.roomRepository.update(room.id, { name, level });
        return this.roomRepository.findOne(room.id);
      } else {
        return this.roomRepository.save({ building, name, level });
      }
    } else {
      return room;
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
  }

}