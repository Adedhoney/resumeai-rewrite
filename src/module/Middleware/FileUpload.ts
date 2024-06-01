import multer from 'multer';
import fs from 'fs';
import { CustomError } from '@application/Error/Error';

// File Upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folderPath = __dirname + '/../uploadedFiles';
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }
        cb(null, folderPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-UserFile-${file.originalname}`);
    },
});

const pdfFilter = (req: any, file: any, cb: any) => {
    if (file.mimetype.includes('pdf')) {
        cb(null, true);
    } else {
        return cb(new CustomError('Please upload only pdf files.'), false);
    }
};

export const UploadFile = multer({ storage, fileFilter: pdfFilter });
