import { ChildEntity, Column, TableInheritance } from "typeorm";
import { POI } from "..";

@ChildEntity()
export class Marker extends POI {
  @Column({ default: null })
  name: string;
}
