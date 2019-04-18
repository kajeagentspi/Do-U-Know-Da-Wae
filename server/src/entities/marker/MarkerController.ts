import { getRepository } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import { User, Marker } from '..';
import * as admin from 'firebase-admin';

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
      if (type === 'admin' || type === 'contributor') {
        if (id) {
          await this.markerRepository.update(id, { lat, lng });
          return this.markerRepository.findOne(id);
        } else {
          const marker = await this.markerRepository.save({ lat, lng });
          return this.markerRepository.findOne(marker.id);
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
        let marker = await this.markerRepository.findOne(request.params.id);
        await this.markerRepository.remove(marker);
        return [];
      }
      return [];
    } catch (error) {
      return [];
    }
  }

}
