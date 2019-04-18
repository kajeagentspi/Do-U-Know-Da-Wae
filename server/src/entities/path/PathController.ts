import { getRepository } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import { User, Path, POI } from '..';
import * as admin from 'firebase-admin';

export class PathController {

  private pathRepository = getRepository(Path);
  private userRepository = getRepository(User);
  private POIRepository = getRepository(POI);

  async all(request: Request, response: Response, next: NextFunction) {
    return this.pathRepository.find(request.query);
  }

  async one(request: Request, response: Response, next: NextFunction) {
    return this.pathRepository.findOne(request.params.id);
  }
  
  async save(request: Request, response: Response, next: NextFunction) {
    const { startID, endID, type, latLngs, accessToken } = request.body;
    console.log(request.body)
  }
}
