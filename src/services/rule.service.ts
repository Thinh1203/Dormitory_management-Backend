import { BadRequestError, ErrorInterface } from "../utils/error";
import db from "../config/database.config";
import { failed, success } from "../utils/response";
import { Op } from "sequelize";
import { Rule } from "../models/rule";
import { Student } from "../models/student";


const ruleRepository = db.getRepository(Rule);

export const addStudent = async (id: number, contentViolation: string, discipline: string) => {
    return await ruleRepository.create({
        studentId: id,
        contentViolation,
        discipline
    });
}


export const getAll = async (limit: number, page: number, search: string | undefined = undefined) => {
    const offset = (page - 1) * limit;

    const queryOptions: any = {
        offset: offset,
        limit: limit,
    };

    if (search !== undefined && search !== '') {
        queryOptions.include = [
            {
                model: Student,
                where: {
                    [Op.or]: {
                        fullName: { [Op.substring]: search },
                        mssv: { [Op.substring]: search },
                    },
                },
            },
        ];
    } else {
        queryOptions.include = [
            {
                model: Student,
            },
        ];
    }

    const { count, rows } = await ruleRepository.findAndCountAll(queryOptions);


    const groupedData = rows.reduce((acc: any, rule: any) => {
        const studentId = rule.student?.id;
        if (studentId) {
            if (!acc[studentId]) {
                acc[studentId] = { student: rule.student, data: [] };
            }
            acc[studentId].data.push({
                id: rule.id,
                contentViolation: rule.contentViolation,
                discipline: rule.discipline,
            });
        }
        return acc;
    }, {});

    const groupedRows = Object.values(groupedData);

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
            ...(search !== undefined && search !== '' && { search_query: search }),
            data: groupedRows,
        }
        : BadRequestError('Empty!');
};


export const getOne = async (id: number) => {
    const check = await ruleRepository.findOne({ where: { studentId: id } });
    if (!check) return BadRequestError("Not found!");
    const result = await ruleRepository.findAll({ where: { studentId: id } });
    return result ? result : BadRequestError("Empty");
}
// export const updateSchoolYear = async (id: number, data: any) => {
//     const check = await schoolYearRepository.findByPk(id);
//     if (!check) return BadRequestError("Shool year not found!");
//     const result = await schoolYearRepository.update(data, { where: { id } });
//     return (result[0] > 0) ? success() : failed();
// }

// export const deleteSchoolYear = async (id: number) => {
//     const check = await schoolYearRepository.findByPk(id);
//     if (!check) return BadRequestError("Shool year not found!");
//     const result = await schoolYearRepository.destroy({ where: { id } });
//     return (result) ? success() : failed();
// }
