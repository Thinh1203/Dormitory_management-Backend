import * as room from "../controllers/room.controller";
import express, { Express } from "express";
// import * as validation from "../middlewares/validation";
import * as auth from "../middlewares/auth";

export const RoomRoutes = (app: Express) => {
    const router = express.Router();

    router.post("/add", [auth.verifyToken(), auth.require_admin()], room.addRoom);
    router.get("/getAll", auth.verifyToken(), room.getAll);
    router.get("/getList",  room.getList);
    router.get("/getOne/:id", auth.verifyToken(), room.getOne);
    router.patch("/update/:id", [auth.verifyToken(), auth.require_admin()], room.updateRoom);
    router.delete("/delete/:id", [auth.verifyToken(), auth.require_admin()], room.deleteRoom);


    app.use("/api/room", router);
}