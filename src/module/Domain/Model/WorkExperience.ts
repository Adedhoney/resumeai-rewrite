import {
    Table,
    Column,
    Model,
    DataType,
    AutoIncrement,
    PrimaryKey,
    NotNull,
    BelongsTo,
    AllowNull,
    ForeignKey,
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
    @PrimaryKey
    @Column
    declare id?: number;

    @PrimaryKey
    @Column({ type: DataType.UUID })
    declare experienceId: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID, allowNull: false })
    declare userId: string;

    @BelongsTo(() => User)
    declare user: User;

    @Column({ type: DataType.BOOLEAN, allowNull: false })
    declare isCurrentWork: boolean;

    @Column({ type: DataType.BOOLEAN, allowNull: false })
    declare expType: string;

    @Column({ type: DataType.BOOLEAN, allowNull: false })
    declare employer: string;

    @Column({ type: DataType.BOOLEAN, allowNull: false })
    declare jobTitle: string;

    @Column({ type: DataType.TEXT('long'), allowNull: false })
    declare details: string;

    @Column({ type: DataType.DATE, allowNull: false })
    declare startDate: string;

    @Column({ type: DataType.DATE, allowNull: false })
    declare endDate: string;
}
