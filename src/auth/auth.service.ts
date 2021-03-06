import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User, UserDocument } from '../users/schema/user.schema';

@Injectable()
export class AuthService {
	constructor(@InjectModel(User.name) private userModel: Model<UserDocument>, private jwtService: JwtService) {}

	async register(dto: CreateUserDto) {
		try {
			const { email, fullname, password } = dto;

			const candidate = await this.userModel.findOne({ email, fullname });

			if (candidate) {
				throw new HttpException('User with this email already exists', HttpStatus.BAD_REQUEST);
			}

			const hashPassword = await bcrypt.hash(password, 8);

			const user = await this.userModel.create({
				...dto,
				password: hashPassword,
			});

			user.confirm_hash = await bcrypt.hash(new Date().toString(), 8);
			const data = await user.save();

			return {
				data,
				token: this.generateJwtToken(data._id),
			};
		} catch (err) {
			throw new ForbiddenException('Registration error');
		}
	}

	private generateJwtToken(data: { _id: string }) {
		const payload = { id: data._id };
		return this.jwtService.sign(payload);
	}

	async login(dto: CreateUserDto) {
		const { email } = dto;
		const user = await this.userModel.findOne({ email });

		const token = this.generateJwtToken(user._id);

		return {
			user,
			token,
			message: 'Success',
		};
	}

	async auth(userId: string) {
		const user = await this.userModel.findOne({ _id: userId }).select('-password');
		const token = this.generateJwtToken(user._id);

		return { token, user };
	}
}
