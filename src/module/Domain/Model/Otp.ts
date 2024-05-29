import {
    Table,
    Column,
    Model,
    AutoIncrement,
    NotNull,
    Unique,
} from 'sequelize-typescript';

export interface IOTP {
    id?: number;
    email: string;
    otp: string;
    expiresAt: string;
    createdAt?: string;
    updatedAt?: string;
}

@Table
export class OTP extends Model implements IOTP {
    @AutoIncrement
    @NotNull
    declare id?: number;

    @Column
    @NotNull
    @Unique
    declare email: string;

    @Column
    @NotNull
    declare otp: string;

    @Column
    @NotNull
    declare expiresAt: string;
}
