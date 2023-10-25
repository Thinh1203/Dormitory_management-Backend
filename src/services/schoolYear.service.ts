import { BadRequestError, ErrorInterface } from "../utils/error";
import db from "../config/database.config";
import { failed, success } from "../utils/response";
import { Op } from "sequelize";
import { SchoolYear } from "../models/schoolyear";

interface SchoolYearSemester {
    year: string;
    semester: string
}

const schoolYearRepository = db.getRepository(SchoolYear);

export const addSchoolYear = async ({ year, semester }: SchoolYearSemester): Promise<ErrorInterface | SchoolYear> => {
    return await schoolYearRepository.create({ year, semester });
}

export const getOneSchoolYear = async (id: number): Promise<ErrorInterface | SchoolYear> => {
    const result = await schoolYearRepository.findByPk(id);
    return result ? result : BadRequestError("Shool year not found!");
}

export const getAllSchoolYear = async (): Promise<ErrorInterface | SchoolYear[]> => {
    const result = await schoolYearRepository.findAll();
    return result ? result : BadRequestError("Shool year not found!");
}

export const updateSchoolYear = async (id: number, data: any) => {
    const check = await schoolYearRepository.findByPk(id);
    if (!check) return BadRequestError("Shool year not found!");
    const result = await schoolYearRepository.update(data, { where: { id } });
    return (result[0] > 0) ? success() : failed();
}

export const deleteSchoolYear = async (id: number) => {
    const check = await schoolYearRepository.findByPk(id);
    if (!check) return BadRequestError("Shool year not found!");
    const result = await schoolYearRepository.destroy({ where: { id } });
    return (result) ? success() : failed();
}
