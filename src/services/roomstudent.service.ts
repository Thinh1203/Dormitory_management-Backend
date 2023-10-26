import { BadRequestError, ErrorInterface } from "../utils/error";
import db from "../config/database.config";
import { failed, success } from "../utils/response";
import { Op } from "sequelize";
import { RoomStudent } from "../models/roomstudent";
import { Student } from "../models/student";
import { Room } from "../models/room";

const roomStudentRepository = db.getRepository(RoomStudent);

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
    const result = await roomStudentRepository.findOne({ where: { studentId: user.user_id } });
    return result ? result : BadRequestError("Not found!");
}
