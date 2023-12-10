import { NextFunction, Request, Response } from "express";
import * as checkOutService from "../services/checkout.service"
import { BadRequestError, isError } from "../utils/error";
import err from "../middlewares/error";

export const addNew = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.body;

    const rs = await checkOutService.addNew(user);
    return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
};

export const getOne = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    const rs = await checkOutService.getOne(user);
    return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
};


export const getAllFormCheckOut = async (req: Request, res: Response, next: NextFunction) => {
    const { limit = 6, page = 1, filter, search } = req.query;

    if (filter === '') {
        const rs = await checkOutService.getAllFormCheckOut(Number(limit), Number(page), null, search && String(search));
        return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
    } else {
        const rs = await checkOutService.getAllFormCheckOut(Number(limit), Number(page), filter, search && String(search));
        return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
    }
};

export const updateOne = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { status } = req.body

    const rs = await checkOutService.updateOne(Number(id), status);
    return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
};