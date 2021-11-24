import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
//@ts-ignore
import { AudioContext } from 'web-audio-api';

import { AudioService } from '../audio/audio.service';
import { FileService, FileType } from '../file/file.service';
import { Samples, SamplesDocument } from './schema/samples.schema';

@Injectable()
export class SamplesService {
	constructor(
		@InjectModel(Samples.name) private samplesModel: Model<SamplesDocument>,
		private fileService: FileService,
		private audioService: AudioService,
	) {}

	async create(files: Array<Express.Multer.File>, packId: string) {
		files.forEach(async (file: Express.Multer.File) => {
			const audioPath: string = this.fileService.createStaticFile(FileType.SAMPLES, file);

			const context = new AudioContext();

			context.decodeAudioData(file.buffer, async (buffer: any) => {
				const audioCoordinates = this.audioService.sampleAudioData(buffer);

				let duration = await this.audioService.getAudioDuration(
					`http://localhost:5000/${audioPath}`,
				);

				// let calcTempo: any = this.audioService.calcTempo(buffer);
				// context.decodeAudioData(`http://localhost:5000/${audioPath}`, calcTempo);

				this.samplesModel.create({
					sampleName: file.originalname,
					packId,
					audio: audioPath,
					audioCoordinates,
					duration,
				});
			});
		});
	}
}
