import { Model, DataType, Table, Column, BelongsTo, ForeignKey } from "sequelize-typescript";
import { Student } from "./student";

@Table({
    timestamps: false,
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
        allowNull: false
    })
    status!: boolean;

    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    registrationTime!: Date;

    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    approvedTime!: Date;

    @ForeignKey(() => Student)
    @Column({
      allowNull: false
    })
    studentId!: number;

    @BelongsTo(() => Student)
    student!: Student;
}