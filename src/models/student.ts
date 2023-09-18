import { Model, DataType, Table, Column, HasMany, BelongsTo, ForeignKey } from "sequelize-typescript";
import { Account } from "./account";
import { Rule } from "./rule";

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
    mssv!: string;

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

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    identificationNumber!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    class!: string;

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
}