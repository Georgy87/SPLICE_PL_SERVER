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
	UploadedFile,
} from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SamplesService } from './samples.service';

@Controller('api/samples')
export class SamplesController {
	constructor(private samplesService: SamplesService) {}

	@UseInterceptors(FileFieldsInterceptor([{ name: 'image' }, { name: 'audio' }]))
	@Post('/')
	uploadFile(
		@UploadedFiles() files,
		@Query('packId') packId: string,
		@Query('fileId') fileId: string,
		@Body('coordinates') coordinates: string,
	) {
		const { image, audio } = files;

		return this.samplesService.create(image[0], audio[0], packId, coordinates, fileId);
	}

	@UseGuards(JwtAuthGuard)
	@Post('like')
	setLike(@Req() req: any, @Query('sampleId') sampleId: string) {
		const userId = req.user.id;
		return this.samplesService.setLike(userId, sampleId);
	}

	@UseGuards(JwtAuthGuard)
	@Delete('like')
	deleteLike(@Req() req: any, @Query('sampleId') sampleId: string) {
		const userId = req.user.id;
		return this.samplesService.deleteLike(userId, sampleId);
	}

	@UseGuards(JwtAuthGuard)
	@Post('category')
	setCategory(@Query() query: { sampleId: string; category: string }) {
		const { sampleId, category } = query;
		return this.samplesService.setCategory(sampleId, category);
	}

	@UseGuards(JwtAuthGuard)
	@Post('bpm')
	setBpm(@Query() query: { sampleId: string; bpm: number }) {
		const { sampleId, bpm } = query;
		return this.samplesService.setBpm(sampleId, bpm);
	}

	@UseGuards(JwtAuthGuard)
	@Post('bpm')
	getLiBpm(@Query() query: { sampleId: string; bpm: number }) {
		const { sampleId, bpm } = query;
		return this.samplesService.setBpm(sampleId, bpm);
	}
}
