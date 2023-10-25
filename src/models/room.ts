import { Model, DataType, Table, Column, BelongsTo, ForeignKey, HasMany, BelongsToMany } from "sequelize-typescript";
import { Building } from "./building";
import { ElectricityAndWater } from "./electricityandwater";
import { RepairRequestForm } from "./repairrequestform";
import { Student } from "./student";
import { RoomStudent } from "./roomstudent";
import { RegistrationForm } from "./registrationform";

@Table({
    timestamps: false,
    tableName: "rooms"
})

export class Room extends Model {
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
    roomCode!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    roomType!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    roomMale!: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true
    })
    status!: boolean;

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    capacity!: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    actualCapacity!: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
        defaultValue: 0
    })
    wereThere!: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    empty!: number;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false
    })
    kitchen!: boolean;

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    price!: number;

    @ForeignKey(() => Building)
    @Column({
        allowNull: false
    })
    buildingId!: number;

   @BelongsTo(() => Building)
    building!: Building;

    @HasMany(() => RegistrationForm)
    registrationform!: RegistrationForm[]

    @HasMany(() => ElectricityAndWater)
    electricityandwater!: ElectricityAndWater[];

    // @HasMany(() => RepairRequestForm)
    // repairrequestform!: RepairRequestForm[];

    @BelongsToMany(() => Student, () => RoomStudent)
    student!: Student[];
}