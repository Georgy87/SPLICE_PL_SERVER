import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileService } from 'src/file/file.service';
import { SamplesController } from './samples.controller';
import { SamplesService } from './samples.service';
import { Samples, SamplesSchema } from './schema/samples.schema';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Samples.name, schema: SamplesSchema },
		]),
	],
	controllers: [SamplesController],
	providers: [SamplesService, FileService],
})
export class SamplesModule {}
