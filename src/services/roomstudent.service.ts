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
