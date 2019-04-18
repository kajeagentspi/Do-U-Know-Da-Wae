import { getRepository } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import { Building, User } from '..';
import * as admin from 'firebase-admin';
import * as inside from 'point-in-polygon';

export class BuildingController {

  private buildingRepository = getRepository(Building);
  private userRepository = getRepository(User);

  async all(request: Request, response: Response, next: NextFunction) {
    return this.buildingRepository.find({ ...request.query, relations: ['rooms']});
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const { id } = request.params;
    return this.buildingRepository.findOne(id, {relations: ['rooms'] });
  }

  async identify(request: Request, response: Response, next: NextFunction) {
    const { lat, lng } = request.query;
    const buildings = await this.buildingRepository.find();
    for (let building of buildings) {
      for (let polygon of building.coordinates) {
        if(inside([lat, lng], polygon)) {
          return building;
        }
      }
    }
    return [];
  }

  async save(request: Request, response: Response, next: NextFunction) {
    const { accessToken, name, alternativeNames } = request.body;
    const result = await admin.auth().verifyIdToken(accessToken);
    const { uid } = result;
    const user = await this.userRepository.findOne({ uid });
    const { id } = request.params;
    const building = await this.buildingRepository.findOne({ id });
    if (user && user.type==='admin') {
      await this.buildingRepository.update(building.id, { name, alternativeNames, active:true });
      return this.buildingRepository.findOne(building.id);
    } else {
      return building;
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    let building = await this.buildingRepository.findOne(request.params.id);
    await this.buildingRepository.remove(building);
  }

}