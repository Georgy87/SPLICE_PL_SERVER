import { Injectable } from '@nestjs/common';

@Injectable()
export class AudioService {
	constructor() {}

	filterData(audioBuffer: AudioBuffer) {
		const rawData = audioBuffer.getChannelData(0);

		const samples = 150;
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
		const multiplier = 36 / Math.max(...filteredData);
		return filteredData.map((n: number) => ((n * multiplier) + 1).toFixed());
	}

	sampleAudioData(buffer) {
		return this.normalizeData(this.filterData(buffer));
	}
}
