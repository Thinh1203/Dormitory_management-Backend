import { NextFunction, Request, Response } from "express";
import * as registrationFormService from "../services/registrationform.service"
import { BadRequestError, isError } from "../utils/error";
import err from "../middlewares/error";

export const addForm = async (req: Request, res: Response, next: NextFunction) => {
    const { wish, roomId, schoolyearId, registrationTime } = req.body;
    const user = req.user;

    if (wish.length > 0) {
        const rs = await registrationFormService.addForm(Number(registrationTime), wish, user, Number(roomId), Number(schoolyearId));
        return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
    }
    const rs = await registrationFormService.addForm(Number(registrationTime), null, user, Number(roomId), Number(schoolyearId));
    return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
};

export const getOne = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const rs = await registrationFormService.getOne(Number(id));
    return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
};

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
    const { limit = 10, page = 1, filter } = req.query;
    if (Number(filter) < 1) {
        const rs = await registrationFormService.getAll(Number(limit), Number(page), null);
        return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
    }
    const rs = await registrationFormService.getAll(Number(limit), Number(page), Number(filter));
    return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
};

export const deleteOne = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const rs = await registrationFormService.deleteOne(Number(id));
    return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
};

export const updateOne = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { registrationStatus } = req.body;
    const rs = await registrationFormService.updateOne(Number(id), Number(registrationStatus));
    return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
};