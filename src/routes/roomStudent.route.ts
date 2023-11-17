import * as roomStudent from "../controllers/roomStudent.controller";
import express, { Express } from "express";
// import * as validation from "../middlewares/validation";
import * as auth from "../middlewares/auth";

export const RoomStudentRoutes = (app: Express) => {
    const router = express.Router();

    router.get("/getOne/:id", auth.verifyToken(), roomStudent.getOne);
    // router.post("/addNewStudent", [auth.verifyToken(), auth.require_admin()], roomStudent.addNewStudent);
    // router.get("/getOne/:id", room.getOne);
    router.patch("/update/:id", auth.verifyToken(), roomStudent.updateOne);
    // router.delete("/delete/:id", room.deleteRoom);
    router.get("/checkRoomUser", auth.verifyToken(), roomStudent.checkRoom);
    // router.post("/create-payment", payment.create)

    app.use("/api/roomStudent", router);
}