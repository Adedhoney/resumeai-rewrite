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

export interface IUploadedResume {
    id?: number;
    resumeId: string;
    userId: string;
    resumeName: string;
    resumeText: string;
    createdAt?: string;
    updatedAt?: string;
}

@Table({
    tableName: 'uploadedResumes',
    timestamps: true, // If you want to manage createdAt and updatedAt timestamps
})
export class UploadedResume extends Model implements IUploadedResume {
    @AutoIncrement
    @Unique
    @Column
    declare id?: number;

    @PrimaryKey
    @Column({ type: DataType.UUID, allowNull: false })
    declare resumeId: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID, allowNull: false })
    declare userId: string;

    @BelongsTo(() => User, 'userId')
    declare user: User;

    @Column({ type: DataType.STRING(), allowNull: false })
    declare resumeName: string;

    @Column({ type: DataType.TEXT('long'), allowNull: false })
    declare resumeText: string;
}
