import { Model, DataType, Table, Column, BelongsTo, ForeignKey } from "sequelize-typescript";
import { Account } from "./account";

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
        type: DataType.BOOLEAN,
        allowNull: false
    })
    male!: boolean;

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


    @ForeignKey(() => Account)
    @Column({
      allowNull: false
    })
    accountId!: number;
  
    @BelongsTo(() => Account)
    account!: Account;
}