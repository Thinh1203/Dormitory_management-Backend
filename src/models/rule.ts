import { Model, DataType, Table, Column, BelongsTo, ForeignKey } from "sequelize-typescript";
import { Student } from "./student";

@Table({
    timestamps: false,
    tableName: "rules"
})

export class Rule extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    })
    id!: number;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    contentViolation!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    discipline!: string;

    @ForeignKey(() => Student)
    @Column({
        allowNull: false
    })
    studentId!: number;

   @BelongsTo(() => Student)
    student!: Student;
}