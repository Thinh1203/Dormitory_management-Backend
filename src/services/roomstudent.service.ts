import { BadRequestError, ErrorInterface } from "../utils/error";
import db from "../config/database.config";
import { failed, success } from "../utils/response";
import { Op, literal } from "sequelize";
import { RoomStudent } from "../models/roomstudent";
import { Student } from "../models/student";
import { Room } from "../models/room";
import { Building } from "../models/building";
import { RegistrationForm } from "../models/registrationform";

const roomStudentRepository = db.getRepository(RoomStudent);
const roomRepository = db.getRepository(Room);
const registrationRepository = db.getRepository(RegistrationForm);

export const getOne = async (id: number) => {
    const roomStudents = await roomStudentRepository.findAll({
        where: { roomId: id },
        include: [
            {
                model: Student, // Bao gồm thông tin của sinh viên
                as: 'student',
            },
        ],
    });

    if (roomStudents && roomStudents.length > 0) {
        return (roomStudents);
    } else {
        return BadRequestError("RoomStudents not found!");
    }
}

export const checkRoom = async (user: any) => {
    const result = await roomStudentRepository.findOne({
        where: { studentId: user.user_id },
        include: [
            {
                model: Room,
                include: [
                    {
                        model: Building
                    }
                ]
            }
        ]
    });
    if (!result) return BadRequestError("Not found!");
    const registrationForm = await registrationRepository.findOne({
        where: {
            [Op.and]: [{ roomId: result?.room?.id }, { studentId: result?.studentId }]
        }
    })

    return {
        room: result,
        registrationForm: registrationForm
    }
}

export const updateOne = async (id: number, paymentStatus: boolean) => {
    const result = await roomStudentRepository.findByPk(id);
    if (!result) return BadRequestError("Room not found!");
    const update = await roomStudentRepository.update({ paymentStatus }, { where: { id } })
    return update ? success() : failed();
}


export const deleteOne = async (id: number) => {
    const checkRoom = await roomStudentRepository.findOne({
        where: { id: id }
    });
    if (!checkRoom) return BadRequestError("Room not found!");
    const room = await roomRepository.findOne({
        where: { id: checkRoom?.roomId }
    });
    const wereThere = Number(room?.wereThere) - 1;
    const empty = Number(room?.empty) + 1;
    await roomRepository.update({ wereThere, empty }, { where: { id: room?.id } });
    const result = await roomStudentRepository.destroy({ where: { id: id } });
    return (result) ? success() : failed();
}

export const addNewStudent = async (studentId: number, roomId: number, paymentStatus: boolean, time: number, schoolYearId: number) => {
    const check = await roomStudentRepository.findOne({ where: { studentId } });
    if (check) return BadRequestError("Students have rooms!");
    const room = await roomRepository.findOne({ where: { id: roomId } });

    const roomFee = time * Number(room?.price);
    await registrationRepository.create({
        registrationTime: time,
        wish: null,
        studentId: studentId,
        roomId: roomId,
        schoolyearId: schoolYearId,
    });
    const newData = await roomStudentRepository.create({
        roomFee: roomFee,
        paymentStatus,
        studentId,
        roomId
    });
    if (newData) {
        const wereThereIncrement = Number(room?.wereThere) + 1;
        const emptyWereThere = Number(room?.actualCapacity) - wereThereIncrement;
        const updateRoom = await roomRepository.update({ wereThere: wereThereIncrement, empty: emptyWereThere }, { where: { id: roomId } });
        return updateRoom[0] > 0 ? success() : failed();
    }
    return failed();
};

export const getAll = async (
    limit: number,
    page: number,
    filter: any | null = null,
    search: string | undefined = undefined
) => {
    const offset = (page - 1) * limit;

    const whereConditions: { [key: string]: any } = {};

    if (filter === 'true' || filter === 'false') {
        whereConditions.paymentStatus = filter === 'true';
    }

    const queryOptions: any = {
        where: whereConditions,
        offset,
        limit,
        include: [
            {
                model: Room,
                include: {
                    model: Building,
                },
            },
            {
                model: Student,
                where: search && {
                    [Op.or]: {
                        fullName: { [Op.substring]: search },
                        mssv: { [Op.substring]: search },
                    },
                },
            },
        ],
    };
    const totalFeeRoom = await roomStudentRepository.findAll();

    const { count, rows } = await roomStudentRepository.findAndCountAll(queryOptions);

    const totalRoomFee = totalFeeRoom.reduce((sum, e) => {
        return sum + e.roomFee;
    }, 0);

    const totalPaidRoomFee = totalFeeRoom.reduce((sum, e) => {
        if (e.paymentStatus) {
            return sum + e.roomFee;
        } else {
            return sum;
        }
    }, 0);


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
            totalRoomFee,
            totalPaidRoomFee
        }
        : {
            totalRoomFee,
            totalPaidRoomFee
        };
};

