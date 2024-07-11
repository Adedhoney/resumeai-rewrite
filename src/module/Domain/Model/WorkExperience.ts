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

export interface IWorkExperience {
    id?: number;
    experienceId: string;
    userId?: string;
    isCurrentWork: boolean;
    expType: string;
    employer: string;
    jobTitle: string;
    details: string;
    startDate: string;
    endDate?: string;
    createdAt?: string;
    updatedAt?: string;
}

export enum ExpType {
    PROJECT = 'PROJECT',
    EMPLOYMENT = 'EMPLOYMENT',
}

@Table({
    tableName: 'work_experience',
    timestamps: true, // If you want to manage createdAt and updatedAt timestamps
})
export class WorkExperience extends Model implements IWorkExperience {
    @AutoIncrement
    @Unique
    @Column
    declare id?: number;

    @PrimaryKey
    @Column({ type: DataType.UUID })
    declare experienceId: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID, allowNull: false })
    declare userId: string;

    @BelongsTo(() => User, 'userId')
    declare user: User;

    @Column({ type: DataType.BOOLEAN, allowNull: false })
    declare isCurrentWork: boolean;

    @Column({ type: DataType.STRING, allowNull: false })
    declare expType: string;

    @Column({ type: DataType.STRING, allowNull: false })
    declare employer: string;

    @Column({ type: DataType.STRING, allowNull: false })
    declare jobTitle: string;

    @Column({ type: DataType.TEXT('long'), allowNull: false })
    declare details: string;

    @Column({ type: DataType.STRING, allowNull: false })
    declare startDate: string;

    @Column({ type: DataType.STRING, allowNull: true })
    declare endDate?: string;
}
