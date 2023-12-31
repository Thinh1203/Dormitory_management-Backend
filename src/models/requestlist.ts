import { Model, DataType, Table, Column, BelongsTo, ForeignKey, HasMany } from "sequelize-typescript";
import { RepairRequestForm } from "./repairrequestform";
import { ListOfDevice } from "./listofdevices";

@Table({
    timestamps: false,
    tableName: "requestlists"
})

export class RequestList extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    })
    id!: number;



    @ForeignKey(() => RepairRequestForm)
    @Column
    repairrequestformId!: number;

    @ForeignKey(() => ListOfDevice)
    @Column
    listofdeviceId!: number;

    @BelongsTo(() => RepairRequestForm)
    repairrequestform!: RepairRequestForm;

    @BelongsTo(() => ListOfDevice)
    listofdevice!: ListOfDevice;
}