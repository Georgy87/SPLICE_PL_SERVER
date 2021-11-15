import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

//@ts-ignore
import { AudioContext } from 'web-audio-api';

import { FileService, FileType } from '../file/file.service';
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
			
			const context = new AudioContext;
			
			await context.decodeAudioData(file.buffer, buffer => {
				const data = normalizeData(filterData(buffer));
			});

			const filterData = (audioBuffer: AudioBuffer) => {
				const rawData = audioBuffer.getChannelData(0); 
			
				const samples = 20000; 
				const blockSize = Math.floor(rawData.length / samples);
				const filteredData = [];
			
				for (let i = 0; i < samples; i++) {
					let blockStart = blockSize * i; 
				
					let sum = 0;
					for (let j = 0; j < blockSize; j++) {
						sum = sum + Math.abs(rawData[blockStart + j]); 
					}
					filteredData.push(sum / blockSize); 
				}
				return filteredData;
			};

			const normalizeData = (filteredData: number[]) => {
				const multiplier = Math.pow(Math.max(...filteredData), -1);
				const data = filteredData.map((n: number) => n * multiplier);
				this.samplesModel.create({
					sampleName: file.originalname,
					packId,
					audio: audioPath,
					dataAudio: data,
				});
				return data;
			};
		});
	}
}
