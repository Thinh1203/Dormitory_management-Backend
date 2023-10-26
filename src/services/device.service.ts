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

export const getAll = async (): Promise<ErrorInterface | ListOfDevice[]> => {
    const result = await deviceRepository.findAll();
    return result ? result : BadRequestError("Device not found!");
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

