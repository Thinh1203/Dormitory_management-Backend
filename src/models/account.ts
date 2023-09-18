import { Model, DataType, Table, Column } from "sequelize-typescript";

@Table({
    timestamps: false,
    tableName: "accounts"
})

export class Account extends Model {
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
    userName!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    password!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        defaultValue: "member"
    })
    role!: string;
}