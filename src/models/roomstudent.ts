import { Model, DataType, Table, Column, BelongsTo, ForeignKey, HasMany } from "sequelize-typescript";
import { Student } from "./student";
import { Room } from "./room";

@Table({
    timestamps: true,
    tableName: "roomstudents"
})

export class RoomStudent extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    })
    id!: number;

    @Column({
        type: DataType.DOUBLE,
        allowNull: false
    })
    roomFee!: number;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false
    })
    paymentStatus!: boolean;

    @ForeignKey(() => Student)
    @Column
    studentId!: number;

    @ForeignKey(() => Room)
    @Column
    roomId!: number;

    @BelongsTo(() => Student)
    student!: Student;
    
    @BelongsTo(() => Room)
    room!: Room;
}