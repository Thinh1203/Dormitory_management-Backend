import { BadRequestError, ErrorInterface } from "../utils/error";
import db from "../config/database.config";
import { failed, success } from "../utils/response";
import { Op } from "sequelize";
import { Room } from "../models/room";
import { Building } from "../models/building";

interface RoomDataType {
    roomCode: string;
    roomType: string;
    roomMale: string;
    capacity: number;
    actualCapacity: number;
    kitchen: boolean;
    price: number;
    buildingId: number;
}

interface RoomDataTypeExtend extends RoomDataType {
    wereThere: number;
    empty: number;
    status: boolean;
}
interface FilterRoom {
    areaCode?: string;
    roomMale?: string;
    capacity?: number;
    empty?: number;
    kitchen?: boolean;
}

const roomRepository = db.getRepository(Room);

export const addRoom = async ({ roomCode, roomType, roomMale, capacity, actualCapacity, kitchen, price, buildingId }: RoomDataType): Promise<ErrorInterface | Room> => {
    const checkRoom = await roomRepository.findOne({
        where: {
            [Op.and]: [{ roomCode }, { buildingId }]
        }
    });
    if (checkRoom) return BadRequestError("Room already exists!");
    const empty = actualCapacity;
    return await roomRepository.create({ roomCode, roomType, roomMale, capacity, actualCapacity, kitchen, price, buildingId, empty });
}

export const updateRoom = async (id: number, data: any) => {
    const checkRoom = await roomRepository.findByPk(id);
    if (!checkRoom) return BadRequestError("Room not found!");
    const result = await roomRepository.update(data, { where: { id: id } });
    return (result) ? success() : failed();
}

export const deleteRoom = async (id: number) => {
    const checkRoom = await roomRepository.findByPk(id);
    if (!checkRoom) return BadRequestError("Room not found!");
    const result = await roomRepository.destroy({ where: { id: id } });
    return (result) ? success() : failed();
}

export const getOne = async (id: number): Promise<ErrorInterface | Room> => {
    const result = await roomRepository.findByPk(id, {
        include: {
            model: Building
        }
    });
    return (result) ? result : BadRequestError("Room not found!");
}

export const getAll = async (limit: number, page: number, filter: FilterRoom | null = null, search: string | undefined = undefined) => {
    const offset = ((page ? page : 1) - 1) * limit;
    
    const whereConditions: {
        [key: string]: any;
    } = {
        roomMale: filter?.roomMale ? { [Op.substring]: filter.roomMale } : undefined,
        capacity: filter?.capacity ? { [Op.eq]: filter.capacity } : undefined,
        empty: filter?.empty ? { [Op.gt]: 0 } : undefined,
        kitchen: filter?.kitchen ? { [Op.is]: true } : undefined,
        roomCode: search !== undefined && search !== "" && search !== null ? { [Op.substring]: search } : undefined,
    };
    
    const filteredWhereConditions: {
        [key: string]: any;
    } = {};
    
    for (const key in whereConditions) {
        if (whereConditions[key] !== undefined) {
            filteredWhereConditions[key] = whereConditions[key];
        }
    }
    
    const queryOptions: any = {
        attributes: {
            exclude: ["buildingId"]
        },
        where: filteredWhereConditions,
        offset: offset,
        limit: limit,
    };
    
    if (filter?.areaCode) {
        queryOptions.include = [
            {
                model: Building,
                where: {
                    areaCode: { [Op.startsWith]: filter.areaCode }
                }
            }
        ];
    } else {
        queryOptions.include = {
            model: Building,
        };
    }
    
    const { count, rows } = await roomRepository.findAndCountAll(queryOptions);
    
    const last_page = Math.ceil(count / limit);
    const prev_page = page - 1 < 1 ? null : page - 1;
    const next_page = page + 1 > last_page ? null : page + 1;
    
    return count > 0
        ? {
            current_page: page,
            prev_page,
            next_page,
            last_page,
            data_per_page: limit,
            total: count,
            ...(search !== undefined && search !== "" && search !== null && { search_query: search }),
            data: rows.map((e) => {
                return {
                    id: e.id,
                    roomCode: e.roomCode,
                    roomType: e.roomType,
                    roomMale: e.roomMale,
                    capacity: e.capacity,
                    actualCapacity: e.capacity,
                    kitchen: e.kitchen,
                    price: e.price,
                    wereThere: e.wereThere,
                    empty: e.empty,
                    building: e.building
                };
            }),
        }
        
        : BadRequestError("Room not found!");
};
