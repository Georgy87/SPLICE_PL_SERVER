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
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

import { CreatePackDto } from './dto/create-pack.dto';
import { PackService } from './pack.service';

@Controller('/api')
export class PackController {
	constructor(private packService: PackService) {}

	@Post('pack')
	@UseInterceptors(
		FileFieldsInterceptor([{ name: 'picture' }, { name: 'audio' }]),
	)

	@Post()
	create(@UploadedFiles() files, @Body() dto: CreatePackDto) {
		const { picture, audio } = files;
	
		return this.packService.create(dto, picture?.[0], audio?.[0]);
	}

	@Get('packs')
	async show() {
        return this.packService.show();
	}

	@Get('pack')
	async getPack(@Query('packId') packId: string ) {
        return this.packService.getPack(packId);
	}
}
