import { Model, DataType, Table, Column, BelongsTo, ForeignKey, BelongsToMany, HasMany } from "sequelize-typescript";
import { Student } from "./student";
import { Room } from "./room";
import { ListOfDevice } from "./listofdevices";
import { RequestList } from "./requestlist";

@Table({
    timestamps: true,
    tableName: "repairrequestform"
})

export class RepairRequestForm extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    })
    id!: number;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false
    })
    status!: boolean;

    @ForeignKey(() => Student)
    @Column({
      allowNull: false
    })
    studentId!: number;

    @BelongsTo(() => Student)
    student!: Student;

    @ForeignKey(() => Room)
    @Column({
      allowNull: false
    })
    roomId!: number;

    @BelongsTo(() => Room)
    room!: Room;


     @BelongsToMany(() => ListOfDevice, () => RequestList)
    listofdevice!: ListOfDevice[];

 

}