import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Samples, SamplesDocument } from 'src/samples/schema/samples.schema';

//@ts-ignore
import { AudioContext } from 'web-audio-api';

@Injectable()
export class AudioService {
	constructor() {}

	filterData(audioBuffer: AudioBuffer) {
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
	}

	normalizeData(filteredData: number[]) {
		const multiplier = Math.pow(Math.max(...filteredData), -1);
		const data = filteredData.map((n: number) => n * multiplier);

		return data;
	}

	async sampleAudioData(buffer) {
		return this.normalizeData(this.filterData(buffer));
	}
}
