import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum Type {
  VIEWER = 'viewer',
  CONTRIBUTOR = 'contributor',
  ADMIN = 'admin'
}
@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({
    type: 'enum',
    enum: Type,
  })
  type: Type;

  @Column()
  uid: string;
}
