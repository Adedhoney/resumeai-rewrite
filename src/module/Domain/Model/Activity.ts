import {
    Table,
    Column,
    Model,
    DataType,
    AutoIncrement,
    PrimaryKey,
    BelongsTo,
    ForeignKey,
} from 'sequelize-typescript';
import { User } from './User';

export enum ActivityTypes {
    SIGN_UP = 'Sign up',
    LOGIN = 'Login',
    COVER_LETTER = 'Cover Letter',
    RESUME = 'Resume',
    SETTINGS = 'Settings',
}

export interface IActivityLog {
    id?: number;
    userId: string;
    activity: string;
    description: string;
    createdAt?: string;
    updatedAt?: string;
}

@Table({
    tableName: 'activities',
    timestamps: true, // If you want to manage createdAt and updatedAt timestamps
})
export class ActivityLog extends Model implements IActivityLog {
    @PrimaryKey
    @AutoIncrement
    @Column
    declare id?: number;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    declare userId: string;

    @BelongsTo(() => User, 'userId')
    declare user: User;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare activity: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare description: string;
}
