import { BadRequestError, ErrorInterface } from "../utils/error";
import db from "../config/database.config";
import { failed, success } from "../utils/response";
import { Model, Op, where } from "sequelize";
import { RegistrationForm } from "../models/registrationform";
import { Student } from "../models/student";
import { Room } from "../models/room";
import { SchoolYear } from "../models/schoolyear";
import { RoomStudent } from "../models/roomstudent";

const registrationFormRepository = db.getRepository(RegistrationForm);
const studentRepository = db.getRepository(Student);
const roomRepository = db.getRepository(Room);
const schoolYearRepository = db.getRepository(SchoolYear);
const studentInRoomRepository = db.getRepository(RoomStudent);

export const addForm = async (registrationTime: number, wish: string | null = null, student: any, roomId: number, schoolyearId: number) => {
    if (!registrationTime || !roomId || !schoolyearId) return BadRequestError("Missing required parameters");
    return await registrationFormRepository.create({
        registrationTime: registrationTime,
        wish: wish || null,
        studentId: student.user_id,
        roomId: roomId,
        schoolyearId: schoolyearId,
    });
}

export const getOne = async (id: number) => {
    const registerForm = await registrationFormRepository.findByPk(id);
    if (!registerForm) return BadRequestError("Form not found!");
    const student = await studentRepository.findOne({ where: { id: registerForm.studentId } });
    const room = await roomRepository.findOne({ where: { id: registerForm.roomId } });
    const schoolyear = await schoolYearRepository.findOne({ where: { id: registerForm.schoolyearId } });

    return {
        registrationForm: registerForm,
        student,
        room,
        schoolyear
    }
}

export const getAll = async (limit: number, page: number, filter: number | null = null) => {
    const offset = ((page ? page : 1) - 1) * limit;

    const whereConditions: {
        [key: string]: any;
    } = {};

    if (Number(filter) > 0) {
        whereConditions.wish = { [Op.ne]: null, [Op.ne]: '' };
    }
    const filteredWhereConditions: {
        [key: string]: any;
    } = {};

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

    const { count, rows } = await registrationFormRepository.findAndCountAll(queryOptions);
    const last_page = Math.ceil(count / limit);
    const prev_page = page - 1 < 1 ? null : page - 1;
    const next_page = page + 1 > last_page ? null : page + 1;
    return (count > 0) ? {
        current_page: page,
        prev_page,
        next_page,
        last_page,
        data_per_page: limit,
        total: count,
        data: rows
    } : BadRequestError("Form not found!");
}

export const deleteOne = async (id: number) => {
    const check = await registrationFormRepository.findByPk(id);
    if (!check) return BadRequestError("Form not found!");
    const result = await registrationFormRepository.destroy({ where: { id } })
    return result ? success() : failed();
}

export const updateOne = async (id: number, registrationStatus: number) => {
   
    
    const form = await registrationFormRepository.findByPk(id);
    if (!form) return BadRequestError("Form not found!");
    if (registrationStatus === 1) {
        const room = await roomRepository.findOne({ where: { id: form.roomId } });
        const wereThereIncrement = Number(room?.wereThere) + 1;
        const emptyWereThere = Number(room?.actualCapacity) - wereThereIncrement;
        const updateRoom = await roomRepository.update({ wereThere: wereThereIncrement, empty: emptyWereThere }, { where: { id: room?.id } });

        const student = await studentRepository.findOne({ where: { id: form.studentId } })
        const roomFee = Number(form?.registrationTime) * Number(room?.price);

        const addStudentInRoom = await studentInRoomRepository.create({ roomFee, studentId: student?.id, roomId: room?.id });
        const result = await registrationFormRepository.update({ registrationStatus }, { where: { id } });
        return result[0] > 0 ? success() : failed();
    }
    const result = await registrationFormRepository.update({ registrationStatus }, { where: { id } });
    return result[0] > 0 ? success() : failed();
}