import { getRepository } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import { Building, Room, User } from '..';
import * as admin from 'firebase-admin';

export class RoomController {

  private buildingRepository = getRepository(Building);
  private roomRepository = getRepository(Room);
  private userRepository = getRepository(User);

  async all(request: Request, response: Response, next: NextFunction) {
    return this.roomRepository.find({ ...request.query, relations: ['building']});
  }

  async one(request: Request, response: Response, next: NextFunction) {
    return this.roomRepository.findOne(request.params.id, { relations: ['building'] });
  }

  async save(request: Request, response: Response, next: NextFunction) {
    const { buildingId, name, level, accessToken, id } = request.body;
    const { uid } = await admin.auth().verifyIdToken(accessToken);
    const { type } = await this.userRepository.findOne({ uid });
    
    if (type === 'admin') {
      if (id) {
        await this.roomRepository.update(id, { name, level });
        return this.roomRepository.findOne(id, { relations: ['building'] });
      } else {
        const building = await this.buildingRepository.findOne(buildingId);
        await this.roomRepository.save({ building, name, level });
        return this.roomRepository.findOne(id, { relations: ['building'] });
      }
    } else {
      return [];
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    let room = await this.roomRepository.findOne(request.params.id);
    await this.roomRepository.remove(room);
  }

}