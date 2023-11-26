import { NextFunction, Request, Response } from "express";
import * as registrationFormService from "../services/registrationform.service"
import { BadRequestError, isError } from "../utils/error";
import err from "../middlewares/error";

export const addForm = async (req: Request, res: Response, next: NextFunction) => {
    const { wish, roomId, schoolYearId, registrationTime } = req.body;
    const user = req.user;

    if (wish !== undefined && wish.length > 0) {
        const rs = await registrationFormService.addForm(Number(registrationTime), wish, user, Number(roomId), Number(schoolYearId));
        return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
    }
    const rs = await registrationFormService.addForm(Number(registrationTime), null, user, Number(roomId), Number(schoolYearId));
    return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
};

export const getOne = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const rs = await registrationFormService.getOne(Number(id));
    return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
};

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
    const { limit = 10, page = 1, filter, search } = req.query;
    if (Number(filter) > 3) {
        const rs = await registrationFormService.getAll(Number(limit), Number(page), null, search && String(search));
        return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
    } else {
        const rs = await registrationFormService.getAll(Number(limit), Number(page), Number(filter), search && String(search));
        return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
    }

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


export const checkFormUser = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    const rs = await registrationFormService.checkFormUser(user);
    return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
};