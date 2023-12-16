import { BadRequestError, ErrorInterface } from "../utils/error";
import db from "../config/database.config";
import { failed, success } from "../utils/response";
import { Op } from "sequelize";
import { ElectricityAndWater } from "../models/electricityandwater";
import { Receipt } from "../models/receipt";
import { SchoolYear } from "../models/schoolyear";
import { Room } from "../models/room";
import { Building } from "../models/building";
import { RoomStudent } from "../models/roomstudent";
import readXlsxFile from "read-excel-file/node";

interface FilterReceipt {
    month?: number;
    schoolyearId?: number;
    paymentStatus?: any;
    search?: string;
}
interface ReceiptData {
    id: number;
    totalBill: number
}
interface MonthEntry {
    month: number;
    receipt: ReceiptData[];
    total: number;
}
const electricityAndWaterRepository = db.getRepository(ElectricityAndWater);
const receiptRepository = db.getRepository(Receipt);
const roomStudentRepository = db.getRepository(RoomStudent);
const roomRepository = db.getRepository(Room);
const schoolYearRepository = db.getRepository(SchoolYear);

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

export const statistical = async (schoolyearId: number) => {

    const results = await electricityAndWaterRepository.findAll({
        where: {
            schoolyearId: { [Op.eq]: schoolyearId }
        },
        include: [
            {
                model: Receipt
            },
            {
                model: SchoolYear
            }
        ],

    });
    if (results && results.length > 0) {
        const groupedData: MonthEntry[] = results.reduce((acc: MonthEntry[], item) => {
            const month = item.month;
            let monthEntry = acc.find(entry => entry.month === month);
            if (!monthEntry) {
                monthEntry = { month, receipt: [], total: 0 };
                acc.push(monthEntry);
            }

            monthEntry.receipt.push({
                id: item.receipt.id,
                totalBill: item.receipt.totalBill
            });
            monthEntry.total += item.receipt.totalBill;
            return acc;
        }, []);
        const totalAmountReceived = groupedData.reduce((total, monthEntry) => total + monthEntry.total, 0);

        return {
            groupedData,
            totalAmountReceived
        };
    }
    return BadRequestError("Not found!");
};

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
        order: [['id', 'DESC']]
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
            },
            {
                model: SchoolYear
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
            },
            {
                model: SchoolYear
            }
        ]
    } else if (
        !filter?.paymentStatus && search !== undefined
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
            },
            {
                model: SchoolYear
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
            },
            {
                model: SchoolYear
            }
        ]
    }

    const totalReceiptFee = await electricityAndWaterRepository.findAll({
        include: [
            {
                model: Receipt
            }, {
                model: SchoolYear
            }
        ]
    });

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


export const getOne = async (id: number) => {
    const result = await electricityAndWaterRepository.findOne({
        where: { id: id },
        include: {
            model: Receipt
        }
    });
    return result ? result : BadRequestError("Device not found!");
}

export const updateOne = async (id: number, data: any) => {
    const check = await receiptRepository.findByPk(id);
    if (!check) return BadRequestError("Device not found!");
    const result = await receiptRepository.update(data, { where: { id } })
    return (result[0] > 0) ? success() : failed();
}


export const getRoomReceipt = async (user: any, limit: number, page: number) => {
    const result = await roomStudentRepository.findOne(
        {
            where:
                { studentId: user.user_id }
        }
    );
    if (result) {
        const offset = ((page ? page : 1) - 1) * limit;
        const { count, rows } = await electricityAndWaterRepository.findAndCountAll({
            where: {
                roomId: result.roomId
            },
            include: [
                {
                    model: Receipt
                },
                {
                    model: SchoolYear
                }
            ],
            order: [
                ['id', 'DESC']
            ],
            offset: offset,
            limit: limit
        });
        return rows ? rows : BadRequestError("Not found");
    }
    return BadRequestError("Not found");
}

export const uploadFile = async (file: any) => {
    if (!file) {
        return BadRequestError("Please upload an excel file!");
    }

    try {
        const rows: any[] = await readXlsxFile(file.path);

        const tutorials = rows.slice(1).map(row => {
            return {
                areaCode: row[0],
                roomCode: row[1],
                oldElectricityIndicator: row[2],
                newElectricityIndicator: row[3],
                oldWaterIndicator: row[4],
                newWaterIndicator: row[5],
                month: row[6],
                year: row[7],
                semester: row[8]
            };
        });

        const result = await Promise.all(tutorials.map(async (e) => {
            const schoolyear = await SchoolYear.findOne({
                where: {
                    [Op.and]: [{ year: e.year }, { semester: e.semester }]
                }
            });

            let schoolyearId = schoolyear?.id;
            const room = await roomRepository.findOne({
                where: {
                    roomCode: e.roomCode
                },
                include: {
                    model: Building,
                    where: {
                        areaCode: e.areaCode
                    }
                }
            });

            let roomId = room?.id;
            let priceElectricity: number = 0;
            let priceWater: number = 0;



            const electric: number = e.newElectricityIndicator - e.oldElectricityIndicator;
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

            const water: number = e.newWaterIndicator - e.oldWaterIndicator;
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
                month: e.month,
                oldElectricityIndicator: e.oldElectricityIndicator,
                newElectricityIndicator: e.newElectricityIndicator,
                oldWaterIndicator: e.oldWaterIndicator,
                newWaterIndicator: e.newWaterIndicator,
                roomId: roomId,
                schoolyearId: schoolyearId,
                electricityPrice: priceElectricity,
                waterPrice: priceWater,
            });

            if (res?.id > 0) {
                const totalPrice: number = res.electricityPrice + res.waterPrice;
                await receiptRepository.create({
                    ElectricityAndWaterId: res.id,
                    totalBill: totalPrice,
                    totalWaterBill: res.waterPrice,
                    totalElectricityBill: res.electricityPrice
                });
            }

            return 1;
        }));

        return result.every(r => r === 1) ? success() : failed();
    } catch (error) {
        console.error('Error reading Excel file:', error);
        throw error;
    }
};

