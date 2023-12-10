import { Model, DataType, Table, Column, BelongsTo, ForeignKey } from "sequelize-typescript";
import { Student } from "./student";

@Table({
    timestamps: true,
    tableName: "checkouts"
})

export class CheckOut extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    })
    id!: number;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false
    })
    status!: boolean;

    @ForeignKey(() => Student)
    @Column({
      allowNull: false
    })
    studentId!: number;

    @BelongsTo(() => Student)
    student!: Student;
}