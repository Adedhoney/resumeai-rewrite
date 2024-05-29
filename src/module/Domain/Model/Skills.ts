import {
    Table,
    Column,
    Model,
    DataType,
    AutoIncrement,
    PrimaryKey,
    NotNull,
    BelongsTo,
} from 'sequelize-typescript';
import { User } from './User';

export interface ISkill {
    id?: number;
    skill: string;
    userId: string;
    yearsOfExp: number;
    createdAt?: string;
    updatedAt?: string;
}

@Table
export class Skill extends Model implements ISkill {
    @AutoIncrement
    @NotNull
    declare id?: number;

    @Column({ type: DataType.UUID })
    @NotNull
    @PrimaryKey
    @BelongsTo(() => User)
    declare userId: string;

    @Column
    @PrimaryKey
    @NotNull
    declare skill: string;

    @Column
    @NotNull
    declare yearsOfExp: number;
}
