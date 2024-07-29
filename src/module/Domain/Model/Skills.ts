import {
    Table,
    Column,
    Model,
    DataType,
    AutoIncrement,
    PrimaryKey,
    BelongsTo,
    ForeignKey,
    Unique,
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

@Table({
    tableName: 'skills',
    timestamps: true, // If you want to manage createdAt and updatedAt timestamps
})
export class Skill extends Model implements ISkill {
    @AutoIncrement
    @Unique
    @Column
    declare id?: number;

    @PrimaryKey
    @ForeignKey(() => User)
    @Column({ type: DataType.UUID, allowNull: false })
    declare userId: string;

    @BelongsTo(() => User, 'userId')
    declare user: User;

    @PrimaryKey
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare skill: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare yearsOfExp: number;
}
