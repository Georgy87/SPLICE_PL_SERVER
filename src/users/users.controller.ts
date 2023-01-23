import { Controller, Post, Body, Req, UseGuards, Put, Get, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
	constructor(private readonly userService: UsersService) {}
	
	@UseGuards(JwtAuthGuard)
	@Put('email')
	changeEmail(@Req() req: any, @Body('email') email: string) {
		const userId = req.user.id;
		return this.userService.changeEmail(userId, email);
	}

	@UseGuards(JwtAuthGuard)
	@Put('fullname')
	changeName(@Req() req: any, @Body('fullname') fullname: string) {
		const userId = req.user.id;
		return this.userService.changeName(userId, fullname);
	}

	@UseGuards(JwtAuthGuard)
	@Get('liked-samples')
	getLikedSamples(@Req() req: any) {
		const userId = req.user.id;
		return this.userService.getLikedSamples(userId);
	}

	@UseGuards(JwtAuthGuard)
	@Put('avatar')
	@UseInterceptors(FileInterceptor('file'))
	createAvatar(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
		const userId = req.user.id;
		return this.userService.createAvatar(userId, file);
	}
}
