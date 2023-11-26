import * as notification from "../controllers/notification.controller";
import express, { Express } from "express";
// import * as validation from "../middlewares/validation";
import * as auth from "../middlewares/auth";

export const NotificationRoutes = (app: Express) => {
    const router = express.Router();

    router.post("/add", [auth.verifyToken(), auth.require_admin()], notification.createNotification);
    router.get("/getOne/:id", notification.getOne);
    router.get("/getAll", auth.verifyToken(), notification.getAll);
    router.patch("/update/:id", [auth.verifyToken(), auth.require_admin()], notification.update)
    router.delete("/delete/:id", [auth.verifyToken(), auth.require_admin()], notification.deleteOne);

    app.use("/api/notification", router);
}