import * as registrationForm from "../controllers/registrationForm.controller";
import express, { Express } from "express";
import * as auth from "../middlewares/auth";

export const RegistrationFormRoutes = (app: Express) => {
    const router = express.Router();

    router.post("/add", auth.verifyToken(), registrationForm.addForm);
    router.get("/getAll", registrationForm.getAll);
    router.get("/getOne/:id", auth.verifyToken(), registrationForm.getOne);
    router.patch("/update/:id", registrationForm.updateOne);
    router.delete("/delete/:id", registrationForm.deleteOne);
    router.get("/checkForm", auth.verifyToken(), registrationForm.checkFormUser);

    app.use("/api/registrationForm", router);
}