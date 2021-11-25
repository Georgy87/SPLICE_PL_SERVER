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
import { FileFieldsInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { SamplesService } from './samples.service';

@Controller('/api/samples')
export class SamplesController {
	constructor(private samplesService: SamplesService) {}

	@Post('/')
	@UseInterceptors(FilesInterceptor('files'))
	uploadFile(
		@UploadedFiles() files: Array<Express.Multer.File>,
		@Query('packId') packId: string,
	) {
		return this.samplesService.create(files, packId);
	}
}
