import { Model, DataType, Table, Column, BelongsTo, ForeignKey, HasOne } from "sequelize-typescript";
import { Room } from "./room"; 
import { Receipt } from "./receipt";
import { SchoolYear } from "./schoolyear";

@Table({
    timestamps: false,
    tableName: "electricityandwaters"
})

export class ElectricityAndWater extends Model {
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
    month!: number;

    @Column({
        type: DataType.DOUBLE,
        allowNull: false
    })
    oldElectricityIndicator!: number;

    @Column({
        type: DataType.DOUBLE,
        allowNull: false
    })
    newElectricityIndicator!: number;

    @Column({
        type: DataType.DOUBLE,
        allowNull: false
    })
    oldWaterIndicator!: number;

    @Column({
        type: DataType.DOUBLE,
        allowNull: false
    })
    newWaterIndicator!: number;

    @Column({
        type: DataType.DOUBLE,
        allowNull: false
    })
    electricityPrice!: number;

    @Column({
        type: DataType.DOUBLE,
        allowNull: false
    })
    waterPrice!: number;

    @ForeignKey(() => Room)
    @Column({
        allowNull: false
    })
    roomId!: number;

   @BelongsTo(() => Room)
    room!: Room;

    @HasOne(() => Receipt)
    receipt!: Receipt;

    @ForeignKey(() => SchoolYear)
    @Column({
        allowNull: false
    })
    schoolyearId!: number;

    @BelongsTo(() => SchoolYear)
    schoolyear!: SchoolYear;

}