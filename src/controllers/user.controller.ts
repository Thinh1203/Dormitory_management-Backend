import { NextFunction, Request, Response } from "express";
import * as userServices from "../services/user.service"
import { BadRequestError, isError } from "../utils/error";
import err from "../middlewares/error";

export const createNewManager = async (req: Request, res: Response, next: NextFunction) => {
  const { mscb, fullName, gender, password, email, birthday, numberPhone, address } = req.body;
  const rs = await userServices.createNewManager({ mscb, fullName, gender, email, password, birthday, numberPhone, address });
  return isError(rs) ? next(err(rs, res)) : res.json(rs);
};

export const getOneManager = async (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id);
  const rs = await userServices.getOneManager(id);
  return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
};

export const getAllManager = async (req: Request, res: Response, next: NextFunction) => {
  const rs = await userServices.getAllManager();
  return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
};

export const updateManagerInformation = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { fullName, gender, email, numberPhone, address, birthday } = req.body;
  const rs = await userServices.updateManagerInformation({ fullName, gender, email, numberPhone, address, birthday }, Number(id));
  return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
}

export const createNewStudent = async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body);
  
  const { mssv, fullName, gender, password, email, numberPhone, address, identificationNumber, classs, course, relativeName, relativeNumberPhone, birthday, relationship, major } = req.body;
  const avatar = req.file;
  if (!avatar) return next(err(BadRequestError("Avatar is required!"), res));
  const { path } = avatar;
  const rs = await userServices.createNewStudent({ mssv, fullName, gender, password, email, numberPhone, address, identificationNumber, classs, course, relativeName, relativeNumberPhone, birthday, relationship, major }, path.replace(`public\\`, ""));
  return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
}

export const getOneStudent = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const rs = await userServices.getOneStudent(Number(id));
  return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
}

export const getInformationStudent = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  const rs = await userServices.getInformationStudent(user);
  return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
}


export const getAllStudent = async (req: Request, res: Response, next: NextFunction) => {
  const {
    limit = 10,
    page = 1,
    search
  } = req.query;
  const rs = await userServices.getAllStudent(Number(limit), Number(page), search && String(search));
  return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
}

export const updateStudentInformation = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const rs = await userServices.updateStudentInformation(Number(id), req.body);
  return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
}

export const updateAvatar = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const avatar = req.file;
  if (!avatar) return next(err(BadRequestError("Avatar is required!"), res));
  const { path } = avatar;
  const rs = await userServices.updateAvatar(Number(id), path.replace(`public\\`, ""));
  return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
}