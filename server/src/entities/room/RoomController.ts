import { getRepository, Like } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import { Building, Room, User } from '..';
import * as admin from 'firebase-admin';

export class RoomController {

  private buildingRepository = getRepository(Building);
  private roomRepository = getRepository(Room);
  private userRepository = getRepository(User);

  async all(request: Request, response: Response, next: NextFunction) {
    let { name, ...query} = request.query;
    if(!name){
      name = '';
    }
    return this.roomRepository.find({ where: {
      name: Like(`${name}`),
      ...query
    }, relations: ['building']});
  }

  async one(request: Request, response: Response, next: NextFunction) {
    return this.roomRepository.findOne(request.params.id, { relations: ['building'] });
  }

  async save(request: Request, response: Response, next: NextFunction) {
    try {
      const { buildingId, name, level, accessToken, id } = request.body;
      const { uid } = await admin.auth().verifyIdToken(accessToken);
      const { type } = await this.userRepository.findOne({ uid });
      
      if (type === 'admin') {
        if (id) {
          await this.roomRepository.update(id, { name, level });
          return this.roomRepository.findOne(id, { relations: ['building'] });
        } else {
          const building = await this.buildingRepository.findOne(buildingId);
          const room = await this.roomRepository.save({ building, name, level });
          return this.roomRepository.findOne(room.id, { relations: ['building'] });
        }
      }
      return {
        message: 'Operation not permitted',
        type: 'negative'
      }
    } catch (error) {
      return {
        message: 'An Error Occurred',
        type: 'negative'
      }
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    try {
      const { accessToken } = request.body;
      const { uid } = await admin.auth().verifyIdToken(accessToken);
      const { type } = await this.userRepository.findOne({ uid });
      if (type === 'admin') {
        let room = await this.roomRepository.findOne(request.params.id);
        await this.roomRepository.remove(room);
        return {
          message: 'Successfully Deleted Room',
          type: 'positive'
        };
      }
      return {
        message: 'Operation not permitted',
        type: 'negative'
      }
    } catch (error) {
      return {
        message: 'An Error Occurred',
        type: 'negative'
      }
    }
  }

}
