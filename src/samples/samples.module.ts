import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { AudioService } from '../audio/audio.service';
import { FileService } from '../file/file.service';
import { SamplesController } from './samples.controller';
import { SamplesService } from './samples.service';
import { Samples, SamplesSchema } from './schema/samples.schema';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Samples.name, schema: SamplesSchema }]),
		JwtModule.register({
			secret: 'splice-platform',
			signOptions: { expiresIn: '30d' },
		}),
	],
	controllers: [SamplesController],
	providers: [SamplesService, FileService, AudioService],
})
export class SamplesModule {}
