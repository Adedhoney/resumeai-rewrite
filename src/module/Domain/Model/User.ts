import {
    Table,
    Column,
    Model,
    DataType,
    AutoIncrement,
    PrimaryKey,
    NotNull,
    BelongsTo,
    HasMany,
    HasOne,
    Unique,
    IsNull,
} from 'sequelize-typescript';
import { UploadedResume } from './UploadedResume';
import { CoverLetter } from './CoverLetter';

export interface IUser {
    id?: number;
    userId: string;
    firstName: string;
    lastName: string;
    password?: string;
    email: string;
    premiumDueDate?: string;
    emailVerified?: boolean;
    filledPersonalInfo?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

@Table
export class User extends Model implements IUser {
    @AutoIncrement
    @NotNull
    declare id?: number;

    @Column({ type: DataType.UUID })
    @PrimaryKey
    @NotNull
    @HasMany(() => UploadedResume)
    @HasMany(() => CoverLetter)
    declare userId: string;

    @Column({ type: DataType.STRING })
    @NotNull
    declare firstName: string;

    @Column({ type: DataType.STRING })
    @NotNull
    declare lastName: string;

    @Column({ type: DataType.STRING })
    @IsNull
    declare password?: string;

    @Column({ type: DataType.STRING() })
    @NotNull
    @Unique
    declare email: string;

    @Column({ type: DataType.STRING() })
    @NotNull
    declare premiumDueDate: string;

    @Column({ type: DataType.BOOLEAN() })
    @NotNull
    declare emailVerified: boolean;

    @Column({ type: DataType.BOOLEAN() })
    @NotNull
    declare filledPersonalInfo: boolean;
}
