import * as roomStudent from "../controllers/roomStudent.controller";
import express, { Express } from "express";
// import * as validation from "../middlewares/validation";
import * as auth from "../middlewares/auth";

export const RoomStudentRoutes = (app: Express) => {
    const router = express.Router();

    router.get("/getOne/:id", auth.verifyToken(), roomStudent.getOne);
    router.post("/addNewStudent", [auth.verifyToken(), auth.require_admin()], roomStudent.addNewStudent);
    router.get("/getAll", [auth.verifyToken(), auth.require_admin()], roomStudent.getAll);
    router.patch("/update/:id", auth.verifyToken(), roomStudent.updateOne);
    router.delete("/delete/:id", [auth.verifyToken(), auth.require_admin()], roomStudent.deleteOne);
    router.get("/checkRoomUser", auth.verifyToken(), roomStudent.checkRoom);
 

    app.use("/api/roomStudent", router);
}