import * as checkOut from "../controllers/checkout.controller";
import express, { Express } from "express";
import * as auth from "../middlewares/auth";

export const CheckOutRoutes = (app: Express) => {
    const router = express.Router();

    router.post("/add", auth.verifyToken(), checkOut.addNew);
    router.get("/getAll", [auth.verifyToken(), auth.require_admin()], checkOut.getAllFormCheckOut);
    // router.get("/getArea", [auth.verifyToken(), auth.require_admin()], building.getAllArea);
    // router.get("/getAreaCode", [auth.verifyToken(), auth.require_admin()], building.getAreaCode);
    router.get("/getOne", auth.verifyToken(), checkOut.getOne);
    router.patch("/update/:id", [auth.verifyToken(), auth.require_admin()], checkOut.updateOne);
    // router.delete("/delete/:id", [auth.verifyToken(), auth.require_admin()], building.deleteBuilding);


    app.use("/api/checkOut", router);
}