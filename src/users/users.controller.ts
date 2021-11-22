import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/users')
export class UsersController {
	constructor(private readonly userService: UsersService) {}

	@UseGuards(JwtAuthGuard)
	@Post('email')
	changeEmail(@Req() req: any, @Body('email') email: string) {
		const userId = req.user.id;
		return this.userService.changeEmail(userId, email);
	}

	@UseGuards(JwtAuthGuard)
	@Post('name')
	changeName(@Req() req: any, @Body('fullname') fullname: string) {
		const userId = req.user.id;
		return this.userService.changeName(userId, fullname);
	}
}
