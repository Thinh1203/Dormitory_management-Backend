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
    const { limit = 8,
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
                paymentStatus: paymentStatus ? paymentStatus : undefined,
            },
            search && String(search)
        );
        return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
    }

};

export const updateOne = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const rs = await receiptService.updateOne(Number(id), req.body);
    return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
};

export const getRoomReceipt = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const { limit = 2, page = 1 } = req.query;
    const rs = await receiptService.getRoomReceipt(user, Number(limit), Number(page));
    return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
};


export const getOne = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const rs = await receiptService.getOne(Number(id));
    return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
};

export const statistical = async (req: Request, res: Response, next: NextFunction) => {
    const {
        schoolyearId
    } = req.query;

    const rs = await receiptService.statistical(Number(schoolyearId));

    return isError(rs) ? res.status(400).json("Not found") : res.status(200).json(rs);

};
