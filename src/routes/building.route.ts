import * as building from "../controllers/building.controller";
import express, { Express } from "express";
// import * as validation from "../middlewares/validation";
import * as auth from "../middlewares/auth";

export const BuildingRoutes = (app: Express) => {
    const router = express.Router();

    router.post("/add", [auth.verifyToken(), auth.require_admin()], building.addBuilding);
    router.get("/getAll", [auth.verifyToken(), auth.require_admin()], building.getAllBuilding);
    router.get("/getArea", [auth.verifyToken(), auth.require_admin()], building.getAllArea);
    router.get("/getAreaCode", [auth.verifyToken(), auth.require_admin()], building.getAreaCode);
    router.get("/getOne/:id", building.getOneBuilding);
    router.patch("/update/:id", [auth.verifyToken(), auth.require_admin()], building.updateBuilding);
    router.delete("/delete/:id", [auth.verifyToken(), auth.require_admin()], building.deleteBuilding);


    app.use("/api/building", router);
}