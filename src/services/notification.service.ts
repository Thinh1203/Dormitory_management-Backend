import { BadRequestError, ErrorInterface } from "../utils/error";
import db from "../config/database.config";
import { failed, success } from "../utils/response";
import { Op } from "sequelize";
import { Notification } from "../models/notification";

const notificationRepository = db.getRepository(Notification);

export const createNotification = async (topic: string, content: string, user: any) => {
    return await notificationRepository.create({ topic, content, managerId: user.user_id });
}

export const getOne = async (id: number) => {
    const result = await notificationRepository.findByPk(id);
    return result ? result : BadRequestError("Notification not found!");
}

export const getAll = async (limit: number, page: number) => {
    const offset = ((page ? page : 1) - 1) * limit;
    const { count, rows } = await notificationRepository.findAndCountAll({
        offset: offset,
        limit: limit,
    });
    const last_page = Math.ceil(count / limit);
    const prev_page = page - 1 < 1 ? null : page - 1;
    const next_page = page + 1 > last_page ? null : page + 1;
    return count > 0 ? {
        current_page: page,
        prev_page,
        next_page,
        last_page,
        data_per_page: limit,
        total: count,
        data: rows
    } : BadRequestError("Notification not found!");
};

export const update = async (id: number, data: any) => {
    const check = await notificationRepository.findByPk(id);
    if (!check) return BadRequestError("Notification not found!")
    const result = await notificationRepository.update(data, { where: { id } })
    return (result[0] > 0) ? success() : failed();
}


export const deleteOne = async (id: number) => {
    const check = await notificationRepository.findByPk(id);
    if (!check) return BadRequestError("Notification not found!")
    const result = await notificationRepository.destroy({ where: { id } })
    return result ? success() : failed();
}