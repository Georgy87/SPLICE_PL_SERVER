import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { path as ffprobePath } from '@ffprobe-installer/ffprobe';

//@ts-ignore
// var MusicTempo = require("music-tempo");
// import * as execa from 'execa';

@Injectable()
export class AudioService {
	constructor() {}

	getFFprobeWrappedExecution(input: string) {
		const params = ['-v', 'error', '-show_format', '-show_streams'];

		if (typeof input === 'string') {
			// return execa(ffprobePath, [...params, input]);
		}
	}

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

	async getAudioDuration(input: string) {
		try {
			// const { stdout } = await this.getFFprobeWrappedExecution(input);
			// const matched = stdout.match(/duration="?(\d*\.\d*)"?/);
			// if (matched && matched[1]) return parseFloat(matched[1]);
		} catch (error) {
			throw new HttpException('No duration found!', HttpStatus.NOT_FOUND);
		}
	}
}
