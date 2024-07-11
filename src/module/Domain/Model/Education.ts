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

@Table({
    tableName: 'education',
    timestamps: true, // If you want to manage createdAt and updatedAt timestamps
})
export class Education extends Model implements IEducation {
    @AutoIncrement
    @Unique
    @Column
    declare id?: number;

    @PrimaryKey
    @Column({ type: DataType.UUID, allowNull: false })
    declare educationId: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID })
    declare userId: string;

    @BelongsTo(() => User, 'userId')
    declare user: User;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare school: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare degree: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare fieldOfStudy: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare startDate: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    declare endDate?: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    declare grade?: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    declare activities?: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    declare description?: string;
}
