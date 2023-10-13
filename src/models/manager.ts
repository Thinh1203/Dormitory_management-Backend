import { Model, DataType, Table, Column, BelongsTo, ForeignKey, HasMany } from "sequelize-typescript";
import { Account } from "./account";
import { Notification } from "./notification";

@Table({
    timestamps: false,
    tableName: "managers"
})

export class Manager extends Model {
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
    mscb!: string;

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
        type: DataType.DATE,
        allowNull: false
    })
    birthday!: Date;

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


    @ForeignKey(() => Account)
    @Column({
      allowNull: false
    })
    accountId!: number;
  
    @BelongsTo(() => Account)
    account!: Account;

    @HasMany(() => Notification)
    notification!: Notification[];
}