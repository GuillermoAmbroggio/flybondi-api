import {
  Column,
  CreatedAt,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { InvalidTokensAttributes } from '../invalidTokens/invalidTokens.types';

@Table
export default class InvalidTokens extends Model<InvalidTokensAttributes> {
  @Column
  invalidToken!: string;

  @Column
  expiredDate!: Date;

  @CreatedAt
  @Column
  createdAt?: Date;

  @UpdatedAt
  @Column
  updatedAt?: Date;
}
