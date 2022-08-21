import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { TripsAttributes } from './trips.types';

@Table
export default class Trips extends Model<TripsAttributes> {
  @Column
  origin!: string;

  @Column
  destination!: string;

  @Column({
    type: DataType.FLOAT,
  })
  price!: number;

  @Column
  availability!: number;

  @Column
  data!: string;

  @CreatedAt
  @Column
  createdAt?: Date;

  @UpdatedAt
  @Column
  updatedAt?: Date;
}
