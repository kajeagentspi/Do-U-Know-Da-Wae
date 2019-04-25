import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable
} from "typeorm";
import { Route } from "..";

export enum UserType {
  VIEWER = "viewer",
  CONTRIBUTOR = "contributor",
  ADMIN = "admin"
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ type: "enum", enum: UserType })
  type: UserType;

  @Column()
  uid: string;

  @OneToMany(type => Route, route => route.contributor, {
    onDelete: "CASCADE"
  })
  contributions: Route[];

  @ManyToMany(type => Route)
  @JoinTable()
  bookmarks: Route[];
}
