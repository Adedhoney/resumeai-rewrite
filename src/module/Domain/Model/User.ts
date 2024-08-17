import {
    Table,
    Column,
    Model,
    DataType,
    AutoIncrement,
    PrimaryKey,
    HasMany,
    Unique,
} from 'sequelize-typescript';
import { UploadedResume } from './UploadedResume';
import { CoverLetter } from './CoverLetter';
import { Skill } from './Skills';
import { Education } from './Education';
import { WorkExperience } from './WorkExperience';

export interface IUser {
    id?: number;
    userId: string;
    firstName: string;
    middleName?: string;
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
    @Unique
    @Column
    declare id?: number;

    @PrimaryKey
    @Column({ type: DataType.UUID, allowNull: false })
    declare userId: string;

    @HasMany(() => UploadedResume, 'userId')
    declare uploadedResume: UploadedResume[];

    @HasMany(() => CoverLetter, 'userId')
    declare coverLetter: CoverLetter[];

    @HasMany(() => Skill, 'userId')
    declare skills: Skill[];

    @HasMany(() => Education, 'userId')
    declare education: Education[];

    @HasMany(() => WorkExperience, 'userId')
    declare workExperience: WorkExperience[];

    @Column({ type: DataType.STRING, allowNull: false })
    declare firstName: string;

    @Column({ type: DataType.STRING, allowNull: true })
    declare middleName?: string;

    @Column({ type: DataType.STRING, allowNull: false })
    declare lastName: string;

    @Column({ type: DataType.STRING, allowNull: true })
    declare password?: string;

    @Unique
    @Column({ type: DataType.STRING() })
    declare email: string;

    @Column({ type: DataType.STRING(), allowNull: true })
    declare premiumDueDate: string;

    @Column({ type: DataType.BOOLEAN(), allowNull: false })
    declare emailVerified: boolean;

    @Column({ type: DataType.BOOLEAN(), allowNull: false })
    declare filledPersonalInfo: boolean;
}
