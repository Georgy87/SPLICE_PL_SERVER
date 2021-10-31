import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginUserDto } from './dto/login-user.dto';

import { User } from './schema/user.schema';
import { UserDocument } from './schema/user.schema';

// This should be a real class/interface representing a user entity

@Injectable()
export class UsersService {
	constructor(
		@InjectModel(User.name) private userModel: Model<UserDocument>,
	) {}

	findByCond(cond: LoginUserDto) {
		return this.userModel.findOne(cond);
	}
}
