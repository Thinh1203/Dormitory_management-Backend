import { BadRequestError, ErrorInterface } from "../utils/error";
import db from "../config/database.config";
import { failed, success } from "../utils/response";
import { Op } from "sequelize";
import { Building } from "../models/building";

interface BuildingType {
    area: string;
    areaCode: string
}

const buildingRepository = db.getRepository(Building);

export const addBuilding = async ({ area, areaCode }: BuildingType): Promise<ErrorInterface | Building> => {
    const buildingExist = await buildingRepository.findOne({ where: { area } });
    if (buildingExist) return BadRequestError("Building already exists!");
    return await buildingRepository.create({ area, areaCode });
}

export const getAllBuilding = async () => {
    return await buildingRepository.findAll();
}

export const getOneBuilding = async (id: number): Promise<ErrorInterface | Building> => {
    const result = await buildingRepository.findByPk();
    return result ? result : BadRequestError("Building not found!");;
}

export const updateBuilding = async (id: number, { area, areaCode }: BuildingType) => {
    const buildingExist = await buildingRepository.findByPk();
    if (buildingExist) return BadRequestError("Building not found!");
    const result = await buildingRepository.update({ area, areaCode }, { where: { id } });
    return (result[0] > 0) ? success() : failed();

}

export const deleteBuilding = async (id: number) => {
    const buildingExist = await buildingRepository.findByPk();
    if (buildingExist) return BadRequestError("Building not found!");
    const result = await buildingRepository.destroy({ where: { id } });
    return (result > 0) ? success() : failed();
}
