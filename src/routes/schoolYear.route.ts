import * as shoolYear from "../controllers/shoolYear.controller";
import express, { Express } from "express";
// import * as validation from "../middlewares/validation";
// import * as auth from "../middlewares/auth";

export const SchoolYearRoutes = (app: Express) => {
    const router = express.Router();

    router.post("/add", shoolYear.addSchoolYear);
    router.get("/getAll", shoolYear.getAllSchoolYear);
    router.get("/getOne/:id", shoolYear.getOneSchoolYear);
    router.patch("/update/:id", shoolYear.updateSchoolYear);
    router.delete("/delete/:id", shoolYear.deleteSchoolYear);


    app.use("/api/shoolYear", router);
}