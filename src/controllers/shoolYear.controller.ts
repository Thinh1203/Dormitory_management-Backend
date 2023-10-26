import { NextFunction, Request, Response } from "express";
import * as shoolYearService from "../services/schoolYear.service";
import { BadRequestError, isError } from "../utils/error";
import err from "../middlewares/error";

export const addSchoolYear = async (req: Request, res: Response, next: NextFunction) => {
    const { year, semester } = req.body;
    const rs = await shoolYearService.addSchoolYear({ year, semester });
    return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
};

export const getOneSchoolYear = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const rs = await shoolYearService.getOneSchoolYear(Number(id));
    return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
};

export const getAllSchoolYear = async (req: Request, res: Response, next: NextFunction) => {
    const rs = await shoolYearService.getAllSchoolYear();
    return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
};

export const updateSchoolYear = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const rs = await shoolYearService.updateSchoolYear(Number(id), req.body);
    return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
};

export const deleteSchoolYear = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const rs = await shoolYearService.deleteSchoolYear(Number(id));
    return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
};

