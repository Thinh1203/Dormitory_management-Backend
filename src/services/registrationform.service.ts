import { BadRequestError, ErrorInterface } from "../utils/error";
import db from "../config/database.config";
import { failed, success } from "../utils/response";
import { Model, Op, where } from "sequelize";
import { RegistrationForm } from "../models/registrationform";
import { Student } from "../models/student";
import { Room } from "../models/room";
import { SchoolYear } from "../models/schoolyear";
import { RoomStudent } from "../models/roomstudent";
import { Building } from "../models/building";
import { sendMail } from "../middlewares/sendmail";

const registrationFormRepository = db.getRepository(RegistrationForm);
const studentRepository = db.getRepository(Student);
const roomRepository = db.getRepository(Room);
const schoolYearRepository = db.getRepository(SchoolYear);
const studentInRoomRepository = db.getRepository(RoomStudent);

export const addForm = async (registrationTime: number, wish: string | null = null, student: any, roomId: number, schoolYearId: number) => {
    if (!registrationTime || !roomId || !schoolYearId) return BadRequestError("Missing required parameters");
    return await registrationFormRepository.create({
        registrationTime: registrationTime,
        wish: wish || null,
        studentId: student.user_id,
        roomId: roomId,
        schoolyearId: schoolYearId,
    });
}

export const getOne = async (id: number) => {
    const registerForm = await registrationFormRepository.findByPk(id);
    if (!registerForm) return BadRequestError("Form not found!");
    const student = await studentRepository.findOne(
        {
            where: { id: registerForm.studentId },
        }
    );
    const room = await roomRepository.findOne(
        {
            where: { id: registerForm.roomId },
            include: {
                model: Building
            }
        }
    );
    const schoolyear = await schoolYearRepository.findOne({ where: { id: registerForm.schoolyearId } });

    return {
        registrationForm: registerForm,
        student,
        room,
        schoolyear
    }
}

// export const getAll = async (limit: number, page: number, filter: number | null = null, search: string | undefined = undefined) => {
//     const offset = ((page ? page : 1) - 1) * limit;

//     const whereConditions: {
//         [key: string]: any;
//     } = {};

//     if (Number(filter) > 0) {
//         whereConditions.registrationStatus = { [Op.eq]: filter };
//     }
//     const filteredWhereConditions: {
//         [key: string]: any;
//     } = {};

//     for (const key in whereConditions) {
//         if (whereConditions[key] !== undefined) {
//             filteredWhereConditions[key] = whereConditions[key];
//         }
//     }
//     const queryOptions: any = {
//         where: filteredWhereConditions,
//         attributes: {
//             exclude: ["roomId", "studentId", "schoolYearId"]
//         },
//         offset: offset,
//         limit: limit,
//         include: [
//             {
//                 model: Room
//             },
//             {
//                 model: Student,
//                 attributes: ['id','mssv', 'avatar', 'fullName', 'gender', 'email', 'numberPhone'],
//                 where: {
//                     [Op.or]: {
//                         fullName: search !== undefined && search !== "" && search !== null ? { [Op.substring]: search } : undefined,
//                         mssv: search !== undefined && search !== "" && search !== null ? { [Op.substring]: search } : undefined,
//                     }
//                 }
//             }
//         ]
//     };

//     const { count, rows } = await registrationFormRepository.findAndCountAll(queryOptions);

//     const last_page = Math.ceil(count / limit);
//     const prev_page = page - 1 < 1 ? null : page - 1;
//     const next_page = page + 1 > last_page ? null : page + 1;
//     return (count > 0) ? {
//         current_page: page,
//         prev_page,
//         next_page,
//         last_page,
//         data_per_page: limit,
//         total: count,
//         data: rows
//     } : BadRequestError("Form not found!");
// }

export const getAll = async (
    limit: number,
    page: number,
    filter: number | null = null,
    search: string | undefined = undefined
) => {
    const offset = (page - 1) * limit;


    const whereConditions: { [key: string]: any } = {};
    if (Number(filter) === 0 || Number(filter) === 1 || Number(filter) === 2) {
        whereConditions.registrationStatus = { [Op.eq]: filter };
    }

    const filteredWhereConditions: { [key: string]: any } = {};
    for (const key in whereConditions) {
        if (whereConditions[key] !== undefined) {
            filteredWhereConditions[key] = whereConditions[key];
        }
    };

    const queryOptions: any = {
        where: filteredWhereConditions,
        offset,
        limit,
    };

    if (search !== '') {
        queryOptions.include = [
            {
                model: Room,
                include: {
                    model: Building
                }
            },
            {
                model: Student,
                where: {
                    [Op.or]: {
                        fullName: search !== '' && search !== null ? { [Op.substring]: search } : undefined,
                        mssv: search !== '' && search !== null ? { [Op.substring]: search } : undefined,
                    },
                },
            },
        ]
    } else {
        queryOptions.include = [
            {
                model: Room,
                include: {
                    model: Building
                }
            },
            {
                model: Student,
                // attributes: ['id', 'mssv', 'avatar', 'fullName', 'gender', 'email', 'numberPhone'],
            }
        ]
    }

    const { count, rows } = await registrationFormRepository.findAndCountAll(queryOptions);

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
        : BadRequestError('Form not found!');
};

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

        const student = await studentRepository.findOne({ where: { id: form.studentId } });
        const roomFee = Number(form?.registrationTime) * Number(room?.price);

        const addStudentInRoom = await studentInRoomRepository.create({ roomFee, studentId: student?.id, roomId: room?.id });

        const result = await registrationFormRepository.update({ registrationStatus }, { where: { id } });
        const subject = `Đơn đăng ký phòng ${room?.roomCode}`;
        let html = `
        <p>Đơn đăng ký phòng: <b>${room?.roomCode}</b> của bạn đã được duyệt.</p>
        <p>Thời gian đăng ký ở của bạn là: <b>${form?.registrationTime} tháng</b></p>
        <p>Tổng phí phòng: <b>${roomFee}đồng</b></p>
        <h3>Vui lòng thanh toán trong thời gian thông báo trên hệ thống.</h3>`;
        sendMail(student?.email, subject, html);
        return result[0] > 0 ? success() : failed();
    }
    if (registrationStatus === 2) {
        const room = await roomRepository.findOne({ where: { id: form.roomId } });
        const student = await studentRepository.findOne({ where: { id: form.studentId } })
        const result = await registrationFormRepository.update({ registrationStatus }, { where: { id } });
        const subject = `Đơn đăng ký phòng ${room?.roomCode}`;
        let html = `
        <p>Đơn đăng ký phòng: <b>${room?.roomCode}</b> của bạn đã bị từ chối.</p>
        <h3> Phòng đã đầy hoặc thông tin đăng ký không phù hợp, vui lòng kiểm tra lại.</h3>`;
        sendMail(student?.email, subject, html);
        return result[0] > 0 ? success() : failed();
    }
    const result = await registrationFormRepository.update({ registrationStatus }, { where: { id } });
    return result[0] > 0 ? success() : failed();
}

export const checkFormUser = async (user: any) => {
    const result = await registrationFormRepository.findOne({
        where: { studentId: user.user_id }
    });
    if (!result) return BadRequestError("Not found!");
    const room = await roomRepository.findOne({
        where: { id: result.roomId }
        ,
        include: {
            model: Building,
        }
    });
    const schoolyear = await schoolYearRepository.findOne({
        where: { id: result.schoolyearId }
    })
    return {
        registrationForm: result,
        room: room,
        schoolYear: schoolyear
    };
    //    return result ? result : BadRequestError("Not found!");
}