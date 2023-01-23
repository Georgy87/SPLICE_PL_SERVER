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

	async showPacks(page: string) {
		const PAGE_SIZE = 10;
		const pageCount = parseInt(page || "0");
		const total = await this.packModel.countDocuments({});
		const totalPages = total / PAGE_SIZE;
		const packs = await this.packModel.find().select('-createdAt -updatedAt -__v').limit(PAGE_SIZE).skip(PAGE_SIZE * pageCount);

		return {
			packs,
			totalPages,
		}
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

	async updatePack(update: boolean, packId: string) {
		await this.packModel.updateOne(
			{
				_id: packId,
			},
			{ $set: { update } },
		);
	}

	async updatePackViews(userId: any, packId: string) {
		const pack = await this.packModel.findOne({ $or: [{ _id: packId, userId }] });

		const months: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		
		const date: Date = new Date();

		const monthName: string = months[date.getMonth()];
		const yearName: number = date.getFullYear();

		const fieldName: string = `viewsData.${yearName}.${monthName}.y`;
		
		if (pack) {
			await this.packModel.updateOne({
				_id: packId,
			},
				{
					$inc: {
						[fieldName]: 1,
					}
				})
		}
	}
}
