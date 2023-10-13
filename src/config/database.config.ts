import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
dotenv.config();
import { Account } from "../models/account";
import { Student } from "../models/student";
import { Rule } from "../models/rule";
import { Manager } from "../models/manager"; 
import { Notification } from "../models/notification";
import { CheckOut } from "../models/checkout";
import { Building } from "../models/building";
import { Room } from "../models/room";
import { ElectricityAndWater } from "../models/electricityandwater";
import { Receipt } from "../models/receipt";
import { ListOfDevice } from "../models/listofdevices";
import { RepairRequestForm } from "../models/repairrequestform";
import { RequestList } from "../models/requestlist";
import { RoomStudent } from "../models/roomstudent";
import { SchoolYear } from "../models/schoolyear";
import { RegistrationForm } from "../models/registrationform";

const database: any = process.env.DATABASE;
const username: any = process.env.USER;
const password: any = process.env.PASSWORD;
const host: any = process.env.HOST;
const db = new Sequelize(database, username, password, {
    host: host,
    dialect: 'mysql',
    logging: false,
    // models: [],
    timezone: '+07:00',
    define: {
        timestamps: true,
        underscored: true,
        freezeTableName: true,
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci'
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
    models: [
        Account, 
        Student, 
        Rule, 
        Manager, 
        Notification, 
        CheckOut, 
        Building, 
        Room, 
        ElectricityAndWater, 
        Receipt,
        ListOfDevice,
        RepairRequestForm,
        RequestList,
        RoomStudent,
        SchoolYear,
        RegistrationForm
    ]
});

db.sync({ alter: true })
    .then(() => {
        console.log("Connection has been established successfully.");
    })
    .catch((err) => {
        console.error("Unable to connect to the Database:", err);
    });

export default db;


