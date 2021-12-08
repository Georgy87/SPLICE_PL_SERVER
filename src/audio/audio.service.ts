import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { path as ffprobePath } from '@ffprobe-installer/ffprobe';
//@ts-ignore
// var MusicTempo = require("music-tempo");
import * as execa from 'execa';

@Injectable()
export class AudioService {
	constructor() {}

	getFFprobeWrappedExecution(input: string): execa.ExecaChildProcess {
		const params = ['-v', 'error', '-show_format', '-show_streams'];

		if (typeof input === 'string') {
			return execa(ffprobePath, [...params, input]);
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
		// const multiplier = Math.pow(Math.max(...filteredData), -1);
		return filteredData.map((n: number) => ((n * multiplier) + 1).toFixed());
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
	
	// calcTempo = function (buffer: any) {
	// 	var audioData: any = [];
	// 	// Take the average of the two channels
	// 	if (buffer.numberOfChannels == 2) {
	// 	  var channel1Data = buffer.getChannelData(0);
	// 	  var channel2Data = buffer.getChannelData(1);
	// 	  var length = channel1Data.length;
	// 	  for (var i = 0; i < length; i++) {
	// 		audioData[i] = (channel1Data[i] + channel2Data[i]) / 2;
	// 	  }
	// 	} else {
	// 	  audioData = buffer.getChannelData(0);
	// 	}
	// 	var mt = new MusicTempo(audioData);
	// 	// console.log(MusicTempo);
	// 	// console.log( audioData)
	// 	console.log(mt.tempo);
	// 	// console.log(mt.beats);
	// }
}
