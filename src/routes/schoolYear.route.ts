import * as shoolYear from "../controllers/shoolYear.controller";
import express, { Express } from "express";
// import * as validation from "../middlewares/validation";
import * as auth from "../middlewares/auth";

export const SchoolYearRoutes = (app: Express) => {
    const router = express.Router();

    router.post("/add", [auth.verifyToken(), auth.require_admin()], shoolYear.addSchoolYear);
    router.get("/getAll", auth.verifyToken(), shoolYear.getAllSchoolYear);
    router.get("/getOne/:id", auth.verifyToken(), shoolYear.getOneSchoolYear);
    router.patch("/update/:id", [auth.verifyToken(), auth.require_admin()], shoolYear.updateSchoolYear);
    router.delete("/delete/:id", [auth.verifyToken(), auth.require_admin()], shoolYear.deleteSchoolYear);


    app.use("/api/shoolYear", router);
}