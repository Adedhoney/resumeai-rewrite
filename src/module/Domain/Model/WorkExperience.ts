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

export interface IWorkExperience {
    id?: number;
    experienceId: string;
    userId: string;
    expType: string;
    employer: string;
    jobTitle: string;
    details: string;
    startDate: string;
    endDate: string;
    createdAt?: string;
    updatedAt?: string;
}

export enum ExpType {
    PROJECT = 'PROJECT',
    EMPLOYMENT = 'EMPLOYMENT',
}

@Table
export class WorkExperience extends Model implements IWorkExperience {
    @AutoIncrement
    @NotNull
    declare id?: number;

    @Column({ type: DataType.UUID })
    @PrimaryKey
    @NotNull
    declare experienceId: string;

    @Column({ type: DataType.UUID })
    @NotNull
    @BelongsTo(() => User)
    declare userId: string;

    @Column
    @NotNull
    declare expType: string;

    @Column
    @NotNull
    declare employer: string;

    @Column
    @NotNull
    declare jobTitle: string;

    @Column({ type: DataType.TEXT('long') })
    @NotNull
    declare details: string;

    @Column(DataType.DATE)
    @NotNull
    declare startDate: string;

    @Column(DataType.DATE)
    @NotNull
    declare endDate: string;
}
