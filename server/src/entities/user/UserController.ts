import { getRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { User } from "./UserModel";
import * as admin from "firebase-admin";
import { UserType } from "..";

export class UserController {
  private userRepository = getRepository(User);

  async all(request: Request, response: Response, next: NextFunction) {
    return this.userRepository.find();
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const { accessToken } = request.body;
    const { uid } = await admin.auth().verifyIdToken(accessToken);
    return await this.userRepository.findOne(null, {
      where: { uid },
      relations: [
        "bookmarks",
        "bookmarks.origin",
        "bookmarks.destination",
        "bookmarks.paths",
        "bookmarks.paths.origin",
        "bookmarks.paths.destination",
        "contributions",
        "contributions.origin",
        "contributions.destination",
        "contributions.paths",
        "contributions.paths.origin",
        "contributions.paths.destination"
      ]
    });
  }

  async save(request: Request, response: Response, next: NextFunction) {
    try {
      let { accessToken, type, email: editMail } = request.body;
      const result = await admin.auth().verifyIdToken(accessToken);

      if (!editMail) {
        const { name, email, uid } = result;
        if (!type) {
          if (email.split("@").slice(-1)[0] === "up.edu.ph") {
            type = "contributor";
          } else {
            type = "viewer";
          }
        }
        const user = await this.userRepository.save({ name, email, type, uid });
        return this.userRepository.findOne(user.id, {
          relations: [
            "bookmarks",
            "bookmarks.origin",
            "bookmarks.destination",
            "bookmarks.paths",
            "bookmarks.paths.origin",
            "bookmarks.paths.destination",
            "contributions",
            "contributions.origin",
            "contributions.destination",
            "contributions.paths",
            "contributions.paths.origin",
            "contributions.paths.destination"
          ]
        });
      } else if (result.type === UserType.ADMIN) {
        const user = await this.userRepository.findOne(null, {
          where: { email: editMail }
        });
        switch (type) {
          case "contributor":
            type = UserType.CONTRIBUTOR;
            break;
          case "admin":
            type = UserType.ADMIN;
            break;
          case "banned":
            type = UserType.BANNED;
            break;
          case "viewer":
            type = UserType.VIEWER;
            break;
        }
        await this.userRepository.update(user.id, { type });
        return this.userRepository.findOne(user.id, {
          relations: [
            "bookmarks",
            "bookmarks.origin",
            "bookmarks.destination",
            "bookmarks.paths",
            "bookmarks.paths.origin",
            "bookmarks.paths.destination",
            "contributions",
            "contributions.origin",
            "contributions.destination",
            "contributions.paths",
            "contributions.paths.origin",
            "contributions.paths.destination"
          ]
        });
      }
    } catch (error) {
      return {
        message: "An Error Occurred",
        color: "negative",
        position: "top"
      };
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    try {
      const { accessToken } = request.body;
      const { uid } = await admin.auth().verifyIdToken(accessToken);
      const { type } = await this.userRepository.findOne({ uid });
      if (type === "admin") {
        let user = await this.userRepository.findOne(request.params.id);
        await this.userRepository.remove(user);
        return {
          message: "Successfully Deleted User",
          type: "positive",
          position: "top"
        };
      }
      return {
        message: "Invalid Operation",
        color: "negative",
        position: "top"
      };
    } catch (error) {
      console.log(error);
      return {
        message: "An Error Occurred",
        color: "negative",
        position: "top"
      };
    }
  }
}
