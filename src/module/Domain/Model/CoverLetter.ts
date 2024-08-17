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

export interface ICoverLetter {
    id?: number;
    coverId: string;
    userId: string;
    employer: string;
    jobTitle: string;
    coverLetter: string;
    createdAt?: string;
    updatedAt?: string;
}

@Table({
    tableName: 'cover_letters',
    timestamps: true, // If you want to manage createdAt and updatedAt timestamps
})
export class CoverLetter extends Model implements ICoverLetter {
    @AutoIncrement
    @Unique
    @Column
    declare id?: number;

    @PrimaryKey
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    declare coverId: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    declare userId: string;

    @BelongsTo(() => User, 'userId')
    declare user: User;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare employer: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare jobTitle: string;

    @Column({
        type: DataType.TEXT('long'),
        allowNull: false,
    })
    declare coverLetter: string;
}
