import { BadRequestError, ErrorInterface } from "../utils/error";
import db from "../config/database.config";
import { failed, success } from "../utils/response";
import { Model, Op, where } from "sequelize";

import { RepairRequestForm } from "../models/repairrequestform";
import { RequestList } from "../models/requestlist";
import { ListOfDevice } from "../models/listofdevices";
import { Student } from "../models/student";
import { RoomStudent } from "../models/roomstudent";
import { Room } from "../models/room";
import { Building } from "../models/building";

const repairRequestFormRepository = db.getRepository(RepairRequestForm);
const listOfDeviceRepository = db.getRepository(RequestList);
const roomStudentRepository = db.getRepository(RoomStudent);

export const addForm = async (student: any, data: any) => {
    if (!student) return BadRequestError("Missing required parameters");

    const studentInRoom = await roomStudentRepository.findOne({ where: { studentId: student?.user_id } });

    const repairForm = await repairRequestFormRepository.create({
        studentId: student?.user_id,
        roomId: studentInRoom?.roomId
    });
    await Promise.all(data.map(async (element: any) => {
        await listOfDeviceRepository.create({
            repairrequestformId: repairForm?.id,
            listofdeviceId: element
        });
    }));

    return repairForm ? repairForm : BadRequestError("error");
}


export const getAll = async (limit: number, page: number, filter: any | null = null) => {
    const offset = ((page ? page : 1) - 1) * limit;

    const whereConditions: { [key: string]: any } = {};

    if (filter === 'true' || filter === 'false') {
        whereConditions.status = filter === 'true';
    }
    const queryOptions: any = {
        where: whereConditions,
        offset,
        limit,
        include: [
            {
                model: Room,
                include: [
                    {
                        model: Building
                    }
                ]
            },
            {
                model: Student,
            },
        ],
        order: [
            [{ model: Room, as: 'room' }, { model: Building, as: 'building' }, 'areaCode', 'ASC'],
            [{ model: Room, as: 'room' }, 'roomCode', 'ASC'],
        ],
    };

    const { count, rows } = await repairRequestFormRepository.findAndCountAll(queryOptions);
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
        : BadRequestError("Not found!");
};


export const getUserRepair = async (student: any) => {
    const result = await repairRequestFormRepository.findOne({
        where: {
            [Op.and]: [
                { studentId: student?.user_id },
                { status: { [Op.not]: true } }
            ]
        }
    });

    return result ? result : BadRequestError("Not found!");
}

export const getOne = async (id: number) => {

    const result = await listOfDeviceRepository.findAll({
        where: { repairrequestformId: id },
        include: [
            {
                model: RepairRequestForm,
            },
            {
                model: ListOfDevice,
            }
        ]
    });
    const groupedResult = result.reduce((acc: any, item: any) => {
        const repairrequestformId = item.repairrequestformId;

        if (!acc[repairrequestformId]) {
            acc[repairrequestformId] = {
                repairrequestformId,
                repairrequestform: item.repairrequestform,
                listofdevices: [],
            };
        }

        acc[repairrequestformId].listofdevices.push(item.listofdevice);
        return acc;
    }, {});


    const groupedArray = Object.values(groupedResult);

    return groupedArray ? groupedArray : BadRequestError("Not found!");
}

export const updateOne = async (id: number, status: any) => {
    const check = await repairRequestFormRepository.findByPk(id);
    if (!check) return BadRequestError('Not found!');
    const result = await repairRequestFormRepository.update({ status }, { where: { id } });
    return (result) ? success() : failed();
}

