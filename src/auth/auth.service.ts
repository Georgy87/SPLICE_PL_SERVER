import { ForbiddenException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
	constructor(
		private usersService: UsersService,
		private jwtService: JwtService,
	) {}

	async validateUser(username: string, pass: string): Promise<any> {
		const user = await this.usersService.findOne(username);
		if (user && user.password === pass) {
			const { password, ...result } = user;
			return result;
		}
		return null;
	}

	generateJwtToken(data: { id: number; email: string }) {
		const payload = { email: data.email, sub: data.id };
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
			// const { password, ...userData } = await this.userService.create({
			// 	email: dto.email,
			// 	fullName: dto.fullName,
			// 	password: dto.password,
			// });

			// return {
			// 	...userData,
			// 	token: this.generateJwtToken(userData),
			// };
		} catch (err) {
			throw new ForbiddenException('Ошибка при регистрации');
		}
	}
}
