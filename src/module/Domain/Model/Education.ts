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

export interface IEducation {
    id?: number;
    educationId: string;
    userId: string;
    school: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate?: string;
    grade?: string;
    activities?: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
}

@Table
export class Education extends Model implements IEducation {
    @AutoIncrement
    @NotNull
    declare id?: number;

    @Column({ type: DataType.UUID })
    @NotNull
    @PrimaryKey
    declare educationId: string;

    @Column({ type: DataType.UUID })
    @NotNull
    @BelongsTo(() => User)
    declare userId: string;

    @Column
    @NotNull
    declare school: string;

    @Column
    @NotNull
    declare degree: string;

    @Column
    @NotNull
    declare fieldOfStudy: string;

    @Column
    @NotNull
    declare startDate: string;

    @Column
    @NotNull
    declare endDate?: string;

    @Column
    @NotNull
    declare grade?: string;

    @Column
    @NotNull
    declare activities?: string;

    @Column
    @NotNull
    declare description?: string;
}
