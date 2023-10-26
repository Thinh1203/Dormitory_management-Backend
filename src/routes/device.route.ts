import * as device from "../controllers/device.controller";
import express, { Express } from "express";
// import * as validation from "../middlewares/validation";
// import * as auth from "../middlewares/auth";

export const DeviceRoutes = (app: Express) => {
    const router = express.Router();

    router.post("/add", device.addDevice);
    router.get("/getAll", device.getAll);
    router.get("/getOne/:id", device.getOne);
    router.patch("/update/:id", device.updateOne);
    router.delete("/delete/:id", device.deleteOne);


    app.use("/api/device", router);
}