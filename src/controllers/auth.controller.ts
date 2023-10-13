import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { BadRequestError, isError } from "../utils/error";
import * as userServices from "../services/user.service";
import bcrypt from "bcryptjs";
import err from "../middlewares/error";

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { userName, password } = req.body;
    if (userName && password) {
        const account = await userServices.findOneByAccount(userName);
        if (isError(account)) {
            return next(err(BadRequestError("User not found!"), res));
        }
        let user = await userServices.findOneByUser(account.id);

        if (bcrypt.compareSync(password, account.password)) return res.json({
            message:"login success",
            token: jwt.sign({
                user_id: user.id,
                role: account.role,
                fullName: user.fullName
            }, process.env.JWT_SECRET_KEY || "Thinh123")
        })
        else return next(err(BadRequestError("password is incorrect!"), res)); 
    }
    return next(err(BadRequestError("UserName or Password cannot be empty!"), res));
}