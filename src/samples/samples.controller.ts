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

	@UseGuards(JwtAuthGuard)
	@Delete('like')
	deleteLike(@Req() req: any, @Query('sampleId') sampleId: string) {
		const userId = req.user.id;
		return this.samplesService.deleteLike(userId, sampleId);
	}

	@UseInterceptors(FileInterceptor('file'))
	@Post('images')
	setCanvasImage(@UploadedFile() file: Express.Multer.File, @Query('sampleId') sampleId: string) {
		return this.samplesService.setCanvasImage(file, sampleId);
	}
}
