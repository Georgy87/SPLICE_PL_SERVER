import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AudioService } from '../audio/audio.service';
import { FileService, FileType } from '../file/file.service';
import { Samples, SamplesDocument } from './schema/samples.schema';
import { Pack, PackDocument } from 'src/pack/schema/pack.schema';

@Injectable()
export class SamplesService {
	constructor(
		@InjectModel(Samples.name) private samplesModel: Model<SamplesDocument>,
		@InjectModel(Pack.name) private packModel: Model<PackDocument>,
		private fileService: FileService,
		private audioService: AudioService,
	) {}

	async create(
		image: Express.Multer.File,
		audio: Express.Multer.File,
		packId: string,
		coordinates: string,
		fileId: string,
		duration: string,
	) {
		const audioPath: string = await this.fileService.uploadYandexS3File(FileType.SAMPLES_AUDIO, audio);
		const imagePath: string = await this.fileService.uploadYandexS3File(FileType.CANVAS_IMAGE, image);

		const pack = await this.packModel.findOne({ _id: packId });
		
		await this.samplesModel.create({
			sampleName: audio.originalname,
			packId,
			audio: audioPath,
			audioCoordinates: coordinates,
			duration,
			canvasImage: imagePath,
			packPicture: pack.picture,
		});

		return fileId;
	}

	async setLike(userId: string, sampleId: string) {
		await this.samplesModel.updateOne({ _id: sampleId }, { $push: { likes: userId } });
		return userId;
	}

	async deleteLike(userId: string, sampleId: string) {
		await this.samplesModel.updateOne({ _id: sampleId }, { $pull: { likes: userId } });
		return userId;
	}

	async setCategory(sampleId: string, category: string) {
		await this.samplesModel.updateOne({ _id: sampleId }, { $set: { category } });
	}

	async setBpm(sampleId: string, bpm: number) {
		await this.samplesModel.updateOne({ _id: sampleId }, { $set: { bpm } });
	}
}
