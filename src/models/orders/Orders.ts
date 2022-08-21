import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import Users from '../users/Users';

import { OrdersAttributes } from './orders.types';

@Table
export default class Orders extends Model<OrdersAttributes> {
  @ForeignKey(() => Users)
  @Column
  user_id!: number;

  @Column
  passengers!: string;

  @Column
  origin!: string;

  @Column
  destination!: string;

  @Column
  goBack!: boolean;

  @Column
  data_go!: string;

  @Column
  data_back!: string;

  @Column({
    type: DataType.FLOAT,
  })
  total!: number;

  /* Una orden puede pertenecer a un usuario*/
  @BelongsTo(() => Users, 'user_id')
  user?: Users;

  @CreatedAt
  @Column
  createdAt?: Date;

  @UpdatedAt
  @Column
  updatedAt?: Date;
}
