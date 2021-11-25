import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	UploadedFiles,
	UseInterceptors,
	Query,
	UseGuards,
	Req,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

import { CreatePackDto } from './dto/create-pack.dto';
import { PackService } from './pack.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/packs')
export class PackController {
	constructor(private packService: PackService) {}

	@UseGuards(JwtAuthGuard)
	@Post('pack')
	@UseInterceptors(FileFieldsInterceptor([{ name: 'picture' }, { name: 'audio' }]))
	@Post()
	create(@Req() req: any, @UploadedFiles() files, @Body() dto: CreatePackDto,) {
		const userId = req.user.id;
		const { picture, audio } = files;
		return this.packService.create(dto, picture?.[0], audio?.[0], userId);
	}

	@Get('/')
	async show() {
		return this.packService.show();
	}

	@Get('pack')
	async getPack(@Query('packId') packId: string) {
		return this.packService.getPack(packId);
	}

	@UseGuards(JwtAuthGuard)
	@Get('user-packs')
	async showUserPacks(@Req() req: any, ) {
		const userId = req.user.id;
		return this.packService.showUserPacks(userId);
	}
}
