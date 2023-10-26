import { NextFunction, Request, Response } from "express";
import * as deviceService from "../services/device.service";
import { BadRequestError, isError } from "../utils/error";
import err from "../middlewares/error";

export const addDevice = async (req: Request, res: Response, next: NextFunction) => {
    const { repairCode, repairDetail } = req.body;
    const rs = await deviceService.addDevice({ repairCode, repairDetail });
    return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
};

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
    const rs = await deviceService.getAll();
    return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
};

export const getOne = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const rs = await deviceService.getOne(Number(id));
    return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
};

export const updateOne = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const rs = await deviceService.updateOne(Number(id), req.body);
    return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
};

export const deleteOne = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const rs = await deviceService.deleteOne(Number(id));
    return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
};
