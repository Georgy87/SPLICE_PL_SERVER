import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

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
			const { email, fullName, password } = dto;

			const user = await this.userModel.create({
				email,
				fullname: fullName,
				password,
			});

			return {
				user,
				token: this.generateJwtToken(user),
			};
		} catch (err) {
			throw new ForbiddenException('Ошибка при регистрации');
		}
	}
}
