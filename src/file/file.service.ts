import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';
import { S3 } from 'aws-sdk';
var EasyYandexS3 = require('easy-yandex-s3');

export enum FileType {
	PACK_AUDIO = 'PACK-AUDIO',
	PACK_IMAGES = 'PACK-IMAGES',
	IMAGE = 'image',
	SAMPLES = 'samples',
	CANVAS_IMAGE = 'canvas_image',
	AVATAR = 'avatar',
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

	public async uploadYandexS3File(fileType: string, file: Express.Multer.File) {
		try {
			const { buffer, originalname } = file;
			const fileExtension = originalname.split('.').pop();
			const fileName = uuid.v4() + '.' + fileExtension;
			
			const s3 = new EasyYandexS3({
				auth: {
					accessKeyId: 'ywtRFK7qDztkK-9nRD9Q',
					secretAccessKey: 'MT6mElyHNxQ1YfUROlkiysGWn80k4HqtcFZ0nULx',
				},
				Bucket: 'sample-cloud', 
				debug: true,
			});

			const upload = await s3.Upload(
				{
					buffer: buffer,
					name: fileName,
				},
				`/${fileType}/`,
			);
            
			return await upload.Location;
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
			throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	removeFile(filename: string) {}
}
