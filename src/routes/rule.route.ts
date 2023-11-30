import * as rule from "../controllers/rule.controller";
import express, { Express } from "express";
// import * as validation from "../middlewares/validation";
import * as auth from "../middlewares/auth";

export const RuleRoutes = (app: Express) => {
    const router = express.Router();

    router.get("/getOne/:id", [auth.verifyToken(), auth.require_admin()], rule.getOne);
    router.post("/add", [auth.verifyToken(), auth.require_admin()], rule.addStudent);
    router.get("/getAll", [auth.verifyToken(), auth.require_admin()], rule.getAll);
    // router.patch("/update/:id", auth.verifyToken(), roomStudent.updateOne);
    // router.delete("/delete/:id", [auth.verifyToken(), auth.require_admin()], roomStudent.deleteOne);
    // router.get("/checkRoomUser", auth.verifyToken(), roomStudent.checkRoom);
    // router.post("/create-payment", payment.create)

    app.use("/api/rule", router);
}