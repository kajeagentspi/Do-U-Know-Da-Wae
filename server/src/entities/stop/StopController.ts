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
        const stop = await this.stopRepository.findOne(id);
        if (stop) {
          await this.stopRepository.update(stop.id, { lat, lng });
          return this.stopRepository.findOne(stop.id);
        } else {
          const stop = await this.stopRepository.save({ lat, lng });
          return this.stopRepository.findOne(stop.id);
        }
      }
      return {
        message: 'Invalid Operation',
        type: 'negative'
      }
    } catch (error) {
      console.log(error);
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
        let stop = await this.stopRepository.findOne(request.params.id);
        await this.stopRepository.remove(stop);
        return {
          message: 'Successfully Deleted Stop',
          type: 'positive'
        };
      }
      return {
        message: 'Invalid Operation',
        type: 'negative'
      }
    } catch (error) {
      console.log(error);
      return {
        message: 'An Error Occurred',
        type: 'negative'
      }
    }
  }
  
}
