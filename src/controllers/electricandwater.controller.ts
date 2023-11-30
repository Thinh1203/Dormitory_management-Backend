import { NextFunction, Request, Response } from "express";
import * as receiptService from "../services/electricandwater.service";
import { BadRequestError, isError } from "../utils/error";
import err from "../middlewares/error";


export const addNewReceipt = async (req: Request, res: Response, next: NextFunction) => {
    const { month,
        oldElectricityIndicator,
        newElectricityIndicator,
        oldWaterIndicator,
        newWaterIndicator,
        roomId,
        schoolyearId } = req.body;
    const rs = await receiptService.addNewReceipt(Number(month),
        Number(oldElectricityIndicator),
        Number(newElectricityIndicator),
        Number(oldWaterIndicator),
        Number(newWaterIndicator),
        Number(roomId),
        Number(schoolyearId));
    return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
};


export const getAll = async (req: Request, res: Response, next: NextFunction) => {
    const { limit = 10,
        page = 1,
        month,
        schoolyearId,
        paymentStatus,
        search
    } = req.query;


    if (!month && !schoolyearId && !paymentStatus) {
        const rs = await receiptService.getAll(Number(limit), Number(page), null, search && String(search));
        return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
    } else {  
        const rs = await receiptService.getAll(
            Number(limit),
            Number(page),
            {
                schoolyearId: schoolyearId ? Number(schoolyearId) : undefined,
                month: month ? Number(month) : undefined,
                paymentStatus: paymentStatus ? Boolean(paymentStatus) : undefined,
            },
            search && String(search)
        );
        return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
    }

};