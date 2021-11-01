import { Body, Controller, Get, Post, Req, Request, UseGuards } from '@nestjs/common';

import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('registration')
	register(@Body() dto: CreateUserDto) {
		return this.authService.register(dto);
	}

	@UseGuards(LocalAuthGuard)
	@Post('login')
	async login(@Body() dto: CreateUserDto) {
		return this.authService.login(dto);
	}

	@UseGuards(JwtAuthGuard)
    @Get('auth')
    auth(@Req() req: any) {
		const userId = req.user.id;
        return this.authService.auth(userId);
    }
}
