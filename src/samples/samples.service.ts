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
		fileId: string
	) {
		// console.log(fileId);
		// const audioPath: string = await this.fileService.createAwsFile(file);

		const imagePath: string = this.fileService.createStaticFile(FileType.CANVAS_IMAGE, image);
		const audioPath = this.fileService.createStaticFile(FileType.AUDIO, audio);

		const duration = await this.audioService.getAudioDuration(
			`http://localhost:5000/${audioPath}`,
		);

		await this.samplesModel.create({
			sampleName: audio.originalname,
			packId,
			audio: audioPath,
			audioCoordinates: coordinates,
			duration,
			canvasImage: imagePath,
		});

		// await this.packModel.updateOne(
		// 	{ _id: packId },
		// 	{
		// 		$set: {
		// 			update: true,
		// 		},
		// 	},
		// );
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
