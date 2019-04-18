import { getRepository } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import { User, Path, POI, Stop, Exit, Jeep, Walk, Indoor, Room } from '..';
import * as admin from 'firebase-admin';

export class PathController {

  private pathRepository = getRepository(Path);
  private jeepRepository = getRepository(Jeep);
  private walkRepository = getRepository(Walk);
  private indoorRepository = getRepository(Indoor);
  private userRepository = getRepository(User);
  private POIRepository = getRepository(POI);

  async all(request: Request, response: Response, next: NextFunction) {
    return this.pathRepository.find({ where: { ...request.query }, relations: ['start', 'end'] });
  }

  async one(request: Request, response: Response, next: NextFunction) {
    return this.pathRepository.findOne(request.params.id, { relations: ['start', 'end'] });
  }
  
  async save(request: Request, response: Response, next: NextFunction) {
    try {
      const { startID, endID, type, latLngs, instructions, accessToken } = request.body;
      const { uid } = await admin.auth().verifyIdToken(accessToken);
      const { type: userType } = await this.userRepository.findOne({ uid });
      if (userType === 'admin' || userType === 'contributor') {
        const start = await this.POIRepository.findOne(startID);
        const end = await this.POIRepository.findOne(endID);
        switch (type) {
          case 'jeep':
            if (start instanceof Stop && end instanceof Stop) {
              const path = await this.jeepRepository.save({ start, end, latLngs });
              return this.jeepRepository.findOne(path.id, { relations: ['start', 'end'] });
            } else {
              return {
                message: 'Invalid Points of Interest'
              }
            }
          case 'walk':
            if (!(start instanceof Room) && !(end instanceof Room)) {
              const path = await this.walkRepository.save({ start, end, latLngs });
              return this.walkRepository.findOne(path.id, { relations: ['start', 'end'] });
            } else {
              return {
                message: 'Invalid Points of Interest'
              }
            }
          case 'indoor':
            if ((start instanceof Exit && end instanceof Room) || (start instanceof Room && end instanceof Exit)) {
              const path = await this.indoorRepository.save({ start, end, instructions });
              return this.indoorRepository.findOne(path.id, { relations: ['start', 'end'] });
            } else {
              return {
                message: 'Invalid Points of Interest'
              }
            }
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
}
