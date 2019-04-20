import { ChildEntity, Column, ManyToOne } from "typeorm";
import { Building, POI } from "..";

@ChildEntity()
export class Exit extends POI {
  @ManyToOne(type => Building, building => building.exits, {
    onDelete: "CASCADE"
  })
  building: Building;
}
