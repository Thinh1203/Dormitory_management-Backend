import { BadRequestError, ErrorInterface } from "../utils/error";
import db from "../config/database.config";
import { failed, success } from "../utils/response";
import { Op } from "sequelize";
import { ElectricityAndWater } from "../models/electricityandwater";
import { Receipt } from "../models/receipt";
import { SchoolYear } from "../models/schoolyear";
import { Room } from "../models/room";
import { Building } from "../models/building";

interface FilterReceipt {
    month?: number;
    schoolyearId?: number;
    paymentStatus?: any;
    search?: string;
}

const electricityAndWaterRepository = db.getRepository(ElectricityAndWater);
const receiptRepository = db.getRepository(Receipt);

export const addNewReceipt = async (
    month: number,
    oldElectricityIndicator: number,
    newElectricityIndicator: number,
    oldWaterIndicator: number,
    newWaterIndicator: number,
    roomId: number,
    schoolyearId: number
) => {
    let priceElectricity: number = 0;
    let priceWater: number = 0;

    const electric: number = newElectricityIndicator - oldElectricityIndicator;
    if (electric > 0 && electric < 51) {
        priceElectricity = Math.floor(electric * 1728 / 1000) * 1000;
    }
    if (electric > 50 && electric < 101) {
        priceElectricity = Math.floor(electric * 1786 / 1000) * 1000;
    }
    if (electric > 100 && electric < 201) {
        priceElectricity = Math.floor(electric * 2074 / 1000) * 1000;
    }
    if (electric > 200 && electric < 301) {
        priceElectricity = Math.floor(electric * 2612 / 1000) * 1000;
    }
    if (electric > 300 && electric < 401) {
        priceElectricity = Math.floor(electric * 2919 / 1000) * 1000;
    }
    if (electric > 400) {
        priceElectricity = Math.floor(electric * 3015 / 1000) * 1000;
    }

    const water: number = newWaterIndicator - oldWaterIndicator;
    if (water > 0 && water < 11) {
        priceWater = Math.floor(water * 5973 / 1000) * 1000;
    }
    if (water > 10 && water < 21) {
        priceWater = Math.floor(water * 7052 / 1000) * 1000;
    }
    if (water > 20 && water < 31) {
        priceWater = Math.floor(water * 8669 / 1000) * 1000;
    }
    if (water > 30) {
        priceWater = Math.floor(water * 15929 / 1000) * 1000;
    }

    const res = await electricityAndWaterRepository.create({
        month,
        oldElectricityIndicator,
        newElectricityIndicator,
        oldWaterIndicator,
        newWaterIndicator,
        roomId,
        schoolyearId,
        electricityPrice: priceElectricity,
        waterPrice: priceWater,
    });

    if (res?.id > 0) {

        const totalPrice: number = res.electricityPrice + res.waterPrice;
        const result = await receiptRepository.create({
            ElectricityAndWaterId: res.id,
            totalBill: totalPrice,
            totalWaterBill: res.waterPrice,
            totalElectricityBill: res.electricityPrice
        });

        return result ? {
            res,
            result
        } : BadRequestError("error");
    }
    return BadRequestError("error");
}

// export const getAllList = async () => {
//     const result = await deviceRepository.findAll();
//     return result ? result : BadRequestError("Device not found!");
// };

export const getAll = async (
    limit: number,
    page: number,
    filter: FilterReceipt | null = null,
    search: string | undefined = undefined
) => {
    const offset = ((page ? page : 1) - 1) * limit;

    const whereConditions: { [key: string]: any } = {
        month: filter?.month ? { [Op.eq]: filter.month } : undefined,
        schoolyearId: filter?.schoolyearId ? { [Op.eq]: filter.schoolyearId } : undefined,
    };

    const filteredWhereConditions: { [key: string]: any } = {};

    for (const key in whereConditions) {
        if (whereConditions[key] !== undefined) {
            filteredWhereConditions[key] = whereConditions[key];
        }
    }

    const queryOptions: any = {
        where: filteredWhereConditions,
        offset: offset,
        limit: limit,
    };

    if ((filter?.paymentStatus === 'true' || filter?.paymentStatus === 'false') && search === undefined) {
        queryOptions.include = [
            {
                model: Receipt,
                where: {
                    paymentStatus: filter?.paymentStatus === 'true'
                }
            }, {
                model: Room,
                include: {
                    model: Building
                }
            }
        ]
    } else if (
        (filter?.paymentStatus === 'true' || filter?.paymentStatus === 'false') && search !== undefined
    ) {
        queryOptions.include = [
            {
                model: Receipt,
                where: {
                    paymentStatus: filter?.paymentStatus === 'true'
                }
            }, {
                model: Room,
                where: {
                    roomCode: { [Op.substring]: search }
                },
                include: {
                    model: Building
                }
            }
        ]
    } else if (
        !filter?.paymentStatus  && search !== undefined
    ) {
        queryOptions.include = [
            {
                model: Receipt,
            }, {
                model: Room,
                where: {
                    roomCode: { [Op.substring]: search }
                },
                include: {
                    model: Building
                }
            }
        ]
    } else {
        queryOptions.include = [
            {
                model: Receipt,
            }, {
                model: Room,
                include: {
                    model: Building
                }
            }
        ]
    }

    const { count, rows } = await electricityAndWaterRepository.findAndCountAll(queryOptions);

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
            data: rows,
        }
        : BadRequestError('Devices not found!');
};


// export const getOne = async (id: number): Promise<ErrorInterface | ListOfDevice> => {
//     const result = await deviceRepository.findByPk(id);
//     return result ? result : BadRequestError("Device not found!");
// }

// export const updateOne = async (id: number, data: any) => {
//     const check = await deviceRepository.findByPk(id);
//     if (!check) return BadRequestError("Device not found!");
//     const result = await deviceRepository.update(data, { where: { id } })
//     return (result[0] > 0) ? success() : failed();
// }

// export const deleteOne = async (id: number) => {
//     const check = await deviceRepository.findByPk(id);
//     if (!check) return BadRequestError("Device not found!");
//     const result = await deviceRepository.destroy({ where: { id } })
//     return result ? success() : failed();
// }

