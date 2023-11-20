import * as user from "../controllers/user.controller";
import express, { Express } from "express";
import * as validation from "../middlewares/validation";
import * as auth from "../middlewares/auth";
import upload from "../middlewares/upload";

export const UserRoutes = (app: Express) => {
    const router = express.Router();

    router.post("/manager/add", [auth.verifyToken(), auth.require_admin()], user.createNewManager);
    router.get("/manager/getOne/:id", [auth.verifyToken(), auth.require_admin()], user.getOneManager);
    router.get("/manager/getAll", [auth.verifyToken(), auth.require_admin()], user.getAllManager);
    router.put("/manager/update/:id", [auth.verifyToken(), auth.require_admin()], user.updateManagerInformation)

    router.post("/student/add", upload.single('avatar'), user.createNewStudent);
    router.get("/student/getOne/:id", auth.verifyToken(), user.getOneStudent);
    router.delete("/student/deleteOne/:id", [auth.verifyToken(), auth.require_admin()], user.deleteOneStudent);
    router.get("/student/getInformation", auth.verifyToken(), user.getInformationStudent);
    router.get("/student/getAll", [auth.verifyToken(), auth.require_admin()], user.getAllStudent);
    router.patch("/student/update/:id", auth.verifyToken(), user.updateStudentInformation);
    router.patch("/student/update/avatar/:id", [upload.single('avatar'), validation.validateImageExtension], user.updateAvatar);

    app.use("/api/user", router);
}