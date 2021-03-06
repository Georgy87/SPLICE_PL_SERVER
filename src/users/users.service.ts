import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Samples } from '../samples/schema/samples.schema';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './schema/user.schema';
import { UserDocument } from './schema/user.schema';
import { SamplesDocument } from '../samples/schema/samples.schema';
import { FileService } from '../file/file.service';
import { FileType } from 'src/file/file.service';

@Injectable()
export class UsersService {
	constructor(
		@InjectModel(User.name) private userModel: Model<UserDocument>,
		@InjectModel(Samples.name) private samplesModel: Model<SamplesDocument>,
		private fileService: FileService,
	) {}

	findByCond(cond: LoginUserDto) {
		return this.userModel.findOne(cond);
	}

	async changeEmail(userId: string, email: string) {
		await this.userModel.updateOne(
			{ _id: userId },
			{
				$set: {
					email: email,
				},
			},
		);

		const user = await this.userModel.findOne({ _id: userId });
		return user;
	}

	async changeName(userId: string, fullname: string) {
		await this.userModel.updateOne(
			{ _id: userId },
			{
				$set: {
					fullname,
				},
			},
		);

		const user = await this.userModel.findOne({ _id: userId });
		return user;
	}

	async getLikedSamples(userId: any) {
		const samples = await this.samplesModel.find({ likes: userId }).populate({
		
			path: 'samples',
			populate: {
				path: 'likes',
				match: { _id: userId },
			},
			
		});
		return samples;
	}

	async createAvatar(userId: any, file) {
		const picturePath = await this.fileService.uploadYandexS3File(FileType.AVATAR, file);
		await this.userModel.updateOne({ _id: userId }, { $set: { avatar: picturePath } });
		return picturePath;
	}
}
