import { NextFunction, Request, Response } from "express";
import * as roomStudentService from "../services/roomstudent.service"
import { BadRequestError, isError } from "../utils/error";
import err from "../middlewares/error";


export const getOne = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const rs = await roomStudentService.getOne(Number(id));
    return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
};

export const checkRoom = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const rs = await roomStudentService.checkRoom(user);
    return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
};
