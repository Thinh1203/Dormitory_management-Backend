import * as device from "../controllers/device.controller";
import express, { Express } from "express";
// import * as validation from "../middlewares/validation";
import * as auth from "../middlewares/auth";

export const DeviceRoutes = (app: Express) => {
    const router = express.Router();

    router.post("/add", [auth.verifyToken(), auth.require_admin()], device.addDevice);
    router.get("/getAll", auth.verifyToken(), device.getAll);
    router.get("/getAllList", auth.verifyToken(), device.getAllList);
    router.get("/getOne/:id", auth.verifyToken(), device.getOne);
    router.patch("/update/:id", [auth.verifyToken(), auth.require_admin()], device.updateOne);
    router.delete("/delete/:id", [auth.verifyToken(), auth.require_admin()], device.deleteOne);


    app.use("/api/device", router);
}