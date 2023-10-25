import { Model, DataType, Table, Column, HasMany, HasOne, BelongsTo, ForeignKey, BelongsToMany } from "sequelize-typescript";
import { Account } from "./account";
import { Rule } from "./rule";
import { CheckOut } from "./checkout";
import { RepairRequestForm } from "./repairrequestform";
import { Room } from "./room";
import { RoomStudent } from "./roomstudent";
import { RegistrationForm } from "./registrationform";

@Table({
    timestamps: false,
    tableName: "students"
})

export class Student extends Model {
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
    avatar!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    mssv!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    fullName!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    gender!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    email!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    numberPhone!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    address!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    identificationNumber!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    major!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    classs!: string;

    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    birthday!: Date;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    course!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    relativeName!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    relationship!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    relativeNumberPhone!: string;

    @ForeignKey(() => Account)
    @Column({
      allowNull: false
    })
    accountId!: number;
  
    @BelongsTo(() => Account)
    account!: Account;

    @HasMany(() => Rule)
    rule!: Rule[];

    @HasMany(() => RepairRequestForm)
    repairrequestform!: RepairRequestForm[];

    @HasMany(() => RegistrationForm)
    registrationform!: RegistrationForm[]

    @HasOne(() => CheckOut)
    checkOut!: CheckOut;

    @BelongsToMany(() => Room, () => RoomStudent)
    room!: Room[];

}