import * as building from "../controllers/building.controller";
import express, { Express } from "express";
// import * as validation from "../middlewares/validation";
// import * as auth from "../middlewares/auth";

export const BuildingRoutes = (app: Express) => {
    const router = express.Router();

    router.post("/add", building.addBuilding);
    router.get("/getAll", building.getAllBuilding);
    router.get("/getOne/:id", building.getOneBuilding);
    router.patch("/update/:id", building.updateBuilding);
    router.delete("/delete/:id", building.deleteBuilding);


    app.use("/api/building", router);
}