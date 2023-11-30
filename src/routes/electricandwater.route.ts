import * as receipt from "../controllers/electricandwater.controller";
import express, { Express } from "express";
// import * as validation from "../middlewares/validation";
import * as auth from "../middlewares/auth";

export const ReceiptRoutes = (app: Express) => {
    const router = express.Router();

    router.post("/add", receipt.addNewReceipt);
    router.get("/getAll", receipt.getAll);
    // router.get("/getAllList", auth.verifyToken(), device.getAllList);
    // router.get("/getOne/:id", auth.verifyToken(), device.getOne);
    // router.patch("/update/:id", [auth.verifyToken(), auth.require_admin()], device.updateOne);
    // router.delete("/delete/:id", [auth.verifyToken(), auth.require_admin()], device.deleteOne);


    app.use("/api/receipt", router);
}

