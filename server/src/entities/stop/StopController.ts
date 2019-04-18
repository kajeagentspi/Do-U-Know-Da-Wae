import { getRepository, Like } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import { User, Stop } from '..';
import * as admin from 'firebase-admin';

export class StopController {

  private stopRepository = getRepository(Stop);
  private userRepository = getRepository(User);

  async all(request: Request, response: Response, next: NextFunction) {
    let { direction, ...query } = request.query;
    if (!direction) {
      direction = ''
    }
    return this.stopRepository.find({ where: { ...query, direction: Like(`%${direction}%`) } });
  }

  async one(request: Request, response: Response, next: NextFunction) {
    return this.stopRepository.findOne(request.params.id);
  }

  async save(request: Request, response: Response, next: NextFunction) {
    try {
      const { lat, lng, accessToken, id } = request.body;
      const { uid } = await admin.auth().verifyIdToken(accessToken);
      const { type } = await this.userRepository.findOne({ uid });
      if (type === 'admin') {
        if (id) {
          await this.stopRepository.update(id, { lat, lng });
          return this.stopRepository.findOne(id);
        } else {
          const stop = await this.stopRepository.save({ lat, lng });
          return this.stopRepository.findOne(stop.id);
        }
      } else {
        return [];
      }
    } catch (error) {
      return [];
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    try {
      const { accessToken } = request.body;
      const { uid } = await admin.auth().verifyIdToken(accessToken);
      const { type } = await this.userRepository.findOne({ uid });
      if (type === 'admin') {
        let stop = await this.stopRepository.findOne(request.params.id);
        await this.stopRepository.remove(stop);
      }
      return [];
    } catch (error) {
      return [];
    }
  }
  
}
