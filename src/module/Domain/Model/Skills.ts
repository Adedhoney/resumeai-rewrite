import {
    Table,
    Column,
    Model,
    DataType,
    AutoIncrement,
    PrimaryKey,
    NotNull,
    BelongsTo,
    ForeignKey,
} from 'sequelize-typescript';
import { User } from './User';

export interface ISkill {
    id?: number;
    skill: string;
    userId: string;
    yearsOfExp: string;
    createdAt?: string;
    updatedAt?: string;
}

@Table({
    tableName: 'skills',
    timestamps: true, // If you want to manage createdAt and updatedAt timestamps
})
export class Skill extends Model implements ISkill {
    @AutoIncrement
    @PrimaryKey
    @Column
    declare id?: number;

    @PrimaryKey
    @ForeignKey(() => User)
    @Column({ type: DataType.UUID, allowNull: false })
    declare userId: string;

    @BelongsTo(() => User)
    declare user: User;

    @PrimaryKey
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare skill: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare yearsOfExp: string;
}
