import { NextFunction, Request, Response } from "express"
import { BadRequestError } from "../utils/error";
import { checkImageExtension } from "../utils/validation";
import err from "./error";

export const validateImageExtension = (req: Request, res: Response, next: NextFunction) => {   

    if(!req.file && !req.files) return next(err(BadRequestError("Avatar is not empty!"), res));
    if(req.file) {
        const { filename } = req.file;
        return checkImageExtension(filename) ? next() : next(err(BadRequestError("file extension is not valid"),res));
    }
    return next();
}