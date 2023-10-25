import { Model, DataType, Table, Column, BelongsTo, ForeignKey } from "sequelize-typescript";
import { Manager } from "./manager";

@Table({
    timestamps: true,
    tableName: "notifications"
})

export class Notification extends Model {
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
    topic!: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false
    })
    content!: string;

    @ForeignKey(() => Manager)
    @Column({
        allowNull: false
    })
    managerId!: number;

   @BelongsTo(() => Manager)
    manager!: Manager;

}