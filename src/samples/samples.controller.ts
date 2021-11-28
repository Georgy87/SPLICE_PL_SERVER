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
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SamplesService } from './samples.service';

@Controller('api/samples')
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

	@UseGuards(JwtAuthGuard)
	@Post('like')
	setLike(@Req() req: any, @Query('sampleId') sampleId: string) {
		const userId = req.user.id;
		return this.samplesService.setLike(userId, sampleId);
	}
}
