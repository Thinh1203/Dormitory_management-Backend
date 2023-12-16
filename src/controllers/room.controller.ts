import { NextFunction, Request, Response } from "express";
import * as roomService from "../services/room.service"
import { BadRequestError, isError } from "../utils/error";
import err from "../middlewares/error";

export const addRoom = async (req: Request, res: Response, next: NextFunction) => {
    const { roomCode, roomType, roomMale, capacity, actualCapacity, kitchen, price, buildingId } = req.body;
    const rs = await roomService.addRoom({ roomCode, roomType, roomMale, capacity, actualCapacity, kitchen, price, buildingId });
    return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
};

export const updateRoom = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const rs = await roomService.updateRoom(Number(id), req.body);
    return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
};

export const resetAll = async (req: Request, res: Response, next: NextFunction) => {
    const { status } = req.body;
    const rs = await roomService.resetAll(status);
    return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
};

export const deleteRoom = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const rs = await roomService.deleteRoom(Number(id));
    return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
};

export const getList = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.query;

    const rs = await roomService.getList(Number(id));
    return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
};

export const getOne = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const rs = await roomService.getOne(Number(id));
    return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
};

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
    const { limit = 10,
        page = 1,
        areaCode,
        roomMale,
        capacity,
        empty,
        kitchen,
        search,
    } = req.query;


    if (!areaCode && !roomMale && !capacity && !empty && !kitchen) {
        const rs = await roomService.getAll(Number(limit), Number(page), null, search && String(search));
        return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
    } else {
        const rs = await roomService.getAll(
            Number(limit),
            Number(page),
            {
                areaCode: areaCode ? String(areaCode) : undefined,
                roomMale: roomMale ? String(roomMale) : undefined,
                capacity: capacity ? Number(capacity) : undefined,
                empty: empty ? Number(empty) : undefined,
                kitchen: kitchen ? Boolean(kitchen) : undefined,
            },
            search && String(search)
        );
        return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
    }

};

