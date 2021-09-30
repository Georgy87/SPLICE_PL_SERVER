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
import { SamplesService } from './samples.service';


@Controller('/api')
export class SamplesController {
	constructor(private samplesService: SamplesService) {}

	@Post('samples')
	@UseInterceptors(
		FileFieldsInterceptor([{ name: 'picture' }, { name: 'audio' }]),
	)

	@Post()
	create(@UploadedFiles() files) {
        console.log(files);
		// return this.samplesService.create(files);
	}
}
