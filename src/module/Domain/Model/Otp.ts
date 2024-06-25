import {
    Table,
    Column,
    Model,
    AutoIncrement,
    NotNull,
    Unique,
    DataType,
    PrimaryKey,
} from 'sequelize-typescript';

export interface IOTP {
    id?: number;
    email: string;
    otp: string;
    expiresAt: string;
    createdAt?: string;
    updatedAt?: string;
}

@Table({
    tableName: 'otps',
    timestamps: true, // If you want to manage createdAt and updatedAt timestamps
})
export class OTP extends Model implements IOTP {
    @AutoIncrement
    @PrimaryKey
    @Column
    declare id?: number;

    @Unique
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    declare email: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    declare otp: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    declare expiresAt: string;
}
