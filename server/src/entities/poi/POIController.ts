import { getRepository, Like } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { Building, Room, Stop } from "..";

export class POIController {
  private buildingRepository = getRepository(Building);
  private roomRepository = getRepository(Room);
  private stopRepository = getRepository(Stop);

  async all(request: Request, response: Response, next: NextFunction) {
    let { name } = request.query;
    if (!name) {
      name = "";
    }
    const pois = [];
    pois.push(
      ...(await this.buildingRepository.find({
        where: [
          {
            name: Like(`%${name}%`)
          },
          { alternativeNames: Like(`%${name}%`) }
        ],
        relations: ["rooms"]
      })),
      ...(await this.roomRepository.find({
        where: { name: Like(`%${name}%`) }
      })),
      ...(await this.stopRepository.find({
        where: { name: Like(`%${name}%`) }
      }))
    );
  }
}
