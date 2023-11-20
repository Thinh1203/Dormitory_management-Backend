import { NextFunction, Request, Response } from "express";
import * as buildingService from "../services/building.service"
import { BadRequestError, isError } from "../utils/error";
import err from "../middlewares/error";

export const addBuilding = async (req: Request, res: Response, next: NextFunction) => {
    const { area, areaCode } = req.body;
    const rs = await buildingService.addBuilding({ area, areaCode });
    console.log(rs);
    
    return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
};

export const getAllArea = async (req: Request, res: Response, next: NextFunction) => {
    const rs = await buildingService.getAllArea();
    return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
};

export const getAreaCode = async (req: Request, res: Response, next: NextFunction) => {
    const rs = await buildingService.getAreaCode();
    return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
};

export const getAllBuilding = async (req: Request, res: Response, next: NextFunction) => {
    const { area } = req.query;    
    if (area !== undefined) {
        const rs = await buildingService.getAllBuilding(String(area));
        return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
    } else {
        const rs = await buildingService.getAllBuilding(null);
        return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
    }
};
export const getOneBuilding = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const rs = await buildingService.getOneBuilding(Number(id));
    return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
};
export const updateBuilding = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const rs = await buildingService.updateBuilding(Number(id), req.body);  
    return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
};
export const deleteBuilding = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const rs = await buildingService.deleteBuilding(Number(id));
    return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
};