import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';
import { S3 } from 'aws-sdk';

export enum FileType {
    AUDIO = 'audio',
    IMAGE = 'image',
    SAMPLES = 'samples',
}

@Injectable()
export class FileService {
    public async createAwsFile(file: Express.Multer.File) {
        try {
            const { buffer, originalname } = file;
            const fileExtension = originalname.split('.').pop();
            const fileName = uuid.v4() + '.' + fileExtension;

            const s3 = new S3();
            let upload = await s3.upload({
                Bucket: process.env.BUCKET_NAME,
                Body: buffer,
                Key: fileName,
            });

            const promise = await upload.promise();
  
            return promise.Location;
        } catch (error) {
            throw new HttpException('Ошибка загрузки файла', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public createStaticFile(type: string, file: Express.Multer.File): string {
        try {         
            const fileExtension = file.originalname.split('.').pop();
            const fileName = uuid.v4() + '.' + fileExtension;
            const filePath = path.resolve(__dirname, '..', 'static', type);
            if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath, { recursive: true });
            }
            fs.writeFileSync(path.resolve(filePath, fileName), file.buffer);
            return type + '/' + fileName;
        } catch (e) {
            throw new HttpException(
                e.message,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    removeFile(filename: string) {}
}
