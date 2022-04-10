import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Pack, PackDocument } from './schema/pack.schema';
import { CreatePackDto } from './dto/create-pack.dto';
import { FileService, FileType } from 'src/file/file.service';

@Injectable()
export class PackService {
	constructor(@InjectModel(Pack.name) private packModel: Model<PackDocument>, private fileService: FileService) { }

	async create(dto: CreatePackDto, picture: Express.Multer.File, audio: Express.Multer.File, userId: any) {
		const picturePath = await this.fileService.uploadYandexS3File(FileType.PACK_IMAGES, picture);
		const audioPath = await this.fileService.uploadYandexS3File(FileType.PACK_AUDIO, audio);

		await this.packModel.create({
			...dto,
			listens: 0,
			audio: audioPath,
			picture: picturePath,
			userId,
		});

		const packs = await this.packModel.find({ userId: userId });
		return packs;
	}

	async show(page: string) {
		const PAGE_SIZE = 5;
		const pageCount = parseInt(page || "0");
		const total = await this.packModel.countDocuments({});

		const packs = await this.packModel.find().limit(PAGE_SIZE).skip(PAGE_SIZE * pageCount);
		return packs;
	}

	async getPack(packId: string, tag: string | null, userId: string) {
		if (tag != 'null') {
			const pack = await this.packModel.findOne({ _id: packId }).populate({
				path: 'samples',
				match: { category: tag },
				populate: {
					path: 'likes',
					match: { _id: userId },
				},
			});
			return pack;
		} else {
			const pack = await this.packModel.findOne({ _id: packId }).populate({
				path: 'samples',
				populate: {
					path: 'likes',
					match: { _id: userId },
				},
			});
			return pack;
		}
	}

	async showUserPacks(userId: any) {
		const packs = await this.packModel.find({ userId: userId });
		return packs;
	}

	async searchPack(search: string) {
		const packs = await this.packModel.find({
			$or: [{ name: new RegExp(search, 'i') }, { genre: new RegExp(search, 'i') }],
		});
		return packs;
	}

	async update(update: boolean, packId: string) {
		await this.packModel.updateOne(
			{
				_id: packId,
			},
			{ $set: { update } },
		);
	}
}
