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

@Table
export class CoverLetter extends Model implements ICoverLetter {
    @AutoIncrement
    @NotNull
    declare id?: number;

    @PrimaryKey
    @NotNull
    @Column({ type: DataType.UUID })
    declare coverId: string;

    @Column({ type: DataType.UUID })
    @NotNull
    @BelongsTo(() => User)
    declare userId: string;

    @Column({ type: DataType.STRING() })
    @NotNull
    declare employer: string;

    @Column({ type: DataType.STRING() })
    @NotNull
    declare jobTitle: string;

    @Column({ type: DataType.TEXT('long') })
    @NotNull
    declare coverLetter: string;
}
export default { name: 'coverLetter', table: CoverLetter };
