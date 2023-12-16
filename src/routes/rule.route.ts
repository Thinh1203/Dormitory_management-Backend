import * as rule from "../controllers/rule.controller";
import express, { Express } from "express";
// import * as validation from "../middlewares/validation";
import * as auth from "../middlewares/auth";

export const RuleRoutes = (app: Express) => {
    const router = express.Router();

    router.get("/getOne/:id", [auth.verifyToken(), auth.require_admin()], rule.getOne);
    router.post("/add", [auth.verifyToken(), auth.require_admin()], rule.addStudent);
    router.get("/getAll", [auth.verifyToken(), auth.require_admin()], rule.getAll);


    app.use("/api/rule", router);
}