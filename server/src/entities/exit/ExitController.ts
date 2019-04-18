import { getRepository } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import { Building, User, Exit } from '..';
import * as admin from 'firebase-admin';

export class ExitController {

  private buildingRepository = getRepository(Building);
  private exitRepository = getRepository(Exit);
  private userRepository = getRepository(User);

  async all(request: Request, response: Response, next: NextFunction) {
    return this.exitRepository.find({ where: { ...request.query }, relations: ['building']});
  }

  async one(request: Request, response: Response, next: NextFunction) {
    return this.exitRepository.findOne(request.params.id, { relations: ['building'] });
  }

  async save(request: Request, response: Response, next: NextFunction) {
    try {
      const { buildingId, lat, lng, accessToken, id } = request.body;
      const { uid } = await admin.auth().verifyIdToken(accessToken);
      const { type } = await this.userRepository.findOne({ uid });
      if (type === 'admin') {
        if (id) {
          await this.exitRepository.update(id, { lat, lng });
          return this.exitRepository.findOne(id, { relations: ['building'] });
        } else {
          const building = await this.buildingRepository.findOne(buildingId);
          const exit = await this.exitRepository.save({ building, lat, lng });
          return this.exitRepository.findOne(exit.id, { relations: ['building'] });
        }
      }
      return {
        message: 'Invalid Operation',
        type: 'negative'
      }
    } catch (error) {
      return {
        message: 'Invalid Credentials',
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
        let exit = await this.exitRepository.findOne(request.params.id);
        await this.exitRepository.remove(exit);
        return {
          message: 'Successfully Deleted Exit',
          type: 'positive'
        };
      }
      return {
        message: 'Invalid Operation',
        type: 'negative'
      }
    } catch (error) {
      return {
        message: 'Invalid Credentials',
        type: 'negative'
      }
    }
  }
  
}
