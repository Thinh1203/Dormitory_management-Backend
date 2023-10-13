import { Model, DataType, Table, Column, HasMany } from "sequelize-typescript";
import { Room } from "./room";

@Table({
    timestamps: false,
    tableName: "buildings"
})

export class Building extends Model {
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
    area!: number;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    areaCode!: string;

    @HasMany(() => Room)
    room!: Room[];
    
}