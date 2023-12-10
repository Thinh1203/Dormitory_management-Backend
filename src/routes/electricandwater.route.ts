import * as receipt from "../controllers/electricandwater.controller";
import express, { Express } from "express";
// import * as validation from "../middlewares/validation";
import * as auth from "../middlewares/auth";

export const ReceiptRoutes = (app: Express) => {
    const router = express.Router();

    router.post("/add", [auth.verifyToken(), auth.require_admin()], receipt.addNewReceipt);
    router.get("/getAll", auth.verifyToken(), receipt.getAll);
    // router.get("/getAllList", auth.verifyToken(), device.getAllList);
    router.get("/getOne/:id", auth.verifyToken(), receipt.getOne);
    router.patch("/update/:id", auth.verifyToken(), receipt.updateOne);

    router.get("/getRoomReceipt", auth.verifyToken(), receipt.getRoomReceipt);
    router.get("/statistical", [auth.verifyToken(), auth.require_admin()], receipt.statistical);

    app.use("/api/receipt", router);
}

