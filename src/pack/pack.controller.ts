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
	constructor(private trackService: PackService) {}

	@Post('pack')
	@UseInterceptors(
		FileFieldsInterceptor([{ name: 'picture' }, { name: 'audio' }]),
	)

	@Post()
	create(@UploadedFiles() files, @Body() dto: CreatePackDto) {
		const { picture, audio } = files;
	
		return this.trackService.create(dto, picture?.[0], audio?.[0]);
	}

	@Get('pack')
	async show() {
        return this.trackService.show();
	}
}
