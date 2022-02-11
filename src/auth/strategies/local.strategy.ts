import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UsersService } from 'src/users/users.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(
		private usersService: UsersService,
	) {
		super({ usernameField: 'email' });
	}

	async validate(email: string, password: string): Promise<any> {
		// const user = await this.usersService.findByCond({ email });

		// if (!user) {
		// 	throw new UnauthorizedException({
		// 		message: 'Пользователь не найден!',
		// 	});
		// }

		// const isPassValid = bcrypt.compareSync(password, user.password);
	
		// if (isPassValid) {
		// 	return {
		// 		user,
		// 	};
		// }
	
		// throw new UnauthorizedException({
		// 	message: 'Некорректный пароль пользователя!',
		// });
	}
}
