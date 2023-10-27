import multer from "multer";
import * as time from "../utils/time";
import fs from "fs";

const storage = multer.diskStorage({
    destination: (req, file, next) => {
     
        const path_upload = `./public/uploads/${time.getYear()}/${time.getMonth()}`;
        fs.mkdirSync(path_upload, { recursive:true });
        next(null, path_upload);
    },
    filename: (req, file, next) => { 
        if(file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") next(null, `${time.getDay()}_${time.getHours()}_${time.getMinutes()}-${file.originalname}`);
        else next(new Error("file extension is not valid"), "");
    }
});

const upload = multer({ storage });

export default upload;  