import { BadRequestError, ErrorInterface } from "../utils/error";
import db from "../config/database.config";
import { failed, success } from "../utils/response";
import { Op } from "sequelize";
import { Building } from "../models/building";
import { Room } from "../models/room";

interface BuildingType {
    area: string;
    areaCode: string
}

const buildingRepository = db.getRepository(Building);
const roomRepository = db.getRepository(Room);

export const addBuilding = async ({ area, areaCode }: BuildingType): Promise<ErrorInterface | Building> => {
    const buildingExist = await buildingRepository.findOne({
        where: {
            [Op.and]: [
                { area: area },
                { areaCode: areaCode }
            ]
        }
    });
    if (buildingExist) return BadRequestError("Building already exists!");
    return await buildingRepository.create({ area, areaCode });
}

export const getAllArea = async () => {
    const result = await buildingRepository.findAll({ group: ['area'] });
    return result;
}

export const getAreaCode = async () => {
    const result = await buildingRepository.findAll();
    return result;
}

export const getAllBuilding = async (area: string | null = null) => {
    const list = await buildingRepository.findAll({
        include: {
            model: Room,
        },
        where: {
            area: area || 'A',
        },
    });

    const result: { list: any[], roomCountByArea: { [areaCode: string]: number } } = {
        list: [],
        roomCountByArea: {},
    };

    list.forEach((area) => {
        const areaCode: string = area.areaCode;
        let emptyRoomCount: number = 0;

        area.room.forEach((room: Room) => {
            if (room.empty !== 0) {
                emptyRoomCount++;
            }
        });

        result.list.push({
            id: area.id,
            area: area.area,
            areaCode: areaCode,
            roomCountByArea: emptyRoomCount,
            room: area.room.map((e) => {
                return {
                    id: e.id,
                    roomCode: e.roomCode,
                    roomType: e.roomType,
                    roomMale: e.roomMale,
                    capacity: e.capacity,
                    actualCapacity: e.capacity,
                    kitchen: e.kitchen,
                    price: e.price,
                    status: e.status,
                    wereThere: e.wereThere,
                    empty: e.empty
                }
            })
        });

        result.roomCountByArea[areaCode] = emptyRoomCount;
    });

    return result;
}


export const getOneBuilding = async (id: number): Promise<ErrorInterface | Building> => {
    const result = await buildingRepository.findByPk(id);
    return result ? result : BadRequestError("Building not found!");;
}

export const updateBuilding = async (id: number, data: any) => {
    const buildingExist = await buildingRepository.findByPk();
    if (buildingExist) return BadRequestError("Building not found!");
    const check = await buildingRepository.findOne({
        where: {
            [Op.and]: [
                { area: data.area },
                { areaCode: data.areaCode }
            ]
        }
    });
    if (check) return BadRequestError("Building code already exists!");
    const result = await buildingRepository.update(data, { where: { id } });
    return (result[0] > 0) ? success() : failed();

}

export const deleteBuilding = async (id: number) => {
    const buildingExist = await buildingRepository.findByPk(id);
    if (!buildingExist) return BadRequestError("Building not found!");
    await roomRepository.destroy({ where: { buildingId: id } });
    const result = await buildingRepository.destroy({ where: { id } });
    return (result > 0) ? success() : failed();
}
