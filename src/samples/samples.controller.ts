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

@Controller('samples')
export class SamplesController {
	constructor(private samplesService: SamplesService) {}

	@UseInterceptors(FileFieldsInterceptor([{ name: 'image' }, { name: 'audio' }]))
	@Post('/')
	uploadFile(
		@UploadedFiles() files,
		@Query() query: { packId: string, fileId: string },
		@Body() body: { coordinates: string, duration: string },
	) {
		const { image, audio } = files;
		const { packId, fileId } = query;
		const { coordinates, duration } = body;

		return this.samplesService.create(image[0], audio[0], packId, coordinates, fileId, duration);
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
}
