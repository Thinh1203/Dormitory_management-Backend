import { NextFunction, Request, Response } from "express";
import * as ruleService from "../services/rule.service";
import { BadRequestError, isError } from "../utils/error";
import err from "../middlewares/error";

export const addStudent = async (req: Request, res: Response, next: NextFunction) => {
    const { id, contentViolation, discipline } = req.body;
    const rs = await ruleService.addStudent(Number(id), contentViolation, discipline );
    return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
};

export const getOne = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const rs = await ruleService.getOne(Number(id));
    return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
};

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
    const {
      limit = 6,
      page = 1,
      search
    } = req.query;
    
    const rs = await ruleService.getAll(Number(limit), Number(page), search && String(search));
    return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
  }



