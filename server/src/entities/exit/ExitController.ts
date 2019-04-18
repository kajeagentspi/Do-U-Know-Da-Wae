import { getRepository } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import { Building, User, Exit } from '..';
import * as admin from 'firebase-admin';

export class ExitController {

  private buildingRepository = getRepository(Building);
  private exitRepository = getRepository(Exit);
  private userRepository = getRepository(User);

  async all(request: Request, response: Response, next: NextFunction) {
    return this.exitRepository.find({ ...request.query, relations: ['building']});
  }

  async one(request: Request, response: Response, next: NextFunction) {
    return this.exitRepository.findOne(request.params.id, { relations: ['building'] });
  }

  async save(request: Request, response: Response, next: NextFunction) {
    const { buildingId, lat, lng, accessToken, id } = request.body;
    const { uid } = await admin.auth().verifyIdToken(accessToken);
    const { type } = await this.userRepository.findOne({ uid });
    if (type === 'admin') {
      if (id) {
        await this.exitRepository.update(id, { lat, lng });
        return this.exitRepository.findOne(id, { relations: ['building'] });
      } else {
        const building = await this.buildingRepository.findOne(buildingId);
        await this.exitRepository.save({ building, lat, lng });
        return this.exitRepository.findOne(id, { relations: ['building'] });
      }
    } else {
      return []
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    let exit = await this.exitRepository.findOne(request.params.id);
    await this.exitRepository.remove(exit);
  }

}