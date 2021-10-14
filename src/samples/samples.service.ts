import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { FileService, FileType } from 'src/file/file.service';
import { Samples, SamplesDocument } from './schema/samples.schema';

@Injectable()
export class SamplesService {
	constructor(
		@InjectModel(Samples.name) private samplesModel: Model<SamplesDocument>,
		private fileService: FileService,
	) {}

	async create(files: Array<Express.Multer.File>, packId: string) {
		files.forEach(async (file: Express.Multer.File) => {
			const audioPath = this.fileService.createFile(
				FileType.SAMPLES,
				file,
			);

			await this.samplesModel.create({
				sampleName: file.originalname,
				packId,
				audio: audioPath,
			});
		});
	}
}
