import { BadRequestError, ErrorInterface } from "../utils/error";
import db from "../config/database.config";
import { failed, success } from "../utils/response";
import { Op } from "sequelize";
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

export const addNewStudent = async (studentId: number, roomId: number, paymentStatus: boolean, time: number) => {
    const check = await roomStudentRepository.findOne({ where: { studentId } });
    if (check) return BadRequestError("Students have rooms!");
    const room = await roomRepository.findOne({ where: { id: roomId } });
    const roomFee = time * Number(room?.price);
    const newData = await roomRepository.create({
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