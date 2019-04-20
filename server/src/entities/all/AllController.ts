import { getRepository, Like } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { Building, Marker, Stop, Room } from "..";

export class AllController {
  private buildingRepository = getRepository(Building);
  private markerRepository = getRepository(Marker);
  private stopRepository = getRepository(Stop);
  private roomRepository = getRepository(Room);

  async all(request: Request, response: Response, next: NextFunction) {
    let { name } = request.query;
    if (!name) {
      name = "";
    }
    const buildings = await this.buildingRepository.find({
      where: [
        {
          name: Like(`%${name}%`)
        },
        {
          alternativeNames: Like(`%${name}%`)
        }
      ],
      relations: ["rooms", "exits"]
    });

    const rooms = await this.roomRepository.find({
      where: {
        name: Like(`%${name}%`)
      },
      relations: ["building"]
    });

    const stops = await this.stopRepository.find({
      where: {
        name: Like(`%${name}%`)
      }
    });

    const markers = await this.markerRepository.find({
      where: {
        name: Like(`%${name}%`)
      }
    });

    return [...buildings, ...rooms, ...stops, ...markers];
  }
}
