import { Model, DataType, Table, Column, BelongsTo, ForeignKey, HasMany } from "sequelize-typescript";
import { ElectricityAndWater } from "./electricityandwater";

@Table({
    timestamps: false,
    tableName: "receipts"
})

export class Receipt extends Model {
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
    totalElectricityBill!: number;

    @Column({
        type: DataType.DOUBLE,
        allowNull: false
    })
    totalWaterBill!: number;

    @Column({
        type: DataType.DOUBLE,
        allowNull: false
    })
    totalBill!: number;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false
    })
    paymentStatus!: boolean;

    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    paymentTime!: Date;

    @ForeignKey(() => ElectricityAndWater)
    @Column({
        allowNull: false
    })
    ElectricityAndWaterId!: number;

   @BelongsTo(() => ElectricityAndWater)
    electricityandwater!: ElectricityAndWater;    
}