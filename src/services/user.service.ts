import * as bcryptjs from "bcryptjs";
import { BadRequestError, ErrorInterface } from "../utils/error";
import db from "../config/database.config";
import { Manager } from '../models/manager';
import { Account } from '../models/account';
import { Student } from "../models/student";
import { failed, success } from "../utils/response";
import { Op } from "sequelize";

interface UserManager {
    mscb: string;
    fullName: string;
    gender: string;
    password: string;
    email: string;
    birthday: Date;
    numberPhone: string;
    address: string;
}

interface InformationUpdate {
    fullName: string;
    gender: string;
    email: string;
    birthday: Date;
    numberPhone: string;
    address: string
}

interface UserStudent {
    fullName: string;
    gender: string;
    email: string;
    numberPhone: string;
    address: string;
    identificationNumber: string;
    major: string;
    classs: string;
    course: string;
    relativeName: string;
    relativeNumberPhone: string;
    birthday: Date,
    relationship: string
}

interface StudentAccount extends UserStudent {
    mssv: string;
    password: string;
}

const userManagerRepository = db.getRepository(Manager);
const accountRepository = db.getRepository(Account);
const userStudentRepository = db.getRepository(Student);

export const createNewManager = async ({ mscb, fullName, gender, password, email, birthday, numberPhone, address }: UserManager) => {
    const mscbExist = await userManagerRepository.findOne({ where: { mscb: mscb } });
    if (mscbExist) return BadRequestError("User manager already exists!");

    const phoneExist = await userManagerRepository.findOne({ where: { numberPhone: numberPhone } });
    if (phoneExist) return BadRequestError("Number phone already exists!");

    const passwordHash = bcryptjs.hashSync(password, 8);


    const newAccount = await accountRepository.create({
        userName: mscb,
        password: passwordHash,
        role: "admin"
    });

    const newManager = await userManagerRepository.create({
        mscb,
        fullName,
        gender,
        email,
        birthday,
        numberPhone,
        address,
        accountId: newAccount.id
    });

    return (newManager);
}

export const getOneManager = async (id: number): Promise<ErrorInterface | Manager> => {
    const findUser = await userManagerRepository.findByPk(id, { attributes: { exclude: ['accountId'] } });
    return findUser ? findUser : BadRequestError("User not found!");
};

export const getAllManager = async () => {
    const findAll = await userManagerRepository.findAll();
    return findAll ? findAll : BadRequestError("User not found!");
};

export const findOneByAccount = async (userName: string): Promise<ErrorInterface | Account> => {
    const result = await accountRepository.findOne({ where: { userName } });
    return result ? result : BadRequestError("User not found!");
}

export const findOneByUser = async (id: number) => {

    let userManager = await userManagerRepository.findOne({ where: { accountId: id } });
    let userStudent;
    if (userManager) return userManager;

    if (!userManager) {
        userStudent = await userStudentRepository.findOne({ where: { accountId: id } });
    }
    return (userStudent || BadRequestError("User not found!")) as Manager | Student;
}

export const updateManagerInformation = async (data: InformationUpdate, id: number) => {

    const findManagerUser = await userManagerRepository.findByPk(id);
    if (!findManagerUser) return BadRequestError("User not found!");

    const { email, numberPhone } = data;
    if (email) {
        const emailExists = await userManagerRepository.findOne({ where: { email, id: { [Op.ne]: id } } });
        if (emailExists) return BadRequestError("Email already exists!");
    }
    if (numberPhone) {
        const numberPhoneExists = await userManagerRepository.findOne({ where: { numberPhone, id: { [Op.ne]: id } } });
        if (numberPhoneExists) return BadRequestError("Number phone already exists!");
    }
    const result = await userManagerRepository.update(data, { where: { id } });
    return (result[0] > 0) ? success() : failed();
}

export const createNewStudent = async ({ mssv, fullName, gender, password, email, numberPhone, address, identificationNumber, classs, course, relativeName, relativeNumberPhone, birthday, relationship, major }: StudentAccount, avatar: string) => {
    const mssvExists = await userStudentRepository.findOne({ where: { mssv } });
    if (mssvExists) return BadRequestError("User already exists!");

    // const emailExists = await userStudentRepository.findOne({ where: { email } });
    // if (emailExists) return BadRequestError("Email already exists!");

    const numberPhoneExists = await userStudentRepository.findOne({ where: { numberPhone } });
    if (numberPhoneExists) return BadRequestError("Number phone already exists!");

    const identificationNumberExists = await userStudentRepository.findOne({ where: { identificationNumber } });
    if (identificationNumberExists) return BadRequestError("IdentificationNumber already exists!");

    const passwordHash = bcryptjs.hashSync(password, 8);

    const newAccount = await accountRepository.create({
        userName: mssv,
        password: passwordHash,
        role: "student"
    });

    const newStudent = await userStudentRepository.create({
        avatar,
        mssv,
        fullName,
        gender,
        email,
        birthday,
        numberPhone,
        address,
        major,
        classs,
        course,
        identificationNumber,
        relativeName,
        relativeNumberPhone,
        relationship,
        accountId: newAccount.id
    });

    return (newStudent);
}

export const getOneStudent = async (id: number): Promise<ErrorInterface | Student> => {
    const findUser = await userStudentRepository.findByPk(id, { attributes: { exclude: ['accountId'] } });
    return findUser ? findUser : BadRequestError("User not found!");
}

export const getAllStudent = async (limit: number, page: number, search: string | undefined = undefined) => {
    const offset = ((page ? page : 1) - 1) * limit;
 
    
    const whereConditions: {
        [key: string]: any;
    } = {
        [Op.or]: [
            { mssv: { [Op.substring]: search } },
            { fullName: { [Op.substring]: search } }
        ]
    };
    const queryOptions: any = {
        where: whereConditions,
        offset: offset,
        limit: limit,
    };
    const { count, rows } = await userStudentRepository.findAndCountAll(queryOptions);
    const last_page = Math.ceil(count / limit);
    const prev_page = page - 1 < 1 ? null : page - 1;
    const next_page = page + 1 > last_page ? null : page +1;
    return count > 0 ? {
        current_page: page,
        prev_page,
        next_page,
        last_page,
        data_per_page: limit,
        total: count,
        ...(search !== undefined && search !== "" && search !== null && { search_query: search }),
        data: rows
    } : BadRequestError("Empty!");
}

export const updateStudentInformation = async (id: number, data: any) => {
    const student = await userStudentRepository.findByPk(id);
    if (!student) return BadRequestError("User not found!");

    const result = await userStudentRepository.update(data, { where: { id: id } });
    return (result[0] > 0) ? success() : failed();
}

export const updateAvatar = async (id: number, avatar: string) => {
    const student = await userStudentRepository.findByPk(id);
    if (!student) return BadRequestError("User not found!");

    const result = await userStudentRepository.update({ avatar }, { where: { id: id } });
    return (result[0] > 0) ? success() : failed();
}