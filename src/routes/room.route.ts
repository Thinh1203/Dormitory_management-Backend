import * as room from "../controllers/room.controller";
import express, { Express } from "express";
// import * as validation from "../middlewares/validation";
// import * as auth from "../middlewares/auth";

export const RoomRoutes = (app: Express) => {
    const router = express.Router();

    router.post("/add", room.addRoom);
    router.get("/getAll", room.getAll);
    router.get("/getOne/:id", room.getOne);
    router.patch("/update/:id", room.updateRoom);
    router.delete("/delete/:id", room.deleteRoom);


    app.use("/api/room", router);
}