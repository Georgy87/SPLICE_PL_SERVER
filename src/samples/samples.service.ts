import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
//@ts-ignore
import { AudioContext } from 'web-audio-api';

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

	async create(files: Array<Express.Multer.File>, packId: string) {
		files.forEach(async (file: Express.Multer.File) => {
			// const audioPath: string = await this.fileService.createAwsFile(file);
			const audioPath: string = this.fileService.createStaticFile(FileType.SAMPLES, file);
			const context = new AudioContext();

			context.decodeAudioData(file.buffer, async (buffer: any) => {
				const audioCoordinates = this.audioService.sampleAudioData(buffer);
				const audioCoordinatesJSON = JSON.stringify(audioCoordinates);
				// const duration = await this.audioService.getAudioDuration(
				// 	`${audioPath}`,
				// );

				const duration = await this.audioService.getAudioDuration(
					`http://localhost:5000/${audioPath}`,
				);

				// let calcTempo: any = this.audioService.calcTempo(buffer);
				// context.decodeAudioData(`http://localhost:5000/${audioPath}`, calcTempo);

				this.samplesModel.create({
					sampleName: file.originalname,
					packId,
					audio: audioPath,
					audioCoordinates: audioCoordinatesJSON,
					duration,
				});
			});
		});

		await this.packModel.updateOne(
			{ _id: packId },
			{
				$set: {
					update: true,
				},
			},
		);
	}

	async setLike(userId: string, sampleId: string) {
		await this.samplesModel.updateOne({ _id: sampleId }, { $push: { likes: userId } });
		return userId;
	}

	async deleteLike(userId: string, sampleId: string) {
		await this.samplesModel.updateOne({ _id: sampleId }, { $pull: { likes: userId } });
		return userId;
	}

	async setCanvasImage(file: Express.Multer.File, sampleId: string) {
		const audioPath: string = this.fileService.createStaticFile(FileType.CANVAS_IMAGE, file);
		await this.samplesModel.updateMany({ _id: sampleId }, { $set: { canvasImage: audioPath } });
	}
}
