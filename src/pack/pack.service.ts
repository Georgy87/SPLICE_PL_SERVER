import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Pack, PackDocument } from './schema/pack.schema';
import { CreatePackDto } from './dto/create-pack.dto';
import { FileService, FileType } from 'src/file/file.service';

@Injectable()
export class PackService {
	constructor(
		@InjectModel(Pack.name) private packModel: Model<PackDocument>,
		private fileService: FileService,
	) {}

	async create(dto: CreatePackDto, picture: Express.Multer.File, audio: Express.Multer.File, userId: string) {
		// const audioPath = this.fileService.createStaticFile(FileType.AUDIO, audio);
		// const picturePath = this.fileService.createStaticFile(FileType.IMAGE, picture);
		const audioPath = await this.fileService.createAwsFile(audio);
		const picturePath = await this.fileService.createAwsFile(picture);

		await this.packModel.create({
			...dto,
			listens: 0,
			audio: audioPath,
			picture: picturePath,
			userId,
		});

		const packs = await this.packModel.find();
		return packs;
	}

	async show() {
		const packs = await this.packModel.find();
		return packs;
	}

	async getPack(packId: string) {
		const pack = await this.packModel.findOne({ _id: packId }).populate({ path: 'samples' });
		return pack;
	}
}
