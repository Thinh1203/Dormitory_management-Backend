import { BadRequestError, ErrorInterface } from "../utils/error";
import db from "../config/database.config";
import { failed, success } from "../utils/response";
import { Op } from "sequelize";
import { CheckOut } from "../models/checkout";
import { Student } from "../models/student";
import { Room } from "../models/room";
import { RoomStudent } from "../models/roomstudent";
import { sendMail } from "../middlewares/sendmail";


const checkOutRepository = db.getRepository(CheckOut);
const roomRepository = db.getRepository(Room);
const studentInRoomRepository = db.getRepository(RoomStudent);
const studentRepository = db.getRepository(Student);

export const addNew = async (user: any) => {
    return await checkOutRepository.create({ studentId: user.user_id });
}

export const getOne = async (user: any) => {
    const result = await checkOutRepository.findOne({ where: { studentId: user.user_id } });

    return result ? result : BadRequestError("Not found!");
}

export const getAllFormCheckOut = async (limit: number, page: number, filter: any | null = null, search: string | undefined = undefined) => {
    const offset = ((page ? page : 1) - 1) * limit;

    const whereConditions: { [key: string]: any } = {};

    if (filter === 'true' || filter === 'false') {
        whereConditions.status = filter === 'true';
    }
    const queryOptions: any = {
        where: whereConditions,
        offset,
        limit,
        include:
        {
            model: Student,
            where: search && {
                [Op.or]: {
                    fullName: { [Op.substring]: search },
                    mssv: { [Op.substring]: search },
                },
            },
        }
    };

    const { count, rows } = await checkOutRepository.findAndCountAll(queryOptions);
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


export const updateOne = async (id: number, status: any) => {
    const check = await checkOutRepository.findByPk(id);
    if (!check) return BadRequestError('Not found!');
    const roomStudent = await studentInRoomRepository.findOne({ where: { studentId: check.studentId } });
    const room = await roomRepository.findOne({ where: { id: roomStudent?.roomId } });
    const wereThereIncrement = Number(room?.wereThere) - 1;
    const emptyWereThere = Number(room?.actualCapacity) - wereThereIncrement;
    const updateRoom = await roomRepository.update({ wereThere: wereThereIncrement, empty: emptyWereThere }, { where: { id: room?.id } });

    const deleleStudent = await studentInRoomRepository.destroy({ where: { studentId: check.studentId } });
    const result = await checkOutRepository.update({ status }, { where: { id } });
    const student = await studentRepository.findOne({ where: { id: check.studentId } });
    const subject = `Đơn đăng ký phòng trả phòng`;
    let html = `
        <h3>Đơn đăng ký trả phòng của bạn đã được duyệt.</h3>`;
    sendMail(student?.email, subject, html);

    return (result) ? success() : failed();
}