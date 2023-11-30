import { Model, DataType, Table, Column, BelongsTo, ForeignKey, HasMany } from "sequelize-typescript";
import { RegistrationForm } from "./registrationform";
import { ElectricityAndWater } from "./electricityandwater";

@Table({
    timestamps: false,
    tableName: "schoolyears"
})

export class SchoolYear extends Model {
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
    year!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    semester!: string;

    @HasMany(() => RegistrationForm)
    registrationform!: RegistrationForm[]

    @HasMany(() => ElectricityAndWater)
    electricityandwater!: ElectricityAndWater[]

}