import { Body, Controller, Request, UseGuards } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
	async login(@Request() req) {
		return this.authService.login(req.user);
	}

	register(@Body() dto: CreateUserDto) {
		return this.authService.register(dto);
	}
}
