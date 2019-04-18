import { getRepository } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import { User } from './UserModel';
import * as admin from 'firebase-admin';

export class UserController {

  private userRepository = getRepository(User);

  async all(request: Request, response: Response, next: NextFunction) {
    return this.userRepository.find();
  }

  async one(request: Request, response: Response, next: NextFunction) {
    return this.userRepository.findOne(request.params.id);
  }

  async save(request: Request, response: Response, next: NextFunction) {
    const { accessToken } = request.body;
    const result = await admin.auth().verifyIdToken(accessToken);
    const { name, email, uid } = result;
    let { type } = result;
    if (email.split('@').slice(-1)[0] === 'up.edu.ph'){
      type = 'contributor';
    } else {
      type = 'viewer';
    }
    if (email === 'jptagnepis@up.edu.ph') {
      type = 'admin'
    }
    const user = await this.userRepository.findOne({ uid });
    if (user) {
      await this.userRepository.update(user.id, { name, type });
      return this.userRepository.findOne(user.id);
    } else {
      return this.userRepository.save({ name, email, type, uid });
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    let user = await this.userRepository.findOne(request.params.id);
    await this.userRepository.remove(user);
  }

}