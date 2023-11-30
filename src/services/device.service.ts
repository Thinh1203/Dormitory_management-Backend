import { BadRequestError, ErrorInterface } from "../utils/error";
import db from "../config/database.config";
import { failed, success } from "../utils/response";
import { Op } from "sequelize";
import { ListOfDevice } from "../models/listofdevices";

interface DeviceDataType {
    repairCode: string;
    repairDetail: string;
}

const deviceRepository = db.getRepository(ListOfDevice);

export const addDevice = async ({ repairCode, repairDetail }: DeviceDataType): Promise<ErrorInterface | ListOfDevice> => {
    return await deviceRepository.create({ repairCode, repairDetail });
}

export const getAllList = async () => {
    const result = await deviceRepository.findAll();
    return result ? result : BadRequestError("Device not found!");
};

export const getAll = async (limit: number, page: number) => {
    const offset = ((page ? page : 1) - 1) * limit;
    const { count, rows } = await deviceRepository.findAndCountAll({
        offset: offset,
        limit: limit,
    });
    const last_page = Math.ceil(count / limit);
    const prev_page = page - 1 < 1 ? null : page - 1;
    const next_page = page + 1 > last_page ? null : page + 1;
    return count > 0 ? {
        current_page: page,
        prev_page,
        next_page,
        last_page,
        data_per_page: limit,
        total: count,
        data: rows
    } : BadRequestError("Devices not found!");

}

export const getOne = async (id: number): Promise<ErrorInterface | ListOfDevice> => {
    const result = await deviceRepository.findByPk(id);
    return result ? result : BadRequestError("Device not found!");
}

export const updateOne = async (id: number, data: any) => {
    const check = await deviceRepository.findByPk(id);
    if (!check) return BadRequestError("Device not found!");
    const result = await deviceRepository.update(data, { where: { id } })
    return (result[0] > 0) ? success() : failed();
}

export const deleteOne = async (id: number) => {
    const check = await deviceRepository.findByPk(id);
    if (!check) return BadRequestError("Device not found!");
    const result = await deviceRepository.destroy({ where: { id } })
    return result ? success() : failed();
}

