import { NextFunction, Request, Response } from "express";
import * as roomStudentService from "../services/roomstudent.service"
import { BadRequestError, isError } from "../utils/error";
import err from "../middlewares/error";


export const getOne = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const rs = await roomStudentService.getOne(Number(id));
    return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
};

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
    const { limit = 6, page = 1, filter, search } = req.query;
    if (filter === '') {
        const rs = await roomStudentService.getAll(Number(limit), Number(page), null, search && String(search));
        return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
    } else {        
        const rs = await roomStudentService.getAll(Number(limit), Number(page), filter, search && String(search));
        return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
    }
};

export const checkRoom = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const rs = await roomStudentService.checkRoom(user);
    return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
};

export const updateOne = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { paymentStatus } = req.body;
    const rs = await roomStudentService.updateOne(Number(id), paymentStatus);
    return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
};

export const deleteOne = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const rs = await roomStudentService.deleteOne(Number(id));
    return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
};

export const addNewStudent = async (req: Request, res: Response, next: NextFunction) => {
    const { studentId, roomId, paymentStatus, time, schoolyearId } = req.body;
    const rs = await roomStudentService.addNewStudent(Number(studentId), Number(roomId), paymentStatus, Number(time), Number(schoolyearId));
    return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
};