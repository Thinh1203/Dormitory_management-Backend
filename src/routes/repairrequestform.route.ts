import * as repairRequestForm from "../controllers/repairrequesform.controller";
import express, { Express } from "express";
import * as auth from "../middlewares/auth";

export const RepairRequestFormRoutes = (app: Express) => {
    const router = express.Router();

    router.post("/add", auth.verifyToken(), repairRequestForm.addForm);
    router.get("/getAll", auth.verifyToken(), repairRequestForm.getAll);
    router.get("/getOne/:id", auth.verifyToken(), repairRequestForm.getOne);
    router.get("/getUserRepair", auth.verifyToken(), repairRequestForm.getUserRepair);
    router.patch("/update/:id", [auth.verifyToken(), auth.require_admin()], repairRequestForm.updateOne);
    // router.delete("/delete/:id", registrationForm.deleteOne);
    router.get("/export",[auth.verifyToken(), auth.require_admin()], repairRequestForm.exportData );

    app.use("/api/repairRequestForm", router);
}