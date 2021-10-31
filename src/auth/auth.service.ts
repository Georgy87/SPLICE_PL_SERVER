import {
	ForbiddenException,
	HttpException,
	HttpStatus,
	Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User, UserDocument } from '../users/schema/user.schema';

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(User.name) private userModel: Model<UserDocument>,
		private usersService: UsersService,
		private jwtService: JwtService,
	) {}

	async validateUser(email: string, password: string): Promise<any> {
		const user = await this.usersService.findByCond({ email, password });

		if (user && user.password === password) {
			const { password, ...result } = user;
			return result;
		}
		return null;
	}

	generateJwtToken(data: { email: string }) {
		const payload = { email: data.email };
		return this.jwtService.sign(payload);
	}

	async login(user: any) {
		const { password, ...userData } = user;
		return {
			...userData,
			token: this.generateJwtToken(userData),
		};
	}

	async register(dto: CreateUserDto) {
		try {
			const { email, fullname, password } = dto;

			const candidate = await this.userModel.findOne({ email, fullname });

			if (candidate) {
				throw new HttpException(
					'Пользователь с такой почтой уже существует',
					HttpStatus.BAD_REQUEST,
				);
			}

			const hashPassword = await bcrypt.hash(password, 8);

			const user = await this.userModel.create({
				...dto,
				password: hashPassword,
			});

			user.confirm_hash = await bcrypt.hash(new Date().toString(), 8);

			return {
				user,
				token: this.generateJwtToken(user),
			};
			
		} catch (err) {
			throw new ForbiddenException('Ошибка при регистрации');
		}
	}
}
