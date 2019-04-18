import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum UserType {
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
    enum: UserType,
  })
  type: UserType;

  @Column()
  uid: string;
}
