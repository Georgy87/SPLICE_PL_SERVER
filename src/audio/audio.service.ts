import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { path as ffprobePath } from '@ffprobe-installer/ffprobe';
import * as execa from 'execa';

@Injectable()
export class AudioService {
	constructor() {}

	private getFFprobeWrappedExecution(input: string): execa.ExecaChildProcess {
		const params = ['-v', 'error', '-show_format', '-show_streams'];

		if (typeof input === 'string') {
			return execa(ffprobePath, [...params, input]);
		}
	}

	private filterData(audioBuffer: AudioBuffer) {
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

	private normalizeData(filteredData: number[]) {
		const multiplier = Math.pow(Math.max(...filteredData), -1);
		return filteredData.map((n: number) => n * multiplier);
	}

	sampleAudioData(buffer) {
		return this.normalizeData(this.filterData(buffer));
	}

	async getAudioDuration(input: string): Promise<number> {
		try {
			const { stdout } = await this.getFFprobeWrappedExecution(input);
			const matched = stdout.match(/duration="?(\d*\.\d*)"?/);
			if (matched && matched[1]) return parseFloat(matched[1]);
		} catch (error) {
			throw new HttpException('No duration found!', HttpStatus.NOT_FOUND);
		}
	}
}
