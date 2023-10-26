import * as roomStudent from "../controllers/roomStudent.controller";
import express, { Express } from "express";
// import * as validation from "../middlewares/validation";
import * as auth from "../middlewares/auth";

export const RoomStudentRoutes = (app: Express) => {
    const router = express.Router();

    router.get("/getOne/:id", auth.verifyToken(), roomStudent.getOne);
    // router.get("/getAll", room.getAll);
    // router.get("/getOne/:id", room.getOne);
    // router.patch("/update/:id", room.updateRoom);
    // router.delete("/delete/:id", room.deleteRoom);
    router.get("/checkRoomUser", auth.verifyToken(), roomStudent.checkRoom);

    app.use("/api/roomStudent", router);
}