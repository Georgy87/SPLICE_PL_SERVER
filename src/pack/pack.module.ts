import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt'; 

import { FileService } from '../file/file.service';
import { Pack, PackSchema } from './schema/pack.schema';
import { PackController } from './pack.controller';
import { PackService } from './pack.service';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Pack.name, schema: PackSchema }]),
		JwtModule.register({
			secret: 'splice-platform',
			signOptions: { expiresIn: '30d' },
		}),
	],
	controllers: [PackController],
	providers: [PackService, FileService],
})
export class PackModule {}
