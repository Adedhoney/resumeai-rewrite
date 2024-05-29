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

export interface IUploadedResume {
    id?: number;
    resumeId: string;
    userId: string;
    resumeName: string;
    resumeText: string;
    createdAt?: string;
    updatedAt?: string;
}

@Table
export class UploadedResume extends Model implements IUploadedResume {
    @AutoIncrement
    @NotNull
    declare id?: number;

    @PrimaryKey
    @NotNull
    @Column({ type: DataType.UUID })
    declare resumeId: string;

    @Column({ type: DataType.UUID })
    @NotNull
    @BelongsTo(() => User)
    declare userId: string;

    @Column({ type: DataType.STRING() })
    @NotNull
    declare resumeName: string;

    @Column({ type: DataType.TEXT('long') })
    @NotNull
    declare resumeText: string;
}
