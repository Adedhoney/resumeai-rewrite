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
    ForeignKey,
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

@Table({
    tableName: 'users',
    timestamps: true, // If you want to manage createdAt and updatedAt timestamps
})
export class User extends Model implements IUser {
    @AutoIncrement
    @PrimaryKey
    @Column
    declare id?: number;

    @PrimaryKey
    @Column({ type: DataType.UUID, allowNull: false })
    declare userId: string;

    @HasMany(() => UploadedResume)
    declare uploadedResume: UploadedResume;

    @HasMany(() => CoverLetter)
    declare coverLetter: CoverLetter;

    @Column({ type: DataType.STRING, allowNull: false })
    declare firstName: string;

    @Column({ type: DataType.STRING, allowNull: false })
    declare lastName: string;

    @Column({ type: DataType.STRING, allowNull: true })
    declare password?: string;

    @Unique
    @Column({ type: DataType.STRING() })
    declare email: string;

    @Column({ type: DataType.STRING(), allowNull: false })
    declare premiumDueDate: string;

    @Column({ type: DataType.BOOLEAN(), allowNull: false })
    declare emailVerified: boolean;

    @Column({ type: DataType.BOOLEAN(), allowNull: false })
    declare filledPersonalInfo: boolean;
}
