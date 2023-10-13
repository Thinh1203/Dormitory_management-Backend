import { Model, DataType, Table, Column, BelongsTo, ForeignKey, HasMany } from "sequelize-typescript";
import { Student } from "./student";
import { Room } from "./room";
import { SchoolYear } from "./schoolyear";

@Table({
    timestamps: false,
    tableName: "registrationforms"
})

export class RegistrationForm extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    })
    id!: number;

    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    registrationTime!: Date;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false
    })
    registrationStatus!: boolean;

    @Column({
        type: DataType.TEXT,
        allowNull: false
    })
    wish!: string;

    @ForeignKey(() => Student)
    @Column({
        allowNull: false
    })
    studentId!: number;
  
    @ForeignKey(() => Room)
    @Column({
        allowNull: false
    })
    roomId!: number;

    @ForeignKey(() => SchoolYear)
    @Column({
        allowNull: false
    })
    schoolyearId!: number;
}