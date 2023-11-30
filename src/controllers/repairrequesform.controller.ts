import { NextFunction, Request, Response } from "express";
import * as repairForm from "../services/repairrequestform.service"
import { BadRequestError, isError } from "../utils/error";
import db from "../config/database.config";
import err from "../middlewares/error";
import { Model, Op, where } from "sequelize";
import { RepairRequestForm } from "../models/repairrequestform";
import { Student } from "../models/student";
import { Room } from "../models/room";
import { Building } from "../models/building";
import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';

const repairRequestFormRepository = db.getRepository(RepairRequestForm);



export const addForm = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    const rs = await repairForm.addForm(user, req.body);
    return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
};

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
    const { limit = 6, page = 1, filter } = req.query;

    if (filter === '') {
        const rs = await repairForm.getAll(Number(limit), Number(page), null);
        return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
    } else {
        const rs = await repairForm.getAll(Number(limit), Number(page), filter);
        return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
    }
};

export const getOne = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const rs = await repairForm.getOne(Number(id));
    return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
};

export const getUserRepair = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const rs = await repairForm.getUserRepair(user);
    return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
};

export const updateOne = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { status } = req.body

    const rs = await repairForm.updateOne(Number(id), status);
    return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
};


export const exportData  = async (req: Request, res: Response, next: NextFunction) => {
    const result = await repairRequestFormRepository.findAll({
        where: {
            status: {
                [Op.not]: true,
            },
        },
        include: [
            {
                model: Room,
                include: [
                    {
                        model: Building
                    }
                ]
            },
            {
                model: Student,
            },
        ],
        order: [
            [{ model: Room, as: 'room' }, { model: Building, as: 'building' }, 'areaCode', 'ASC'],
            [{ model: Room, as: 'room' }, 'roomCode', 'ASC'],
        ],
    }
        
    );
    const exportData = result.map(item => ({
        fullName: item.student.fullName,
        mssv: item.student.mssv,
        gender: item.student.gender,
        areaCode: item.room.building.areaCode,
        roomCode: item.room.roomCode,
        roomMale: item.room.roomMale
    }));
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Exported Data');

    worksheet.columns = [
        { header: 'Họ và tên', key: 'fullName' },
        { header: 'MSSV', key: 'mssv' },
        { header: 'Giới tính', key: 'gender' },
        { header: 'Mã tòa nhà', key: 'areaCode' },
        { header: 'Mã phòng', key: 'roomCode' },
        { header: 'Phòng Nam/Nữ', key: 'roomMale' },
    ];


    exportData.forEach(item => {
        worksheet.addRow(item);
    });
    const filePath = path.join(__dirname, 'exported_data.xlsx'); 

    await workbook.xlsx.writeFile(filePath);
    res.sendFile(filePath, () => {
        fs.unlinkSync(filePath);
    });
}
 