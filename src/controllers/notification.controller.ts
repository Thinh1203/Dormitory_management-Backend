import { NextFunction, Request, Response } from "express";
import * as notificationService from "../services/notification.service"
import { BadRequestError, isError } from "../utils/error";
import err from "../middlewares/error";

export const createNotification = async (req: Request, res: Response, next: NextFunction) => {
    const { topic, content } = req.body;
    const user = req.user;
    const rs = await notificationService.createNotification(topic, content, user);
    return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
};


export const getOne = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const rs = await notificationService.getOne(Number(id));
    return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
};


export const getAll = async (req: Request, res: Response, next: NextFunction) => {
    const { limit = 8, page = 1 } = req.query;
    const rs = await notificationService.getAll(Number(limit), Number(page));
    return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const rs = await notificationService.update(Number(id), req.body);
    return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
};

export const deleteOne = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const rs = await notificationService.deleteOne(Number(id));
    return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
};