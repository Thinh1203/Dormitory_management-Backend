import 'reflect-metadata';
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import db from "./config/database.config";
dotenv.config();


db.authenticate().then(() => {
    
    console.log('Connection has been established successfully.');

    const app: Express = express();
    
    const PORT = process.env.PORT || 5050;

    app.use(cors());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(express.json());

    app.get("/", (req: Request, res: Response) => {
        return res.json({message: "Well come to my app"});
    });

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

}).catch((err) => {
    console.log(`Unable to connect to the database: ${err}`);
});
