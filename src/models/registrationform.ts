import { Model, DataType, Table, Column, BelongsTo, ForeignKey, HasMany } from "sequelize-typescript";
import { Student } from "./student";
import { Room } from "./room";
import { SchoolYear } from "./schoolyear";

@Table({
    timestamps: true,
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
        type: DataType.INTEGER,
        allowNull: false
    })
    registrationTime!: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0
    })
    registrationStatus!: number;

    @Column({
        type: DataType.TEXT,
        allowNull: true
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

    
    @BelongsTo(() => Student)
    student!: Student;

    @BelongsTo(() => Room)
    room!: Room;
}