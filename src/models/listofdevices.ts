import { Model, DataType, Table, Column, BelongsToMany } from "sequelize-typescript";
import { RepairRequestForm } from "./repairrequestform";
import { RequestList } from "./requestlist";

@Table({
    timestamps: false,
    tableName: "listofdevices"
})

export class ListOfDevice extends Model {
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
    repairCode!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    repairDetail!: string;

    @BelongsToMany(() => RepairRequestForm, () => RequestList)
    repairrequestform!: RepairRequestForm[];
  
}